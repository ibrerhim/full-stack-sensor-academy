import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, BookOpen, Clock, AlertCircle, User, Check, RefreshCw } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  sender: "student" | "ai";
  text: string;
  timestamp: string;
}

export default function AiStudyAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "ai",
      text: "👋 Hello! I am Sensor Mentor, your dedicated AI Study Assistant. Choose a study card below or ask me any question about GCE/Form 1–4 curriculum. I can solve mathematics steps, explain chemistry trends, suggest essay tips, and more!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("sensor_ai_key") || "");
  const [isKeySaved, setIsKeySaved] = useState(!!localStorage.getItem("sensor_ai_key"));
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("sensor_ai_key", apiKey.trim());
      setIsKeySaved(true);
    } else {
      localStorage.removeItem("sensor_ai_key");
      setIsKeySaved(false);
    }
  };

  const handlePromptCard = (prompt: string) => {
    setInputValue(prompt);
  };

  const generateOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("photosynthesis") || q.includes("plant")) {
      return `🌱 **Photosynthesis Explained (Biology Syllabus):**\n\nPhotosynthesis is the safe biochemical process where green plants synthesize glucose from carbon dioxide and water using light energy from the sun trapped by chlorophyll.\n\n**The Balanced Chemical Equation:**\n6CO₂ + 6H₂O —(Light/Chlorophyll)—> C₆H₁₂O₆ + 6O₂\n\n**Two Key Stages:**\n1. **Light-Dependent Stage (Thylakoids):** Light splits water (Photolysis) to produce hydrogen ions, oxygen gas (released), and chemical energy (ATP).\n2. **Light-Independent Stage / Calvin Cycle (Stroma):** Carbon dioxide combines with hydrogen using ATP to compose glucose sugars.`;
    }
    if (q.includes("quadratic") || q.includes("factor") || q.includes("solve") || q.includes("equation") || q.includes("x^2") || q.includes("algebra")) {
      return `📐 **Algebraic Quadratic Equation Resolver (Mathematics Syllabus):**\n\nFor any quadratic equation in standard format **ax² + bx + c = 0**:\n\n**1. Factoring Method:**\nIf solving x² - 5x + 6 = 0, find two factors of +6 that sum to -5 (which are -2 and -3). Therefore, (x-2)(x-3) = 0, meaning roots are **x = 2** or **x = 3**.\n\n**2. The Quadratic Formula:**\nx = [-b ± √(b² - 4ac)] / 2a\n\n**Example:** Solve 2x² - 5x + 2 = 0:\nDiscriminant Δ = (-5)² - 4(2)(2) = 25 - 16 = 9.\nx = [5 ± √9] / 4 => x = [5 ± 3] / 4.\nRoots: **x = 2** or **x = 0.5**.`;
    }
    if (q.includes("essay") || q.includes("composition") || q.includes("english") || q.includes("write")) {
      return `✍️ **English Essay Writing Guideline (GCE/ZIMSEC Syllabus):**\n\nTo score maximum marks on essay compositions, structure is paramount:\n\n1. **The Hook (Intro):** Capture the examiners attention using sensory details, a powerful rhetorical question, or an atmospheric description.\n2. **Paragraph Unity:** Every paragraph must convey *one* single clear point linked back to the topic outline.\n3. **Vivid Vocabulary:** Replace blank, plain words. Use "industrious" instead of "hardworking," "conflagration" instead of "fire," and "ebullient" for "very happy."\n4. **The Clincher (Conclusion):** Summarize concisely without introducing brand-new ideas, ending with a lingering thought or lesson learned.`;
    }
    if (q.includes("pseudocode") || q.includes("ict") || q.includes("logic") || q.includes("loop") || q.includes("programming")) {
      return `💻 **Pseudocode & Algorithms Syllabus Guide (ICT):**\n\nPseudocode is an informal high-level description of key programming logic, independent of any language syntax.\n\n**Common Loop Structures:**\n- **FOR...TO...NEXT** (Count-controlled loop when iterations are pre-determined).\n- **WHILE...DO...ENDWHILE** (Pre-test loop repeating while a logic condition holds true).\n- **REPEAT...UNTIL** (Post-test loop guaranteed to execute at least once).\n\n**Example: Summing Numbers 1 to 10:**\n\`\`\`text\nDECLARE sum, count : INTEGER\nsum <- 0\nFOR count <- 1 TO 10\n  sum <- sum + count\nNEXT count\nOUTPUT \"The cumulative sum is: \", sum\n\`\`\``;
    }
    return `📚 **Sensor Active Study Assistant:**\n\nThat is an excellent curriculum topic! To provide a highly precise, personalized AI answer tailored exactly to your curriculum and prompt, **please enter a personal Gemini API Key** in the security box above. \n\n**Quick Revision Tips:**\n- Review past papers corresponding to this subject under the *Past Papers* navigation tab.\n- Browse relevant textbooks in the *Digital Library* for structural notes.\n- Take timed multiple-choice tests under *Quizzes* for active recall.`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const studentMessage: Message = {
      id: "student_" + Date.now(),
      sender: "student",
      text: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, studentMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // If client api key is saved/entered, we trigger standard Gemini dynamic model API
      if (isKeySaved && apiKey.trim()) {
        const aiEngine = new GoogleGenAI({ apiKey: apiKey.trim() });
        const response = await aiEngine.models.generateContent({
          model: "gemini-2.5-flash", // correct and modern flash model
          contents: `You are 'Sensor Mentor', a highly encouraging, friendly, and precise AI Study Tutor at Sensor Academy platform. 
          Help secondary school and GCE students master their syllabus in Mathematics, English, Biology, Chemistry, ICT, and Physical Science.
          Keep responses concise, structural, scannable, formatted with bullet points, and geared towards exam success.
          
          Student's syllabus query: ${studentMessage.text}`,
        });

        const reply = response.text || "I was unable to formulate a solution strategy. Please try again.";
        const aiMessage: Message = {
          id: "ai_" + Date.now(),
          sender: "ai",
          text: reply,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Fallback to structured offline curriculum generator
        setTimeout(() => {
          const reply = generateOfflineResponse(studentMessage.text);
          const aiMessage: Message = {
            id: "ai_" + Date.now(),
            sender: "ai",
            text: reply,
            timestamp: new Date().toISOString()
          };
          setMessages((prev) => [...prev, aiMessage]);
          setIsLoading(false);
        }, 800);
        return;
      }
    } catch (error) {
      console.error(error);
      const aiMessage: Message = {
        id: "ai_" + Date.now(),
        sender: "ai",
        text: "❌ **Gemini API Error:** The API call could not complete. This usually happens if the API key is expired or invalid. Please check your key configuration, use the prompt guides below, or retry with a valid key.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-assistant-page" className="bg-slate-950 min-h-screen text-slate-100 flex flex-col pt-4">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-4 space-y-4 pb-20">
        
        {/* API Key Security Ribbon */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Unlock Live Gemini 2.5 Flash Tutors</p>
              <p className="text-[10px] text-slate-400">Save a personal API Key locally to experience dynamic syllabus querying. Your key is kept secure inside your browser.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
            <input
              type="password"
              placeholder="Enter Gemini API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full md:w-48 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <button
              onClick={handleSaveKey}
              className={`p-1.5 px-3 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all active:scale-95 ${
                isKeySaved
                  ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/30"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {isKeySaved ? <Check className="w-4.5 h-4.5" /> : <span>Activate</span>}
            </button>
          </div>
        </div>

        {/* Chat Thread Canvas */}
        <div className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4 sm:p-5 flex flex-col h-[420px] sm:h-[480px] overflow-hidden justify-between shadow-inner">
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[350px] sm:max-h-[410px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "student" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed font-sans ${
                  m.sender === "student"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none whitespace-pre-wrap"
                }`}>
                  <div className="flex items-center space-x-1.5 mb-1.5 text-[9px] uppercase font-mono tracking-wider font-bold opacity-60">
                    {m.sender === "student" ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-blue-400" />}
                    <span>{m.sender === "student" ? "Student" : "Sensor Tutor"}</span>
                  </div>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center space-x-2 rounded-bl-none">
                  <RefreshCw className="w-4.5 h-4.5 animate-spin text-blue-500" />
                  <span className="text-[10px] text-slate-400 font-mono">Tutor processing your solution strategy...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick study preset cards */}
          <div className="border-t border-slate-800/40 pt-4 mt-2">
            <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-slate-500 block mb-2">Syllabus Practice Cards</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePromptCard("Explain photosynthesis and chemical equation")}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] text-slate-350 hover:text-white font-semibold transition-all"
              >
                🌱 Biology: Photosynthesis
              </button>
              <button
                onClick={() => handlePromptCard("Solve quadratic equation roots and formulas")}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] text-slate-350 hover:text-white font-semibold transition-all"
              >
                📐 Maths: Quadratic Solver
              </button>
              <button
                onClick={() => handlePromptCard("Vivid writing tips for English essays")}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] text-slate-350 hover:text-white font-semibold transition-all"
              >
                ✍️ English: Essay Tips
              </button>
              <button
                onClick={() => handlePromptCard("Explain ICT program loop pseudocode")}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] text-slate-350 hover:text-white font-semibold transition-all"
              >
                💻 ICT: Pseudocode Loops
              </button>
            </div>
          </div>
        </div>

        {/* Text Area Messenger */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2.5">
          <input
            type="text"
            disabled={isLoading}
            placeholder="Type your academic or syllabus help query..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 px-4 py-3 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/15 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
