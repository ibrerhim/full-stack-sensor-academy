import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getPrisma } from "./server/db";
import {
  hashPassword,
  comparePassword,
  generateToken,
  authenticateToken,
  requireAdmin,
  AuthenticatedRequest
} from "./server/auth";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory fallback storage to support sandbox preview seamlessly if Postgres is not migrated
const memoryUsers: any[] = [];
const memoryAttempts: any[] = [];

// Initialize a default admin user and sample student inside the memory fallback for instant previewing
(async () => {
  const adminPass = await hashPassword("admin123");
  const studentPass = await hashPassword("student123");
  
  memoryUsers.push({
    id: "admin-user-id-001",
    email: "admin@sensoracademy.com",
    passwordHash: adminPass,
    fullName: "Principal Administrator",
    studentClass: "GCE",
    joinedAt: new Date(),
    isAdmin: true,
    avatarUrl: "",
    bookmarks: { papers: [], videos: [], books: [] },
    completedVideos: []
  });

  memoryUsers.push({
    id: "student-user-id-002",
    email: "alebpeters@gmail.com",
    passwordHash: studentPass,
    fullName: "Samuel Peters",
    studentClass: "GCE",
    joinedAt: new Date(),
    isAdmin: true,
    avatarUrl: "",
    bookmarks: { papers: ["p1"], videos: ["v1"], books: ["b1"] },
    completedVideos: ["v1"]
  });

  memoryUsers.push({
    id: "student-user-id-003",
    email: "student@sensoracademy.com",
    passwordHash: studentPass,
    fullName: "Daniel Benson",
    studentClass: "GCE",
    joinedAt: new Date(),
    isAdmin: false,
    avatarUrl: "",
    bookmarks: { papers: [], videos: [], books: [] },
    completedVideos: []
  });
})();

// ==========================================
// REGISTER & AUTHENTICATION ENDPOINTS
// ==========================================

// Register a new Student or Administrator Account
app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { email, password, fullName, studentClass, isAdmin } = req.body;

  if (!email || !password || !fullName) {
    res.status(400).json({ error: "Missing required registration parameters: email, password, and fullName are required." });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const prisma = getPrisma();
    // Attempt Prisma registration
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      res.status(400).json({ error: "A student profile with this email address already exists." });
      return;
    }

    const hashed = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: hashed,
        fullName: fullName.trim(),
        studentClass: studentClass || "GCE",
        isAdmin: !!isAdmin,
        bookmarks: JSON.stringify({ papers: [], videos: [], books: [] }),
        completedVideos: JSON.stringify([])
      }
    });

    const token = generateToken({ id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin });
    
    // Parse dynamic JSON structures to match frontend React Client interfaces
    const parsedBookmarks = typeof newUser.bookmarks === "string" ? JSON.parse(newUser.bookmarks) : newUser.bookmarks;
    const parsedCompleted = typeof newUser.completedVideos === "string" ? JSON.parse(newUser.completedVideos) : newUser.completedVideos;

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        studentClass: newUser.studentClass,
        joinedAt: newUser.joinedAt,
        isAdmin: newUser.isAdmin,
        bookmarks: parsedBookmarks,
        completedVideos: parsedCompleted,
        quizAttempts: []
      }
    });

  } catch (err: any) {
    console.warn("Prisma PostgreSQL error during registration. Running memory fallback fallback:", err.message);
    
    // Fallback to SQLite/Memory mode representing robust dev environment
    const existingMemory = memoryUsers.find(u => u.email === normalizedEmail);
    if (existingMemory) {
      res.status(400).json({ error: "A student profile with this email address already exists in temporary memory storage." });
      return;
    }

    const hashed = await hashPassword(password);
    const newUser = {
      id: "mem_" + Date.now().toString(),
      email: normalizedEmail,
      passwordHash: hashed,
      fullName: fullName.trim(),
      studentClass: studentClass || "GCE",
      joinedAt: new Date(),
      isAdmin: !!isAdmin,
      bookmarks: { papers: [], videos: [], books: [] },
      completedVideos: []
    };

    memoryUsers.push(newUser);

    const token = generateToken({ id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin });
    res.status(201).json({
      token,
      user: {
        ...newUser,
        quizAttempts: []
      },
      info: "Instanced in high-performance mock sandbox memory storage."
    });
  }
});

// Authenticate and Login
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email address and password must be supplied to authenticate." });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const prisma = getPrisma();
    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { quizAttempts: true }
    });

    if (!dbUser) {
      res.status(401).json({ error: "Invalid email credentials or student file not instantiated." });
      return;
    }

    const validPassword = await comparePassword(password, dbUser.passwordHash);
    if (!validPassword) {
      res.status(401).json({ error: "Invalid password supplied." });
      return;
    }

    const token = generateToken({ id: dbUser.id, email: dbUser.email, isAdmin: dbUser.isAdmin });

    const parsedBookmarks = typeof dbUser.bookmarks === "string" ? JSON.parse(dbUser.bookmarks) : dbUser.bookmarks;
    const parsedCompleted = typeof dbUser.completedVideos === "string" ? JSON.parse(dbUser.completedVideos) : dbUser.completedVideos;

    res.json({
      token,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        fullName: dbUser.fullName,
        studentClass: dbUser.studentClass,
        joinedAt: dbUser.joinedAt,
        isAdmin: dbUser.isAdmin,
        bookmarks: parsedBookmarks,
        completedVideos: parsedCompleted,
        quizAttempts: dbUser.quizAttempts.map(att => ({
          ...att,
          answers: typeof att.answers === "string" ? JSON.parse(att.answers) : att.answers
        }))
      }
    });

  } catch (err: any) {
    console.warn("Prisma authentication failed. Falling back to active memory storage validation:", err.message);

    const memUser = memoryUsers.find(u => u.email === normalizedEmail);
    if (!memUser) {
      res.status(401).json({ error: "Invalid credentials. User details not registered." });
      return;
    }

    const validPassword = await comparePassword(password, memUser.passwordHash);
    if (!validPassword) {
      res.status(401).json({ error: "Invalid password supplied." });
      return;
    }

    const token = generateToken({ id: memUser.id, email: memUser.email, isAdmin: memUser.isAdmin });
    const userAttempts = memoryAttempts.filter(att => att.userId === memUser.id);

    res.json({
      token,
      user: {
        ...memUser,
        quizAttempts: userAttempts
      },
      info: "Authenticated utilizing dynamic virtual storage fallback."
    });
  }
});

// Get Current User Profile (Me)
app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthenticated context." });
    return;
  }

  try {
    const prisma = getPrisma();
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { quizAttempts: true }
    });

    if (!dbUser) {
      res.status(404).json({ error: "Authenticated profile records not found in database." });
      return;
    }

    const parsedBookmarks = typeof dbUser.bookmarks === "string" ? JSON.parse(dbUser.bookmarks) : dbUser.bookmarks;
    const parsedCompleted = typeof dbUser.completedVideos === "string" ? JSON.parse(dbUser.completedVideos) : dbUser.completedVideos;

    res.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        fullName: dbUser.fullName,
        studentClass: dbUser.studentClass,
        joinedAt: dbUser.joinedAt,
        isAdmin: dbUser.isAdmin,
        bookmarks: parsedBookmarks,
        completedVideos: parsedCompleted,
        quizAttempts: dbUser.quizAttempts.map(att => ({
          ...att,
          answers: typeof att.answers === "string" ? JSON.parse(att.answers) : att.answers
        }))
      }
    });
  } catch (err: any) {
    console.warn("Prisma fetching profile record failed. Fetching from active memory storage:", err.message);

    const memUser = memoryUsers.find(u => u.id === req.user?.id);
    if (!memUser) {
      res.status(404).json({ error: "Student file profile trace could not be fetched." });
      return;
    }

    const userAttempts = memoryAttempts.filter(att => att.userId === memUser.id);
    res.json({
      user: {
        ...memUser,
        quizAttempts: userAttempts
      }
    });
  }
});

// ==========================================
// STUDENT WORKSPACE TRACKING APIs
// ==========================================

// Save/Update Student Bookmarks portfolio
app.put("/api/users/bookmarks", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { bookmarks } = req.body;
  if (!req.user) {
    res.status(401).json({ error: "Authorization credentials requested." });
    return;
  }

  try {
    const prisma = getPrisma();
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        bookmarks: bookmarks ? JSON.stringify(bookmarks) : JSON.stringify({ papers: [], videos: [], books: [] })
      }
    });

    const parsedBookmarks = typeof updatedUser.bookmarks === "string" ? JSON.parse(updatedUser.bookmarks) : updatedUser.bookmarks;
    res.json({ success: true, bookmarks: parsedBookmarks });
  } catch (err: any) {
    console.warn("Saving databases bookmarks failed. Saving to active memory layer:", err.message);

    const memUserIndex = memoryUsers.findIndex(u => u.id === req.user?.id);
    if (memUserIndex !== -1) {
      memoryUsers[memUserIndex].bookmarks = bookmarks || { papers: [], videos: [], books: [] };
      res.json({ success: true, bookmarks: memoryUsers[memUserIndex].bookmarks });
    } else {
      res.status(404).json({ error: "User profile context not found." });
    }
  }
});

// Save complete quiz attempt
app.post("/api/quizzes/attempt", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { quizId, quizTitle, subject, score, totalQuestions, percentage, answers } = req.body;
  
  if (!req.user) {
    res.status(401).json({ error: "Missing authentication parameters." });
    return;
  }

  try {
    const prisma = getPrisma();
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        quizId,
        quizTitle,
        subject,
        score: Number(score),
        totalQuestions: Number(totalQuestions),
        percentage: Number(percentage),
        answers: JSON.stringify(answers || {})
      }
    });

    res.status(201).json({
      ...attempt,
      answers: typeof attempt.answers === "string" ? JSON.parse(attempt.answers) : attempt.answers
    });
  } catch (err: any) {
    console.warn("Prisma saving score to database failed. Appending to memory store:", err.message);

    const mockAttempt = {
      id: "att_mock_" + Date.now().toString(),
      userId: req.user.id,
      quizId,
      quizTitle,
      subject,
      score: Number(score),
      totalQuestions: Number(totalQuestions),
      percentage: Number(percentage),
      takenAt: new Date().toISOString(),
      answers: answers || {}
    };

    memoryAttempts.push(mockAttempt);
    res.status(201).json(mockAttempt);
  }
});

// Mark / track completed educational stream videos
app.put("/api/users/videos", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { completedVideos } = req.body;
  if (!req.user) {
    res.status(401).json({ error: "Unauthenticated context log call." });
    return;
  }

  try {
    const prisma = getPrisma();
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        completedVideos: JSON.stringify(completedVideos || [])
      }
    });

    const parsed = typeof updated.completedVideos === "string" ? JSON.parse(updated.completedVideos) : updated.completedVideos;
    res.json({ success: true, completedVideos: parsed });
  } catch (err: any) {
    const memIdx = memoryUsers.findIndex(u => u.id === req.user?.id);
    if (memIdx !== -1) {
      memoryUsers[memIdx].completedVideos = completedVideos || [];
      res.json({ success: true, completedVideos: memoryUsers[memIdx].completedVideos });
    } else {
      res.status(404).json({ error: "User session target has expired." });
    }
  }
});

// ==========================================
// ADMINISTRATOR ROLES & STUDENT MANAGEMENTS
// ==========================================

// Get All Users (Admin Privileges Only)
app.get("/api/admin/users", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const prisma = getPrisma();
    const users = await prisma.user.findMany({
      include: { quizAttempts: true }
    });

    const formatted = users.map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      studentClass: u.studentClass,
      joinedAt: u.joinedAt,
      isAdmin: u.isAdmin,
      bookmarks: typeof u.bookmarks === "string" ? JSON.parse(u.bookmarks) : u.bookmarks,
      completedVideos: typeof u.completedVideos === "string" ? JSON.parse(u.completedVideos) : u.completedVideos,
      quizAttempts: u.quizAttempts.map(att => ({
        ...att,
        answers: typeof att.answers === "string" ? JSON.parse(att.answers) : att.answers
      }))
    }));

    res.json({ users: formatted });
  } catch (err: any) {
    console.warn("Admin query failed. Reading fallback memory:", err.message);
    
    // Provide active memory user database for local administrative management view
    const formattedMock = memoryUsers.map(u => ({
      ...u,
      quizAttempts: memoryAttempts.filter(att => att.userId === u.id)
    }));

    res.json({ users: formattedMock });
  }
});

// Toggle Administrator role or update class for a specfic student profile (Admin Only)
app.put("/api/admin/users/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { isAdmin, studentClass, fullName } = req.body;

  try {
    const prisma = getPrisma();
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(isAdmin !== undefined && { isAdmin: !!isAdmin }),
        ...(studentClass && { studentClass }),
        ...(fullName && { fullName: fullName.trim() })
      }
    });

    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.warn("DB update error. Editing in memory collection:", err.message);

    const memIdx = memoryUsers.findIndex(u => u.id === id);
    if (memIdx !== -1) {
      if (isAdmin !== undefined) memoryUsers[memIdx].isAdmin = !!isAdmin;
      if (studentClass) memoryUsers[memIdx].studentClass = studentClass;
      if (fullName) memoryUsers[memIdx].fullName = fullName.trim();

      res.json({ success: true, user: memoryUsers[memIdx] });
    } else {
      res.status(404).json({ error: "Target Student file id does not exist in any context store." });
    }
  }
});

// Delete student account file (Admin Control Option)
app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const prisma = getPrisma();
    await prisma.user.delete({
      where: { id }
    });
    res.json({ success: true, message: "Authorized Student File successfully purged." });
  } catch (err: any) {
    console.warn("DB delete error, purging from offline-mock memory collections:", err.message);

    const memIdx = memoryUsers.findIndex(u => u.id === id);
    if (memIdx !== -1) {
      memoryUsers.splice(memIdx, 1);
      res.json({ success: true, message: "Student account file successfully purged from temporary sandbox database layer." });
    } else {
      res.status(404).json({ error: "Selected student profile file not located." });
    }
  }
});

// ==========================================
// VITE CLIENT INTEGRATION MIDDLEWARE & BOOTSTRAP
// ==========================================
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Spark up Express server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Sensor Academy Full-Stack] Server actively running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Critical server bootstrap failure:", err);
  process.exit(1);
});
