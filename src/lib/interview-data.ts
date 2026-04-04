export interface InterviewQuestion {
  question: string;
  tip: string;
  category: 'technical' | 'behavioral' | 'situational' | 'general';
}

export interface CareerInterviewSet {
  career: string;
  icon: string;
  type: 'engineering' | 'design' | 'business' | 'science' | 'healthcare' | 'creative' | 'law' | 'general';
  questions: InterviewQuestion[];
}

export const interviewSets: CareerInterviewSet[] = [
  {
    career: 'UX Designer',
    icon: '🎨',
    type: 'design',
    questions: [
      {
        question: 'Walk me through your design process from research to final design.',
        tip: 'Structure your answer: Empathize (user research) > Define (problem statement) > Ideate (brainstorm) > Prototype > Test. Use a real project as an example. Interviewers want to see that you think systematically, not just make things pretty.',
        category: 'technical',
      },
      {
        question: 'How do you handle feedback or criticism on your designs?',
        tip: 'Show maturity. Good answer: "I separate my ego from the work. I ask clarifying questions to understand the feedback, evaluate it against user data, and iterate. Not all feedback is equal — user-backed feedback always wins." Avoid saying you just do whatever the client says.',
        category: 'behavioral',
      },
      {
        question: 'Tell me about a time a stakeholder wanted something you disagreed with.',
        tip: 'Use the STAR method (Situation, Task, Action, Result). Show that you pushed back with data, not just opinion. The best answer shows you found a compromise that served the user while respecting business needs.',
        category: 'situational',
      },
      {
        question: 'How do you measure the success of a design?',
        tip: 'Go beyond "it looks good." Mention specific metrics: task completion rate, time-on-task, error rate, NPS, conversion rate. Show you connect design decisions to measurable outcomes.',
        category: 'technical',
      },
      {
        question: 'Why UX Design? What excites you about this field?',
        tip: 'Be genuine. Connect it to your identity — maybe you love solving puzzles, or you are fascinated by human behavior, or you want technology to be more humane. Avoid generic answers like "I like making things look nice."',
        category: 'general',
      },
      {
        question: 'How would you redesign an app you use daily?',
        tip: 'Pick a real app. Identify ONE specific pain point (not a full redesign). Explain the user problem, your hypothesis, and how you would validate it. This shows you think like a designer even in everyday life.',
        category: 'situational',
      },
    ],
  },
  {
    career: 'Data Scientist',
    icon: '📊',
    type: 'engineering',
    questions: [
      {
        question: 'Tell me about a technical project where you used data to solve a problem.',
        tip: 'Structure: Problem > Data > Method > Result > Impact. Be specific about the dataset size, techniques used (regression, classification, clustering), and the business impact. Numbers make your story credible.',
        category: 'technical',
      },
      {
        question: 'How do you handle missing data in a dataset?',
        tip: 'Show you know multiple approaches: deletion (listwise/pairwise), imputation (mean/median/mode, KNN, MICE), or using algorithms that handle missing values natively (XGBoost). The right approach depends on the data and the problem.',
        category: 'technical',
      },
      {
        question: 'Explain a complex technical concept to me as if I am a 10-year-old.',
        tip: 'This tests communication. Pick something like "machine learning" and use an analogy: "Imagine teaching a dog new tricks. You show examples and reward correct behavior. ML is similar — we show a computer many examples until it learns the pattern."',
        category: 'behavioral',
      },
      {
        question: 'How do you debug a model that is performing poorly?',
        tip: 'Show a systematic approach: Check data quality first, then feature importance, then model complexity (overfitting/underfitting), then hyperparameter tuning. Mention tools: confusion matrix, learning curves, cross-validation.',
        category: 'technical',
      },
      {
        question: 'Why data science and not software engineering?',
        tip: 'Honest differentiation: "I love the detective aspect — finding patterns in chaos. Software engineering builds known solutions, data science discovers unknown insights." Connect it to your curiosity and analytical nature.',
        category: 'general',
      },
      {
        question: 'How would you approach a problem where you have very little data?',
        tip: 'Show creativity: data augmentation, transfer learning, few-shot learning, synthetic data generation, rule-based approaches as a baseline, or collecting more targeted data. The answer shows problem-solving beyond just running models.',
        category: 'situational',
      },
    ],
  },
  {
    career: 'Doctor (MBBS)',
    icon: '⚕️',
    type: 'healthcare',
    questions: [
      {
        question: 'Why do you want to become a doctor?',
        tip: 'Be personal and specific. Avoid cliches like "I want to help people" (everyone says that). Share a specific moment or experience that sparked your interest. Connect it to your values and strengths.',
        category: 'general',
      },
      {
        question: 'How would you handle a situation where a patient disagrees with your treatment plan?',
        tip: 'Show empathy and communication skills. Listen to their concerns, explain the reasoning behind your plan in simple language, discuss alternatives, and respect their autonomy while ensuring they understand the risks.',
        category: 'situational',
      },
      {
        question: 'Tell me about a time you worked under extreme pressure.',
        tip: 'Use STAR method. Medicine is high-pressure — they want to see you stay calm, prioritize, and still make good decisions. Even examples from school or sports work if you haven\'t had clinical experience yet.',
        category: 'behavioral',
      },
      {
        question: 'How do you stay updated with medical advancements?',
        tip: 'Mention specific sources: medical journals (Lancet, NEJM), conferences, online courses, peer discussions. Show you\'re a lifelong learner — medicine evolves constantly.',
        category: 'general',
      },
      {
        question: 'A patient\'s family is angry about a delayed diagnosis. How do you handle it?',
        tip: 'Show emotional intelligence: acknowledge their frustration, explain what happened transparently, avoid being defensive, and focus on the path forward. Never blame colleagues publicly.',
        category: 'situational',
      },
      {
        question: 'What branch of medicine interests you and why?',
        tip: 'Show genuine interest and research. Mention specific aspects: "Cardiology fascinates me because heart disease is India\'s leading killer, and the field combines procedural skills with patient relationships." Connect to your identity.',
        category: 'general',
      },
    ],
  },
  {
    career: 'Product Manager',
    icon: '🚀',
    type: 'business',
    questions: [
      {
        question: 'How would you market a new product to college students?',
        tip: 'Show strategic thinking: Define the target audience precisely, identify their channels (Instagram, YouTube, campus events), create a value proposition, plan a launch strategy (beta users > word of mouth > paid ads), and define success metrics.',
        category: 'situational',
      },
      {
        question: 'Tell me about a time you led a team through a difficult project.',
        tip: 'STAR method. Focus on HOW you led: setting clear goals, managing conflicts, making tough decisions, keeping morale up. The result matters, but the process matters more in this question.',
        category: 'behavioral',
      },
      {
        question: 'How do you prioritize features when everything seems important?',
        tip: 'Mention frameworks: RICE (Reach, Impact, Confidence, Effort), MoSCoW, or impact/effort matrix. The key insight: prioritization is about saying NO to good ideas to focus on great ones.',
        category: 'technical',
      },
      {
        question: 'A key metric dropped 20% this week. What do you do?',
        tip: 'Show structured problem-solving: 1) Verify the data, 2) Check for external factors (seasonality, competitor launch), 3) Look at sub-segments, 4) Check recent changes (deployments, campaigns), 5) Form hypotheses and test.',
        category: 'situational',
      },
      {
        question: 'Why product management and not engineering or design?',
        tip: 'Show you understand the role: "I love the intersection of technology, business, and user needs. PMs don\'t build or design — they decide WHAT to build and WHY. I thrive in ambiguity and cross-functional collaboration."',
        category: 'general',
      },
      {
        question: 'Describe a product you love and one thing you would improve about it.',
        tip: 'Pick a product you genuinely use. Show product thinking: identify the core value, acknowledge what works well, then identify a specific user pain point and propose a solution. Avoid redesigning the entire product.',
        category: 'situational',
      },
    ],
  },
  {
    career: 'AI/ML Engineer',
    icon: '🤖',
    type: 'engineering',
    questions: [
      {
        question: 'Tell me about a technical project where you built or trained an ML model.',
        tip: 'Be specific: dataset size, preprocessing steps, model architecture, training approach, evaluation metrics, and results. Mention challenges you faced (overfitting, class imbalance, compute constraints) and how you solved them.',
        category: 'technical',
      },
      {
        question: 'What is the difference between overfitting and underfitting? How do you address each?',
        tip: 'Overfitting: model memorizes training data (high train accuracy, low test accuracy). Fix: more data, regularization, dropout, early stopping. Underfitting: model is too simple. Fix: more features, complex model, more training.',
        category: 'technical',
      },
      {
        question: 'How do you handle ethical concerns in AI, like bias in models?',
        tip: 'Show awareness: bias in training data leads to biased predictions. Mention fairness metrics, diverse training data, bias audits, and explainability tools (SHAP, LIME). Ethics is increasingly important in AI hiring.',
        category: 'behavioral',
      },
      {
        question: 'How do you debug a model that performs well in testing but poorly in production?',
        tip: 'Systematic approach: data drift (training vs production data distribution), feature engineering issues, latency constraints, preprocessing inconsistencies, or concept drift over time. Monitoring and logging are key.',
        category: 'technical',
      },
      {
        question: 'What excites you most about AI right now?',
        tip: 'Be current and specific. Mention a recent development (LLMs, multimodal models, AI agents) and connect it to your interests. Show you stay updated and think about implications, not just technology.',
        category: 'general',
      },
      {
        question: 'How would you explain what a neural network does to a non-technical person?',
        tip: 'Use an analogy: "A neural network is like a team of experts. Each layer of experts looks at different aspects of the input. The first layer might see edges, the next shapes, and the final layer recognizes objects. They learn by seeing millions of examples."',
        category: 'behavioral',
      },
    ],
  },
  {
    career: 'Lawyer',
    icon: '⚖️',
    type: 'law',
    questions: [
      {
        question: 'Why do you want to pursue law?',
        tip: 'Go beyond "I want justice." Share a specific incident, case, or legal issue that sparked your interest. Connect it to your personality — love for debate, analytical thinking, or desire to protect rights.',
        category: 'general',
      },
      {
        question: 'Tell me about a time you had to argue for something you didn\'t personally believe in.',
        tip: 'This tests your ability to separate personal views from professional duty. In law, you may defend clients you disagree with. Show intellectual honesty and professional ethics.',
        category: 'behavioral',
      },
      {
        question: 'How would you handle a case where your client is clearly in the wrong?',
        tip: 'Key insight: lawyers don\'t decide guilt — courts do. Your job is to ensure fair process and the best possible defense within ethical bounds. Mention the right to legal representation and procedural justice.',
        category: 'situational',
      },
      {
        question: 'What area of law interests you most and why?',
        tip: 'Show research and genuine interest. Connect it to current events or personal experiences. "Constitutional law interests me because it shapes how 1.4 billion Indians live. Recent privacy and free speech cases fascinate me."',
        category: 'general',
      },
      {
        question: 'How do you approach legal research for a new case?',
        tip: 'Show methodology: identify the legal issue, search relevant statutes and case law, analyze precedents, identify arguments for and against, and build a strategy. Mention digital tools like SCC Online, Manupatra.',
        category: 'technical',
      },
      {
        question: 'A client wants you to do something that\'s technically legal but ethically questionable. What do you do?',
        tip: 'Show ethical reasoning: "I would explain the ethical implications, advise against it, and if the client insists, consider whether I can represent them in good conscience. Legal and ethical aren\'t always the same."',
        category: 'situational',
      },
    ],
  },
  {
    career: 'Content Creator',
    icon: '🎬',
    type: 'creative',
    questions: [
      {
        question: 'Walk me through how you plan and create a piece of content from idea to publish.',
        tip: 'Show your process: Research/ideation > Scripting > Production > Editing > SEO/Thumbnails > Publishing > Promotion > Analytics review. Having a process shows professionalism, not just creativity.',
        category: 'technical',
      },
      {
        question: 'Your most popular content style isn\'t what you\'re passionate about. How do you balance?',
        tip: 'Show self-awareness: "I use the 70-20-10 rule. 70% proven content that works, 20% experiments adjacent to my niche, 10% passion projects. The audience-favorite content funds the creative exploration."',
        category: 'situational',
      },
      {
        question: 'How do you deal with negative comments and online hate?',
        tip: 'Show resilience: "I distinguish constructive criticism from hate. Criticism helps me improve; hate says more about the commenter. I don\'t engage with trolls. I focus on the community that values my work."',
        category: 'behavioral',
      },
      {
        question: 'How would you grow from 0 to 10,000 followers today?',
        tip: 'Show strategic thinking: Pick ONE platform, study what works, create consistently, engage with community, collaborate with similar-sized creators, optimize for the algorithm (hooks, retention, SEO), and be patient.',
        category: 'situational',
      },
      {
        question: 'What makes your content different from others in your niche?',
        tip: 'Your unique angle comes from your unique life experience, perspective, or presentation style. Don\'t say "I\'m better" — say "I bring X perspective that others don\'t because of Y experience."',
        category: 'general',
      },
      {
        question: 'How do you decide which brand deals to accept or reject?',
        tip: 'Show integrity: "I evaluate: Is the product something I would genuinely use? Does it serve my audience? Is the creative brief respectful of my style? I\'d rather earn less than lose my audience\'s trust."',
        category: 'behavioral',
      },
    ],
  },
  {
    career: 'Entrepreneur',
    icon: '💡',
    type: 'business',
    questions: [
      {
        question: 'Tell me about a problem you identified and how you would solve it.',
        tip: 'Show problem-finding skills: "I noticed X problem affecting Y people. I validated it by talking to Z potential users. My solution is [specific]. What makes it different is [unique insight]." Specificity wins.',
        category: 'situational',
      },
      {
        question: 'How would you validate a business idea before building anything?',
        tip: 'Show lean startup thinking: Talk to potential customers (not friends/family), build a landing page to test demand, create a minimal prototype, run a pre-sale experiment. "Don\'t build it, validate it."',
        category: 'technical',
      },
      {
        question: 'Tell me about a time you failed and what you learned.',
        tip: 'Investors and mentors love this question. Be honest about a real failure. The key is the lesson and how you applied it. "I failed at X because I assumed Y. I learned to always validate assumptions before investing time."',
        category: 'behavioral',
      },
      {
        question: 'How would you convince someone to join your startup for less money?',
        tip: 'Show leadership: "I sell the mission, the learning opportunity, and the equity upside. I look for people motivated by impact and growth, not just salary. I also lead by example — I take less than anyone."',
        category: 'situational',
      },
      {
        question: 'What would you do if your co-founder disagrees with your strategy?',
        tip: 'Show maturity: "I would listen to their perspective, back up my position with data, and if we still disagree, we would run a small experiment to let the market decide. Ego kills startups."',
        category: 'behavioral',
      },
      {
        question: 'Why do you want to be an entrepreneur instead of working at a company?',
        tip: 'Be authentic: "I want to build something from scratch, make decisions that matter, and learn across all functions. I understand the risk — lower salary, more stress, higher failure rate — but the learning velocity and impact potential are unmatched."',
        category: 'general',
      },
    ],
  },
  {
    career: 'Architect',
    icon: '🏗️',
    type: 'design',
    questions: [
      {
        question: 'Walk me through your design process for a residential project.',
        tip: 'Show methodology: Client brief > Site analysis (sun path, wind, context) > Concept development > Schematic design > Design development > Construction documents > Site supervision. Mention tools: AutoCAD, Revit, SketchUp.',
        category: 'technical',
      },
      {
        question: 'How do you balance aesthetics with functionality and budget?',
        tip: 'Show pragmatism: "Good architecture serves all three. I start with function (how people use the space), ensure it fits the budget (material alternatives, smart detailing), and find beauty within those constraints. Constraints fuel creativity."',
        category: 'situational',
      },
      {
        question: 'How do you handle a client who keeps changing their mind?',
        tip: 'Show patience and process: "I document all decisions in writing, set clear revision milestones, and help clients visualize early through 3D models. Most changes come from uncertainty — better visualization reduces changes."',
        category: 'behavioral',
      },
      {
        question: 'What building or structure inspires you and why?',
        tip: 'Be specific and analytical. Don\'t just say "Taj Mahal" — explain WHY architecturally: the symmetry, the play of light, the material choice, the spatial experience. Show you see buildings through a designer\'s eye.',
        category: 'general',
      },
      {
        question: 'How do you incorporate sustainability into your designs?',
        tip: 'Show knowledge: passive cooling, natural lighting, local materials, rainwater harvesting, green roofs, energy modeling. "Sustainability isn\'t an add-on — it\'s a design philosophy that saves money long-term."',
        category: 'technical',
      },
      {
        question: 'Tell me about a design challenge you faced on a project.',
        tip: 'Use STAR method. Mention specific constraints (odd-shaped plot, heritage regulations, tight budget) and how you turned them into design opportunities. The best architecture emerges from constraints.',
        category: 'situational',
      },
    ],
  },
  {
    career: 'Clinical Psychologist',
    icon: '🧠',
    type: 'healthcare',
    questions: [
      {
        question: 'Why clinical psychology and not counseling or psychiatry?',
        tip: 'Show understanding of distinctions: "Clinical psychology combines therapy with assessment and research. Unlike counseling (shorter-term, adjustment issues), I want to work with complex mental health conditions. Unlike psychiatry, I believe in talk therapy as the primary intervention."',
        category: 'general',
      },
      {
        question: 'How would you handle a client who is resistant to therapy?',
        tip: 'Show therapeutic skills: "Resistance is information, not an obstacle. I would explore what resistance means for this client — fear, mistrust, previous bad experiences. Building rapport and respecting their pace is more important than pushing techniques."',
        category: 'situational',
      },
      {
        question: 'Tell me about a situation where your personal values conflicted with a professional duty.',
        tip: 'Show ethical awareness: "In psychology, we serve the client\'s well-being, not our personal beliefs. If a conflict arises, I seek supervision, consult ethical guidelines (APA/RCI), and if necessary, refer the client to someone better suited."',
        category: 'behavioral',
      },
      {
        question: 'How do you ensure you don\'t burn out as a therapist?',
        tip: 'Show self-awareness: "I practice what I teach — mindfulness, boundaries, regular supervision, personal therapy, and hobbies outside work. Burnout prevention isn\'t optional in this field — it\'s a professional responsibility."',
        category: 'behavioral',
      },
      {
        question: 'What therapeutic approach resonates most with you and why?',
        tip: 'Show theoretical knowledge: name 2-3 approaches (CBT, psychodynamic, humanistic, ACT) and explain which resonates and why. "I lean toward integrative practice because different clients need different approaches."',
        category: 'technical',
      },
      {
        question: 'A 15-year-old client tells you they are being abused at home. What do you do?',
        tip: 'Show ethical and legal knowledge: "I follow mandatory reporting guidelines. I inform the client about confidentiality limits, report to child protective services, document everything, and ensure the client\'s safety while maintaining therapeutic trust."',
        category: 'situational',
      },
    ],
  },
];
