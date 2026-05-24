import { Subject, Video, PastPaper, Book, Quiz, Notification, Announcement } from './types';

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'maths', name: 'Mathematics', icon: 'Calculator', description: 'Algebra, Geometry, Calculus & Statistics', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'english', name: 'English Language', icon: 'BookOpen', description: 'Comprehension, Grammar, Essay & Creative Writing', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'biology', name: 'Biology', icon: 'Dna', description: 'Cell biology, Ecology, Human Anatomy & Genetics', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'chemistry', name: 'Chemistry', icon: 'FlaskConical', description: 'Periodic Table, Acids, Stoichiometry & Organic Chemistry', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'ict', name: 'ICT', icon: 'Laptop', description: 'Data structures, Programming, Hardware & Networks', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  { id: 'science', name: 'Physical Science', icon: 'Atom', description: 'Physics, Thermodynamics, Energy & Mechanics', color: 'bg-red-50 text-red-700 border-red-200' }
];

export const INITIAL_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Comprehensive Quadratic Equations Tutorial',
    duration: '18:45',
    subject: 'Mathematics',
    level: 'Form 4',
    videoUrl: 'https://www.youtube.com/embed/SFC83IUP8Z4', // Real educational video style if embedded
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60',
    description: 'Master the quadratic formula, factorization method, and solving by completing the square. Includes standard exam questions solved step-by-step.',
    uploadedAt: '2026-05-10',
    instructor: 'Mr. Sensor Joshua'
  },
  {
    id: 'v2',
    title: 'Writing A Grade-A Narrative Essay',
    duration: '14:20',
    subject: 'English Language',
    level: 'GCE',
    videoUrl: 'https://www.youtube.com/embed/9N2_3-3_h14', // Placeholder embedded
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=60',
    description: 'Learn structure, hook, vocabulary choices, and figurative devices required to score maximum marks on narrative compositions in exam settings.',
    uploadedAt: '2026-05-12',
    instructor: 'Aunt Evelyn Peters'
  },
  {
    id: 'v3',
    title: 'Osmosis & Diffusion Demystified',
    duration: '22:15',
    subject: 'Biology',
    level: 'Grade 10',
    videoUrl: 'https://www.youtube.com/embed/jZz7BfWcWwA',
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&auto=format&fit=crop&q=60',
    description: 'Visual demonstration of active transport, diffusion, and osmosis across membranes. Exam focus on plant cell turgidity experiments.',
    uploadedAt: '2026-05-15',
    instructor: 'Dr. Sarah Ndlovu'
  },
  {
    id: 'v4',
    title: 'Chemical Bonding & Periodic Periodic Trends',
    duration: '25:30',
    subject: 'Chemistry',
    level: 'Grade 11',
    videoUrl: 'https://www.youtube.com/embed/I99gK8l_6k0',
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&auto=format&fit=crop&q=60',
    description: 'Core concepts of ionic, covalent, and metallic bonding, as well as period 3 element trends and atomic structure definitions.',
    uploadedAt: '2026-05-18',
    instructor: 'Mr. Sensor Joshua'
  },
  {
    id: 'v5',
    title: 'Introduction to Python & Logic Gates',
    duration: '19:50',
    subject: 'ICT',
    level: 'Grade 12',
    videoUrl: 'https://www.youtube.com/embed/k9WqpQp8QS0',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=60',
    description: 'Familiarize yourself with fundamental programming logic, NAND/A/OR gates, truth tables, and exam pseudocode parsing.',
    uploadedAt: '2026-05-20',
    instructor: 'Eng. Kelvin Chanda'
  },
  {
    id: 'v6',
    title: 'Understanding Newton’s Laws of Motion',
    duration: '17:10',
    subject: 'Physical Science',
    level: 'Form 3',
    videoUrl: 'https://www.youtube.com/embed/kKKM8Y-u7ds',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60',
    description: 'An application-based exploration of Newton’s First, Second, and Third laws of motion, force diagrams, and momentum formula applications.',
    uploadedAt: '2026-05-22',
    instructor: 'Dr. Sarah Ndlovu'
  }
];

export const INITIAL_PAPERS: PastPaper[] = [
  {
    id: 'p1',
    title: 'Mathematics Paper 1 (Non-Calculator) - June 2024',
    subject: 'Mathematics',
    year: 2024,
    level: 'GCE',
    examType: 'GCE',
    pdfUrl: 'exam_maths_p1_2024.pdf',
    downloadCount: 420,
    description: 'Pure Algebra, Trigonometric Coordinates, Sequence, and Series equations revision.',
    questionsCount: 4,
    structuredQuestions: [
      { id: 'p1_q1', section: 'Section A', number: '1', questionText: 'Solve the simultaneous equations:\n3x + 2y = 12\n5x - y = 7', marks: 4, sampleAnswer: 'Multiply Eq 2 by 2: 10x - 2y = 14.\nAdd to Eq 1: (3x + 10x) + (2y - 2y) = 12 + 14 => 13x = 26 => x = 2.\nSubstitute x=2 in Eq 1: 3(2) + 2y = 12 => 6 + 2y = 12 => 2y = 6 => y = 3.\nTherefore, x = 2 and y = 3.' },
      { id: 'p1_q2', section: 'Section A', number: '2', questionText: 'Given that f(x) = (2x + 5)/(x - 3) where x is not equal to 3, find the inverse function f⁻¹(x).', marks: 5, sampleAnswer: 'Let y = (2x + 5)/(x - 3).\nMultiply: y(x - 3) = 2x + 5 => xy - 3y = 2x + 5.\nGroup x terms: xy - 2x = 3y + 5.\nFactor x: x(y - 2) = 3y + 5.\nSolve for x: x = (3y + 5)/(y - 2).\nTherefore, f⁻¹(x) = (3x + 5)/(x - 2).' },
      { id: 'p1_q3', section: 'Section B', number: '3(a)', questionText: 'Prove that the sum of the interior angles of a regular hexagon is 720 degrees.', marks: 3, sampleAnswer: 'Formula for sum of interior angles of a polygon with n sides: S = (n - 2) * 180.\nFor a hexagon, n = 6.\nS = (6 - 2) * 180 = 4 * 180 = 720 degrees.\nHence proved.' },
      { id: 'p1_q4', section: 'Section B', number: '3(b)', questionText: 'Calculate the size of each interior angle of the regular hexagon.', marks: 2, sampleAnswer: 'Since it is a regular hexagon, all 6 interior angles are equal.\nEach interior angle = 720 / 6 = 120 degrees.' }
    ]
  },
  {
    id: 'p2',
    title: 'English Language P1 (Composition) - November 2023',
    subject: 'English Language',
    year: 2023,
    level: 'Form 4',
    examType: 'ZIMSEC',
    pdfUrl: 'exam_english_zimsec_2023.pdf',
    downloadCount: 310,
    description: 'Discursive, narrative, and letter-writing paper with complete exam scoring blueprints.',
    questionsCount: 3,
    structuredQuestions: [
      { id: 'p2_q1', section: 'Section 1', number: '1', questionText: 'Write a narrative essay ending with: “...if I had known, I would have made a different choice.”', marks: 50, sampleAnswer: 'Plan:\n- Introduction: Establish a normal morning, a turning point where a minor choice has to be made (e.g., choosing a different path to school or taking a ride from a stranger).\n- Body Paragraphs: Build suspense, explain the unfolding events and the consequences of the selection.\n- Climax: The confrontation or realization of danger.\n- Resolution: Safe but regretful outcome leading logically to the prompt line ending.' },
      { id: 'p2_q2', section: 'Section 2', number: '2', questionText: 'You are concerned about the increase in plastic pollution in your local shopping area. Write a speech to deliver to residents suggesting three ways the community can clean up the environment.', marks: 30, sampleAnswer: 'Key features of a speech:\n- Appropriate address structure ("Dear community members...", "Ladies and gentleman...").\n- Introduction of environmental issue.\n- Core proposals (e.g., localized weekend cleanup drives, putting up recycling bins, charging local businesses plastic bag fees).\n- Call to action with a highly inspiring concluding speech statement.' }
    ]
  },
  {
    id: 'p3',
    title: 'Biology Theory Paper 2 - November 2023',
    subject: 'Biology',
    year: 2023,
    level: 'Grade 11',
    examType: 'National Exams',
    pdfUrl: 'exam_biology_2023.pdf',
    downloadCount: 220,
    description: 'Cell division, inheritance patterns, and photosynthesis pathways exam paper.',
    questionsCount: 3,
    structuredQuestions: [
      { id: 'p3_q1', section: 'Section A', number: '1', questionText: 'Describe the differences between Mitosis and Meiosis regarding:\n(i) Parent and daughter cell chromosome numbers\n(ii) Number of cell divisions\n(iii) Genetic consistency of resulting daughter cells', marks: 6, sampleAnswer: '(i) Mitosis produces diploid (2n) daughter cells having the same chromosome number as the parent. Meiosis produces haploid (n) daughter cells with half the chromosomes.\n(ii) Mitosis involves 1 cell division; Meiosis involves 2 divisions.\n(iii) Mitosis results in genetically identical daughter cells (clones). Meiosis creates genetic variation due to crossing over and independent assortment.' },
      { id: 'p3_q2', section: 'Section A', number: '2', questionText: 'Outline the steps of the light-dependent stage of Photosynthesis.', marks: 4, sampleAnswer: '1. Chlorophyll molecules in the chloroplast thylakoids absorb solar energy.\n2. Light energy splits water molecules into Hydrogen ions, electrons, and Oxygen gas (Photolysis).\n3. Excited electrons move down the transport chain.\n4. Energy released is used to synthesize ATP and NADPH needed for the dark stage (Calvin cycle).' }
    ]
  },
  {
    id: 'p4',
    title: 'Chemistry Practical & Theory Paper - October 2024',
    subject: 'Chemistry',
    year: 2024,
    level: 'Grade 12',
    examType: 'Cambridge',
    pdfUrl: 'chem_cambridge_24.pdf',
    downloadCount: 180,
    description: 'Gas preparation, kinetic theory, and salt identification tables revision.',
    questionsCount: 2,
    structuredQuestions: [
      { id: 'p4_q1', section: 'Section A', number: '1', questionText: 'State Avogadro’s law and calculate the volume occupied by 8.8 grams of Carbon Dioxide (CO₂) at RTP. (RAM: C=12, O=16, 1 mole of gas = 24dm³ at RTP)', marks: 4, sampleAnswer: 'Avogadro’s law states that equal volumes of gases under identical temperature and pressure contain identical number of molecules.\nMr of CO₂ = 12 + (16*2) = 44 g/mol.\nMoles in 8.8g of CO₂ = 8.8 / 44 = 0.2 mol.\nVolume at RTP = 0.2 mol * 24 dm³/mol = 4.8 dm³.' }
    ]
  },
  {
    id: 'p5',
    title: 'ICT Foundations & Programming P1 - June 2024',
    subject: 'ICT',
    year: 2024,
    level: 'GCE',
    examType: 'GCE',
    pdfUrl: 'ict_gce_p1_2024.pdf',
    downloadCount: 250,
    description: 'Database design, network topologies, and assembly level instructions parsing.',
    questionsCount: 2,
    structuredQuestions: [
      { id: 'p5_q1', section: 'Section A', number: '1', questionText: 'Construct a truth table for the logical boolean expression A AND (B OR NOT C).', marks: 6, sampleAnswer: 'Inputs: A, B, C (8 rows)\n1. Evaluate NOT C\n2. Evaluate (B OR NOT C)\n3. Finally, AND with A.\nRows result true only when:\n- A=1, B=1, C=0\n- A=1, B=1, C=1\n- A=1, B=0, C=0\nOtherwise resulting in 0.' }
    ]
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Sensor Mathematics Revision Companion',
    author: 'Prof. S. Sensor & Team',
    subject: 'Mathematics',
    level: 'Form 1-4',
    description: 'A complete textbook containing condensed curriculum-aligned notes, 1500+ solved practice examples, and 10 years of past examination revision questions broken down by topic.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60',
    downloadCount: 640,
    fileSize: '14.2 MB',
    pdfUrl: 'sensor_maths_companion.pdf'
  },
  {
    id: 'b2',
    title: 'English Language Essay Guide',
    author: 'Aunt Evelyn Peters',
    subject: 'English Language',
    level: 'Form 1-4',
    description: 'Step-by-step instructional writing guides for discursive essays, argumentative writeups, reports, and formal letters. Equipped with model answers, transitional words handbook, and grammar correction checklists.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60',
    downloadCount: 490,
    fileSize: '8.5 MB',
    pdfUrl: 'english_essay_guide.pdf'
  },
  {
    id: 'b3',
    title: 'Step-by-Step Practical Chemistry Lab Manual',
    author: 'Mr. Sensor Joshua',
    subject: 'Chemistry',
    level: 'Grade 11-12',
    description: 'Complete practical laboratory reference guide covering volumetric analysis (titration), qualitative analyses of ions (cations/anion tests with reagent charts), and experiment configurations.',
    coverImage: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=500&auto=format&fit=crop&q=60',
    downloadCount: 290,
    fileSize: '11.1 MB',
    pdfUrl: 'chemistry_lab_manual.pdf'
  },
  {
    id: 'b4',
    title: 'Biology Illustrated Quick Revision Book',
    author: 'Dr. Sarah Ndlovu',
    subject: 'Biology',
    level: 'GCE',
    description: 'Highly visual revision notes containing hand-drawn diagrams, mnemonic lists, and cell structures study worksheets. Perfect for quick reviews the evening before major national examinations.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
    downloadCount: 380,
    fileSize: '18.9 MB',
    pdfUrl: 'biology_quick_revision.pdf'
  },
  {
    id: 'b5',
    title: 'ICT Programming & Database Handouts',
    author: 'Eng. Kelvin Chanda',
    subject: 'ICT',
    level: 'Grade 10-12',
    description: 'An instructional handbook written specially for students venturing into computational math, structured pseudocoding, SQL database operations, and system development analysis.',
    coverImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&auto=format&fit=crop&q=60',
    downloadCount: 200,
    fileSize: '6.3 MB',
    pdfUrl: 'ict_programming_handouts.pdf'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    title: 'Quadratic Equations & Algebra Challenge',
    subject: 'Mathematics',
    level: 'Form 4',
    durationMinutes: 10,
    attemptsCount: 840,
    highScore: 100,
    questions: [
      {
        id: 'q1_1',
        questionText: 'Which of the following represents the quadratic formula for solving ax² + bx + c = 0?',
        options: [
          'x = (b ± √(b² - 4ac)) / (2a)',
          'x = (-b ± √(b² - 4ac)) / (2a)',
          'x = (-b ± √(b² + 4ac)) / a',
          'x = (b ± √(b² + 4ac)) / (2a)'
        ],
        correctOptionIndex: 1,
        explanation: 'The standard quadratic formula is x = (-b ± √(b² - 4ac)) / (2a).'
      },
      {
        id: 'q1_2',
        questionText: 'Find the roots of the quadratic equation x² - 5x + 6 = 0.',
        options: [
          'x = -2, x = -3',
          'x = 1, x = 6',
          'x = 2, x = 3',
          'x = -1, x = 5'
        ],
        correctOptionIndex: 2,
        explanation: 'Factoring: x² - 5x + 6 = (x - 2)(x - 3) = 0. Therefore, roots are x = 2 and x = 3.'
      },
      {
        id: 'q1_3',
        questionText: 'What is the discriminant of the equation 2x² - 4x + 3 = 0?',
        options: [
          '-8',
          '16',
          '8',
          '0'
        ],
        correctOptionIndex: 0,
        explanation: 'Discriminant Δ = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since it is negative, the equation has no real roots.'
      }
    ]
  },
  {
    id: 'q2',
    title: 'English Tense, Grammar & Synonyms Quiz',
    subject: 'English Language',
    level: 'GCE',
    durationMinutes: 8,
    attemptsCount: 650,
    highScore: 92,
    questions: [
      {
        id: 'q2_1',
        questionText: 'Choose the sentence that is grammatically CORRECT.',
        options: [
          'Neither the student nor the teacher were present in school.',
          'Neither the student nor the teacher was present in school.',
          'Either the student nor the teacher were present in school.',
          'Neither the student or the teacher was present in school.'
        ],
        correctOptionIndex: 1,
        explanation: 'When subjects are joined by "neither... nor", the verb agrees with the closer subject ("the teacher" is singular, so we use singular "was").'
      },
      {
        id: 'q2_2',
        questionText: 'What is the closest synonym for the word “Ebullient” in exam context?',
        options: [
          'Depressed and gloomy',
          'Extremely joyful and enthusiastic',
          'Careless and irresponsible',
          'Intellectual and studious'
        ],
        correctOptionIndex: 1,
        explanation: '“Ebullient” means overflowing with enthusiasm, high spirits, or excitement; hence, extremely joyful.'
      }
    ]
  },
  {
    id: 'q3',
    title: 'Plant Cells & Organelles Structure Check',
    subject: 'Biology',
    level: 'Grade 10',
    durationMinutes: 12,
    attemptsCount: 420,
    highScore: 100,
    questions: [
      {
        id: 'q3_1',
        questionText: 'Which of the following organelle is present ONLY in plant cells but absent in human animal cells?',
        options: [
          'Mitochondria & Nucleus',
          'Cell Membrane & Cytoplasm',
          'Large Central Vacuole, Chloroplast & Cell Wall',
          'Ribosomes & Endoplasmic Reticulum'
        ],
        correctOptionIndex: 2,
        explanation: 'Plant cells are characterized by rigid outer cellulose cell walls, active chloroplasts for photosynthesis, and a large central vacuole.'
      },
      {
        id: 'q3_2',
        questionText: 'What is the main function of the Mitochondria?',
        options: [
          'Protein synthesis',
          'Aerobic cell respiration and ATP generation',
          'Storage of waste materials',
          'Facilitating cell division only'
        ],
        correctOptionIndex: 1,
        explanation: 'Mitochondria are the “powerhouses of the cell,” responsible for extracting energy from sugars via aerobic respiration.'
      }
    ]
  },
  {
    id: 'q4',
    title: 'Balancing Chemical Equations Challenge',
    subject: 'Chemistry',
    level: 'Grade 12',
    durationMinutes: 15,
    attemptsCount: 510,
    highScore: 100,
    questions: [
      {
        id: 'q4_1',
        questionText: 'In the balanced equation xH₂ + yO₂ → zH₂O, what are the coefficients x, y, z respectively?',
        options: [
          '1, 1, 2',
          '2, 1, 2',
          '2, 2, 2',
          '1, 2, 1'
        ],
        correctOptionIndex: 1,
        explanation: 'Balancing gives: 2H₂ + O₂ → 2H₂O. There are 4 Hydrogens and 2 Oxygens on both sides. Thus x=2, y=1, z=2.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: '🎉 Welcome to Sensor Academy!',
    message: 'Explore our rich collection of syllabus notes, exam solutions, video tutorials, and interactive timed revision tests.',
    type: 'announcement',
    timestamp: '2026-05-23T11:00:00Z',
    read: false
  },
  {
    id: 'n2',
    title: '📚 New Past Paper Uploaded',
    message: 'Mathematics Paper 1 GCE June 2024 is now available in the Library. Clear questions with comprehensive study guidelines included!',
    type: 'upload',
    timestamp: '2026-05-22T15:30:00Z',
    read: false
  },
  {
    id: 'n3',
    title: '🧪 Chemistry Quiz Unlocked',
    message: 'Challenge yourself with our newly released "Chemical Equations & Reactions" interactive test to gain quick feedback.',
    type: 'quiz',
    timestamp: '2026-05-21T09:00:00Z',
    read: true
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Grade 12 & GCE Syllabus Update 2026',
    content: 'Please look closely at the renewed Physics and Mechanics curricula updates in Section 3. Some optional sections concerning electronics are now part of direct assessments. We will post relevant quick study booklets next week.',
    sender: 'Principal Mr. Sensor Joshua',
    timestamp: '2026-05-23T10:00:00Z',
    category: 'exam'
  },
  {
    id: 'a2',
    title: 'WhatsApp Student Interaction Channels',
    content: 'We are organizing study peer groups on WhatsApp classified by subjects. This will help you resolve standard questions with online mentors instantly. Click the WhatsApp button in the settings hub to request matching links!',
    sender: 'Academic Advisor Aunt Evelyn',
    timestamp: '2026-05-22T14:00:00Z',
    category: 'general'
  }
];
