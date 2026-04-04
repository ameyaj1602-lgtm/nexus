export interface Skill21 {
  id: string;
  name: string;
  category: 'Thinking' | 'People' | 'Self' | 'Digital';
  description: string;
  whyItMatters: string;
  selfAssessLevel?: number; // 1-5
  activities: string[];
  careers: string[];
  aiResistance: 'High' | 'Medium' | 'Low';
}

export const skillCategories: Skill21['category'][] = ['Thinking', 'People', 'Self', 'Digital'];

export const categoryMeta: Record<
  Skill21['category'],
  { color: string; bg: string; border: string; icon: string }
> = {
  Thinking: {
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-500/20',
    icon: '🧩',
  },
  People: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-500/20',
    icon: '🤝',
  },
  Self: {
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-500/20',
    icon: '🌟',
  },
  Digital: {
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-500/20',
    icon: '💻',
  },
};

export const skills21: Skill21[] = [
  // --- THINKING ---
  {
    id: 'analytical-thinking',
    name: 'Analytical Thinking',
    category: 'Thinking',
    description:
      'Breaking down complex problems into smaller parts, finding patterns, and making decisions based on evidence rather than gut feeling.',
    whyItMatters:
      'The #1 skill demanded by employers globally according to WEF. In a world of information overload, the ability to separate signal from noise is invaluable. AI can crunch numbers, but humans who can frame the right questions and interpret results will lead.',
    activities: [
      'Solve puzzles and brain teasers daily (Sudoku, chess, logic games)',
      'Read a news article and list 3 assumptions the author is making',
      'Pick any product and write a SWOT analysis of it',
      'Take a dataset from data.gov.in and find 3 interesting insights',
      'Debate both sides of a controversial topic with yourself',
    ],
    careers: ['Data Scientist', 'Management Consultant', 'Product Manager', 'Research Scientist', 'Lawyer'],
    aiResistance: 'Medium',
  },
  {
    id: 'creative-thinking',
    name: 'Creative Thinking',
    category: 'Thinking',
    description:
      'Generating original ideas, making unexpected connections, and imagining possibilities that don\'t exist yet.',
    whyItMatters:
      'AI can remix existing ideas but struggles to create truly novel ones. Creative thinkers will be the ones who design new products, solve unprecedented problems, and build things nobody has imagined. This is the most AI-resistant skill there is.',
    activities: [
      'Write 10 wild ideas every morning (most will be bad — that\'s the point)',
      'Combine two unrelated things and design a product from it',
      'Take a walk without your phone and just observe and wonder',
      'Learn a creative skill outside your comfort zone (pottery, poetry, music)',
      'Ask "what if?" about something you take for granted',
    ],
    careers: ['Designer', 'Entrepreneur', 'Film Director', 'Architect', 'Marketing Strategist'],
    aiResistance: 'High',
  },
  {
    id: 'complex-problem-solving',
    name: 'Complex Problem Solving',
    category: 'Thinking',
    description:
      'Tackling problems that have no clear solution, multiple stakeholders, and changing conditions. Thinking in systems, not just symptoms.',
    whyItMatters:
      'Real-world problems — climate change, urban planning, public health — are messy and interconnected. People who can navigate ambiguity and find workable solutions (not perfect ones) will be the most valuable professionals in any field.',
    activities: [
      'Pick a local problem (traffic, waste) and design a multi-step solution',
      'Play strategy games like Civilization or SimCity',
      'Study a company failure (like Theranos) and identify where decisions went wrong',
      'Volunteer for a community project and navigate real constraints',
      'Read case studies from Harvard Business Review',
    ],
    careers: ['Engineer', 'Urban Planner', 'Policy Analyst', 'Doctor', 'Startup Founder'],
    aiResistance: 'High',
  },
  {
    id: 'critical-thinking',
    name: 'Critical Thinking',
    category: 'Thinking',
    description:
      'Evaluating information for accuracy, bias, and logic. Not accepting things at face value. Asking "says who?" and "based on what?"',
    whyItMatters:
      'In the era of deepfakes, misinformation, and AI-generated content, critical thinking is survival. People who can distinguish truth from noise will make better decisions in every area of life — career, health, relationships, and voting.',
    activities: [
      'Fact-check a viral WhatsApp forward using multiple sources',
      'Read an opinion piece you disagree with and steelman the argument',
      'Learn the 10 most common logical fallacies and spot them in debates',
      'Compare how 3 different news outlets cover the same story',
      'Question your own strongly-held beliefs — why do you believe what you believe?',
    ],
    careers: ['Journalist', 'Lawyer', 'Scientist', 'Auditor', 'Philosopher'],
    aiResistance: 'High',
  },

  // --- PEOPLE ---
  {
    id: 'leadership',
    name: 'Leadership',
    category: 'People',
    description:
      'Inspiring and guiding others toward a shared goal. Not about authority, but about influence, vision, and serving the team.',
    whyItMatters:
      'Every organization, project, and movement needs leaders. But the old "command and control" style is dead. Modern leaders listen, empower, and create environments where others can do their best work. This skill cannot be automated.',
    activities: [
      'Lead a school/college club or project — experience the messiness of real leadership',
      'Read biographies of diverse leaders (not just CEOs — activists, coaches, teachers)',
      'Practice giving constructive feedback to peers',
      'Organize a community event from scratch',
      'Mentor someone younger than you',
    ],
    careers: ['CEO', 'Project Manager', 'Military Officer', 'Politician', 'Sports Coach'],
    aiResistance: 'High',
  },
  {
    id: 'communication',
    name: 'Communication',
    category: 'People',
    description:
      'Expressing ideas clearly across different formats — writing, speaking, presenting, and listening. Adapting your message to your audience.',
    whyItMatters:
      'The best idea in the world is useless if you can\'t communicate it. In remote/hybrid work, written communication is even more critical. People who can write clearly, present confidently, and listen actively will outperform in every career.',
    activities: [
      'Write a 500-word blog post every week on any topic',
      'Record yourself giving a 3-minute talk and watch it back',
      'Practice active listening: summarize what someone said before responding',
      'Join a debate club or Toastmasters',
      'Learn to write professional emails (clear subject, one ask per email)',
    ],
    careers: ['Marketing Manager', 'Journalist', 'Teacher', 'Lawyer', 'Sales Leader'],
    aiResistance: 'Medium',
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    category: 'People',
    description:
      'Working effectively in teams, especially diverse ones. Managing conflict, sharing credit, dividing work fairly, and building trust.',
    whyItMatters:
      'Almost no meaningful work happens alone anymore. The biggest breakthroughs come from interdisciplinary teams. The ability to collaborate across cultures, time zones, and disciplines is essential — and AI cannot replace human teamwork.',
    activities: [
      'Work on a group project and actively take on the hardest coordination tasks',
      'Pair-program or co-write something with someone very different from you',
      'Learn to use collaboration tools (Notion, Figma, GitHub)',
      'Practice giving and receiving feedback without ego',
      'Volunteer in a cross-functional team at an NGO or event',
    ],
    careers: ['Product Manager', 'Consultant', 'Research Scientist', 'Film Producer', 'Architect'],
    aiResistance: 'High',
  },
  {
    id: 'empathy',
    name: 'Empathy',
    category: 'People',
    description:
      'Understanding and sharing the feelings of others. Seeing the world through different perspectives. The foundation of trust and connection.',
    whyItMatters:
      'Empathy is the ultimate human skill. It\'s what makes doctors healing, designers human-centered, leaders trustworthy, and relationships real. AI can simulate empathy but can never truly feel it. In a tech-heavy world, empathy becomes more valuable, not less.',
    activities: [
      'Have a conversation with someone from a completely different background',
      'Read fiction — novels literally build empathy by putting you in other minds',
      'Practice perspective-taking: before judging, ask "what might they be going through?"',
      'Volunteer at a shelter, hospital, or old age home',
      'Listen to podcasts or watch documentaries about lives unlike yours',
    ],
    careers: ['Doctor', 'Psychologist', 'Social Worker', 'UX Designer', 'Teacher'],
    aiResistance: 'High',
  },

  // --- SELF ---
  {
    id: 'resilience',
    name: 'Resilience',
    category: 'Self',
    description:
      'Bouncing back from failure, rejection, and adversity. Not avoiding pain, but developing the capacity to recover and grow from it.',
    whyItMatters:
      'Every successful person has a trail of failures behind them. The future of work will be volatile — careers will change, industries will die, AI will disrupt. Resilience isn\'t optional, it\'s the single most important predictor of long-term success.',
    activities: [
      'Start a 30-day challenge and commit to finishing it even when it gets hard',
      'Write about a past failure and what you learned from it',
      'Talk to a professional about their biggest setback and how they recovered',
      'Practice physical challenges (running, cold showers) to build mental toughness',
      'Develop a personal mantra or ritual for tough days',
    ],
    careers: ['Entrepreneur', 'Athlete', 'Doctor', 'Military Professional', 'Artist'],
    aiResistance: 'High',
  },
  {
    id: 'adaptability',
    name: 'Adaptability',
    category: 'Self',
    description:
      'Adjusting quickly to new situations, learning new skills on the fly, and being comfortable with change and uncertainty.',
    whyItMatters:
      'The half-life of skills is shrinking. What you learn in college may be obsolete by the time you graduate. The most successful people aren\'t the most knowledgeable — they\'re the fastest learners. Adaptability is the meta-skill that makes all other skills possible.',
    activities: [
      'Learn something completely new every month (a language, a tool, a sport)',
      'Intentionally put yourself in uncomfortable situations',
      'Travel to a new place (even a different neighborhood) and navigate without a plan',
      'Switch up your routine regularly — take different routes, try new foods',
      'Read about industries being disrupted and imagine how you\'d adapt',
    ],
    careers: ['Consultant', 'Startup Founder', 'Journalist', 'Emergency Responder', 'Freelancer'],
    aiResistance: 'High',
  },
  {
    id: 'curiosity',
    name: 'Curiosity',
    category: 'Self',
    description:
      'A deep, persistent desire to learn, explore, and understand. Asking questions not because you have to, but because you genuinely want to know.',
    whyItMatters:
      'Curiosity is the engine of all innovation and learning. Curious people learn faster, make better decisions, and are more creative. In a world where AI can answer questions, the humans who ask the best questions will lead.',
    activities: [
      'Read about a topic you know nothing about every week',
      'Ask "why?" five times in a row about something you take for granted',
      'Follow people on social media who think differently from you',
      'Visit a museum, lab, factory, or farm — anywhere you haven\'t been',
      'Keep a "questions journal" of things you wonder about',
    ],
    careers: ['Scientist', 'Journalist', 'Designer', 'Explorer', 'Researcher'],
    aiResistance: 'High',
  },
  {
    id: 'self-awareness',
    name: 'Self-Awareness',
    category: 'Self',
    description:
      'Understanding your own strengths, weaknesses, emotions, values, and biases. The foundation of emotional intelligence and good decision-making.',
    whyItMatters:
      'You can\'t grow what you can\'t see. Self-aware people make better career choices, build stronger relationships, and lead more effectively. In a world obsessed with external metrics, knowing yourself deeply is a rare and powerful advantage.',
    activities: [
      'Journal daily for 10 minutes — write what you felt, not just what you did',
      'Take personality assessments (MBTI, Big Five, VIA Strengths) and reflect',
      'Ask 5 trusted people for honest feedback about your strengths and blind spots',
      'Meditate for 10 minutes daily — just observe your thoughts without judging',
      'Use Nexus identity tools to track how your self-understanding evolves',
    ],
    careers: ['Psychologist', 'Coach', 'Leader (any field)', 'Writer', 'Entrepreneur'],
    aiResistance: 'High',
  },

  // --- DIGITAL ---
  {
    id: 'ai-literacy',
    name: 'AI Literacy',
    category: 'Digital',
    description:
      'Understanding how AI works, what it can and can\'t do, and how to use it as a tool — not being afraid of it or blindly trusting it.',
    whyItMatters:
      'AI will be in every job within 5 years. You don\'t need to build AI, but you need to understand it — how to prompt it, when to trust it, when to question it, and how it might bias your decisions. AI-literate professionals will earn 30-50% more.',
    activities: [
      'Use ChatGPT/Claude/Gemini daily and learn to write better prompts',
      'Build something with an AI tool (generate art, write code, analyze data)',
      'Read about AI failures and biases — understand its limitations',
      'Take a free course on AI fundamentals (Google, Coursera, Khan Academy)',
      'Discuss with friends: what should and shouldn\'t AI be used for?',
    ],
    careers: ['Every career', 'AI Engineer', 'Product Manager', 'Data Analyst', 'Digital Marketer'],
    aiResistance: 'Low',
  },
  {
    id: 'data-literacy',
    name: 'Data Literacy',
    category: 'Digital',
    description:
      'Reading, understanding, and communicating with data. Not just making charts, but knowing what data means, where it comes from, and when it lies.',
    whyItMatters:
      'Every company is now a data company. Even non-technical roles require reading dashboards, understanding metrics, and making data-informed decisions. Data-literate people don\'t get fooled by misleading statistics or cherry-picked numbers.',
    activities: [
      'Learn basic Excel/Google Sheets — pivot tables, charts, formulas',
      'Read data visualizations critically: what is this chart NOT showing?',
      'Explore public datasets (census data, COVID data) and find stories in them',
      'Take a free statistics course and learn about correlation vs causation',
      'Build a personal dashboard tracking something you care about (fitness, spending)',
    ],
    careers: ['Data Analyst', 'Product Manager', 'Journalist', 'Researcher', 'Business Analyst'],
    aiResistance: 'Medium',
  },
  {
    id: 'digital-communication',
    name: 'Digital Communication',
    category: 'Digital',
    description:
      'Communicating effectively through digital channels — email, Slack, video calls, social media, and async tools. Building presence and influence online.',
    whyItMatters:
      'Remote work is here to stay. Your digital communication skills determine how others perceive your competence, reliability, and professionalism. People who write clearly, present well on video, and manage their digital presence will have an unfair advantage.',
    activities: [
      'Write a LinkedIn post or tweet thread about something you learned',
      'Practice presenting on video — record yourself and improve',
      'Build a personal website or portfolio (even a simple one)',
      'Learn to write concise, actionable Slack messages and emails',
      'Create content that teaches others something you know',
    ],
    careers: ['Marketing Manager', 'Remote Worker (any field)', 'Content Creator', 'Community Manager', 'Freelancer'],
    aiResistance: 'Medium',
  },
];
