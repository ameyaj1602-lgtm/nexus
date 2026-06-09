export interface SimulationStep {
  time: string;
  title: string;
  description: string;
  choice?: {
    question: string;
    options: { label: string; outcome: string; skill: string }[];
  };
  skill_highlight: string;
}

export interface CareerSimulation {
  id: string;
  career: string;
  icon: string;
  duration: string;
  steps: SimulationStep[];
  summary: string;
}

export const simulations: CareerSimulation[] = [
  {
    id: 'ux-designer',
    career: 'UX Designer',
    icon: 'Palette',
    duration: '6 min',
    steps: [
      {
        time: '9:00 AM',
        title: 'Morning Standup',
        description: 'You join your design team\'s daily standup. The PM shares that user drop-off on the checkout page increased by 18% last week. Your team is counting on you to figure out why.',
        skill_highlight: 'Communication',
      },
      {
        time: '10:00 AM',
        title: 'User Research Review',
        description: 'You review session recordings of 5 users struggling on the checkout page. You notice they hesitate at the address form — it has 12 fields and no autofill.',
        choice: {
          question: 'How do you approach fixing this?',
          options: [
            { label: 'Reduce form to 5 essential fields', outcome: 'Fewer fields mean less friction. You sketch a simplified form with smart defaults.', skill: 'User Empathy' },
            { label: 'Add a progress bar to the existing form', outcome: 'The progress bar helps, but users still find 12 fields exhausting. Partial improvement.', skill: 'Visual Design' },
            { label: 'Add address autofill via Google Maps API', outcome: 'Autofill eliminates manual typing. Users love it in testing.', skill: 'Problem Solving' },
          ],
        },
        skill_highlight: 'User Research',
      },
      {
        time: '11:30 AM',
        title: 'Wireframing in Figma',
        description: 'You open Figma and start designing the new checkout flow. You create 3 different variations to test with users.',
        skill_highlight: 'Prototyping',
      },
      {
        time: '2:00 PM',
        title: 'Design Review',
        description: 'You present your 3 wireframe options to the team. The engineering lead raises concerns about implementation time for Option C.',
        choice: {
          question: 'The team is split. How do you decide?',
          options: [
            { label: 'Push for the best design regardless of dev time', outcome: 'Engineering pushes back. The feature gets delayed by 2 sprints. Lesson in tradeoffs.', skill: 'Conviction' },
            { label: 'Propose a phased approach — ship simple now, iterate later', outcome: 'Everyone agrees. You ship a quick win this sprint and plan the full solution for next.', skill: 'Strategic Thinking' },
            { label: 'Let the PM decide', outcome: 'The PM picks the safest option. It works, but you wonder if you could have pushed for better.', skill: 'Collaboration' },
          ],
        },
        skill_highlight: 'Presentation',
      },
      {
        time: '4:00 PM',
        title: 'Usability Testing',
        description: 'You run a quick usability test with 3 internal colleagues. Two of them complete checkout 40% faster with your new design. One finds a confusing label you missed.',
        skill_highlight: 'Testing & Iteration',
      },
      {
        time: '5:30 PM',
        title: 'End of Day Reflection',
        description: 'You update the design based on feedback, write notes in Notion, and share the updated Figma link with the team for async review. Tomorrow: A/B test planning.',
        skill_highlight: 'Documentation',
      },
    ],
    summary: 'UX Designers blend empathy, creativity, and analytical thinking. You\'ll spend your days talking to users, sketching solutions, and collaborating with engineers. It\'s a career where psychology meets technology.',
  },
  {
    id: 'data-scientist',
    career: 'Data Scientist',
    icon: 'BarChart3',
    duration: '6 min',
    steps: [
      {
        time: '9:00 AM',
        title: 'Check Model Performance',
        description: 'You start by reviewing overnight model training results. Your churn prediction model achieved 87% accuracy — up from 82% after your feature engineering changes yesterday.',
        skill_highlight: 'Machine Learning',
      },
      {
        time: '10:00 AM',
        title: 'Data Cleaning Challenge',
        description: 'A new dataset arrives from the marketing team. 30% of the records have missing values, duplicate entries, and inconsistent date formats.',
        choice: {
          question: 'How do you handle the messy data?',
          options: [
            { label: 'Write a Python script to automate cleaning', outcome: 'Your script handles 95% of issues. You save it as a reusable pipeline for future datasets.', skill: 'Python Programming' },
            { label: 'Send it back to marketing for correction', outcome: 'Marketing takes a week to respond. Your project gets delayed. Sometimes you have to self-serve.', skill: 'Communication' },
            { label: 'Use statistical imputation for missing values', outcome: 'Imputation works well for numeric fields. You document assumptions for transparency.', skill: 'Statistics' },
          ],
        },
        skill_highlight: 'Data Wrangling',
      },
      {
        time: '11:30 AM',
        title: 'Feature Engineering',
        description: 'You create new features from raw data: customer tenure, average order value trend, and days since last purchase. These features could improve your model significantly.',
        skill_highlight: 'Feature Engineering',
      },
      {
        time: '2:00 PM',
        title: 'Stakeholder Presentation',
        description: 'The VP of Sales wants to know which customers are most likely to churn next quarter. You need to translate complex model outputs into actionable business insights.',
        choice: {
          question: 'How do you present your findings?',
          options: [
            { label: 'Show the confusion matrix and ROC curves', outcome: 'The VP looks confused. Technical metrics don\'t resonate with business leaders.', skill: 'Technical Depth' },
            { label: 'Create a simple dashboard showing top 50 at-risk customers', outcome: 'The VP loves it. Sales team immediately starts reaching out to at-risk accounts.', skill: 'Data Storytelling' },
            { label: 'Write a detailed report with methodology and limitations', outcome: 'Thorough but nobody reads the 20-page report. Key insight: know your audience.', skill: 'Documentation' },
          ],
        },
        skill_highlight: 'Communication',
      },
      {
        time: '4:00 PM',
        title: 'Experiment Design',
        description: 'The product team wants to run an A/B test for a new pricing page. You design the experiment: sample size calculations, success metrics, and statistical significance thresholds.',
        skill_highlight: 'Experimentation',
      },
      {
        time: '5:30 PM',
        title: 'Learning Time',
        description: 'You spend 30 minutes reading a new research paper on transformer architectures for tabular data. Staying current is part of the job.',
        skill_highlight: 'Continuous Learning',
      },
    ],
    summary: 'Data Scientists combine programming, statistics, and business acumen. You\'ll spend time coding, analyzing patterns, and translating numbers into decisions. It\'s perfect if you love finding hidden stories in data.',
  },
  {
    id: 'doctor',
    career: 'Doctor (MBBS)',
    icon: 'Stethoscope',
    duration: '7 min',
    steps: [
      {
        time: '7:30 AM',
        title: 'Morning Ward Rounds',
        description: 'You begin your day visiting patients admitted in your ward. Mrs. Sharma, 55, was admitted last night with chest pain. You review her vitals, ECG, and blood reports.',
        skill_highlight: 'Clinical Assessment',
      },
      {
        time: '9:00 AM',
        title: 'OPD (Outpatient Department)',
        description: 'A 22-year-old student comes in with persistent headaches for 3 weeks. No fever, no vision problems. He mentions he\'s been sleeping only 4 hours a night due to exam stress.',
        choice: {
          question: 'What\'s your approach?',
          options: [
            { label: 'Order an MRI scan to rule out anything serious', outcome: 'MRI comes back normal. The patient feels reassured but the test was expensive and unnecessary.', skill: 'Thoroughness' },
            { label: 'Diagnose tension headache, advise sleep hygiene and stress management', outcome: 'You explain the stress-sleep-headache cycle. Patient returns in 2 weeks feeling much better.', skill: 'Clinical Judgment' },
            { label: 'Prescribe painkillers and ask to return if it doesn\'t improve', outcome: 'Painkillers mask the symptom. Patient returns in a month with the same problem.', skill: 'Quick Decision Making' },
          ],
        },
        skill_highlight: 'Diagnosis',
      },
      {
        time: '11:00 AM',
        title: 'Emergency Call',
        description: 'A 10-year-old is brought in with a high fever (104F) and rash. You suspect dengue. You need to act fast — platelet count is dropping.',
        skill_highlight: 'Emergency Medicine',
      },
      {
        time: '1:00 PM',
        title: 'Quick Lunch & Case Discussion',
        description: 'Over lunch, a senior doctor discusses a complex case. A patient has symptoms that could be either lupus or drug reaction. You learn about differential diagnosis.',
        choice: {
          question: 'A junior intern asks for your opinion. What do you suggest?',
          options: [
            { label: 'Order an ANA test and skin biopsy', outcome: 'Good call. The tests help narrow down the diagnosis. Your systematic approach impresses the senior.', skill: 'Systematic Thinking' },
            { label: 'Review the patient\'s medication history first', outcome: 'You find the patient started a new medication 2 weeks ago. It\'s likely a drug reaction. Simplest answer first.', skill: 'Attention to Detail' },
            { label: 'Suggest consulting a specialist', outcome: 'The specialist confirms drug reaction. Referral was appropriate but you could have caught it yourself.', skill: 'Team Collaboration' },
          ],
        },
        skill_highlight: 'Critical Thinking',
      },
      {
        time: '3:00 PM',
        title: 'Patient Counseling',
        description: 'A newly diagnosed diabetic patient is scared and confused. You spend 20 minutes explaining the condition, diet changes, and that diabetes is manageable with the right lifestyle.',
        skill_highlight: 'Empathy & Communication',
      },
      {
        time: '5:00 PM',
        title: 'Documentation & Handover',
        description: 'You update patient records, write discharge summaries, and hand over critical cases to the night duty doctor. Accurate documentation saves lives.',
        skill_highlight: 'Documentation',
      },
    ],
    summary: 'Being a doctor is demanding but deeply rewarding. You\'ll diagnose, treat, counsel, and sometimes save lives. It requires stamina, empathy, and years of continuous learning. Perfect for those who want direct human impact.',
  },
  {
    id: 'lawyer',
    career: 'Lawyer',
    icon: 'Scale',
    duration: '6 min',
    steps: [
      {
        time: '8:30 AM',
        title: 'Case File Review',
        description: 'You review today\'s court case: defending a small business owner accused of trademark infringement by a large corporation. You need to find precedents that support your client.',
        skill_highlight: 'Legal Research',
      },
      {
        time: '10:00 AM',
        title: 'Court Hearing',
        description: 'In court, the opposing counsel presents evidence that your client\'s logo is "confusingly similar" to their client\'s brand. The judge asks for your response.',
        choice: {
          question: 'How do you argue your case?',
          options: [
            { label: 'Present a consumer survey showing no confusion', outcome: 'The survey data is compelling. The judge notes that actual consumer perception matters more than visual similarity.', skill: 'Evidence-Based Argumentation' },
            { label: 'Argue that common elements can\'t be trademarked', outcome: 'Strong legal argument. You cite 3 precedents where generic design elements were not protectable.', skill: 'Legal Knowledge' },
            { label: 'Challenge the timeline — your client\'s logo predates theirs', outcome: 'Prior use is a powerful defense. You present registration dates that support your client.', skill: 'Strategic Thinking' },
          ],
        },
        skill_highlight: 'Argumentation',
      },
      {
        time: '12:00 PM',
        title: 'Client Meeting',
        description: 'A new client wants help drafting a partnership agreement. Two friends starting a business together want to make sure they\'re protected if things go wrong.',
        skill_highlight: 'Client Counseling',
      },
      {
        time: '2:00 PM',
        title: 'Contract Drafting',
        description: 'You draft the partnership agreement, carefully defining profit-sharing, decision-making authority, exit clauses, and dispute resolution mechanisms.',
        choice: {
          question: 'The partners disagree on the exit clause. One wants a 30-day notice, the other wants 6 months. How do you handle it?',
          options: [
            { label: 'Propose a 90-day notice as a compromise', outcome: 'Both parties accept the middle ground. You\'ve helped them avoid a future conflict.', skill: 'Negotiation' },
            { label: 'Explain the legal implications of each option', outcome: 'With full information, they agree on 90 days with a buyout formula. Informed decisions are best.', skill: 'Legal Counseling' },
            { label: 'Recommend they each get independent legal advice', outcome: 'Ethical but they came to you as a trusted advisor. Sometimes you need to guide, not deflect.', skill: 'Ethics' },
          ],
        },
        skill_highlight: 'Drafting & Negotiation',
      },
      {
        time: '4:30 PM',
        title: 'Legal Research',
        description: 'A colleague needs help with a new data privacy case under India\'s DPDP Act. You spend an hour reading the act, MEITY guidelines, and recent tribunal orders.',
        skill_highlight: 'Research & Analysis',
      },
    ],
    summary: 'Lawyers argue, negotiate, draft, and counsel. It\'s a career built on language, logic, and justice. You\'ll need sharp analytical skills and the ability to think on your feet. Perfect for those who love debate and protecting rights.',
  },
  {
    id: 'content-creator',
    career: 'Content Creator',
    icon: 'Clapperboard',
    duration: '6 min',
    steps: [
      {
        time: '8:00 AM',
        title: 'Analytics Review',
        description: 'You check yesterday\'s video performance. Your "Day in the Life of an IIT Student" video hit 2 lakh views — 3x your average. Comments are pouring in asking for more campus content.',
        skill_highlight: 'Data Analysis',
      },
      {
        time: '9:30 AM',
        title: 'Content Planning',
        description: 'Based on the analytics, you brainstorm your next 5 videos. You need to balance trending topics with your niche and your own creative interests.',
        choice: {
          question: 'Which content strategy do you follow?',
          options: [
            { label: 'Double down on campus content since it\'s trending', outcome: 'Smart move. You ride the wave and gain 50K subscribers in 2 weeks. But trend-chasing is exhausting.', skill: 'Trend Analysis' },
            { label: 'Mix trending topics with your original ideas', outcome: 'You maintain authenticity while growing. Sustainable strategy that builds loyal fans.', skill: 'Strategic Thinking' },
            { label: 'Ignore trends, make what you love', outcome: 'Your passion shows but growth slows. Audience finds you eventually but it takes longer.', skill: 'Authenticity' },
          ],
        },
        skill_highlight: 'Content Strategy',
      },
      {
        time: '11:00 AM',
        title: 'Shoot Day',
        description: 'You set up your camera, ring light, and mic. Today you\'re filming a "3 Side Hustles for College Students" video. You do 4 takes of the intro until the energy feels right.',
        skill_highlight: 'Video Production',
      },
      {
        time: '2:00 PM',
        title: 'Editing Session',
        description: 'You spend 3 hours editing in Premiere Pro. Adding jump cuts, B-roll, captions, and background music. A 12-minute video takes about 6-8 hours to edit well.',
        skill_highlight: 'Video Editing',
      },
      {
        time: '5:00 PM',
        title: 'Brand Deal Negotiation',
        description: 'A fintech startup wants you to promote their app. They offer 50K for one integrated video. You review their product to decide if it aligns with your audience.',
        choice: {
          question: 'The product is decent but not great. What do you do?',
          options: [
            { label: 'Accept and disclose it\'s sponsored', outcome: 'You make money but some followers question your credibility. Short-term gain, long-term risk.', skill: 'Business Pragmatism' },
            { label: 'Negotiate — ask for 80K and creative control', outcome: 'They agree to 65K with full creative control. Win-win. Your authentic integration performs better anyway.', skill: 'Negotiation' },
            { label: 'Decline — only promote products you genuinely use', outcome: 'Principled stance. Your audience trusts you more. Other brands take notice of your selectivity.', skill: 'Integrity' },
          ],
        },
        skill_highlight: 'Monetization',
      },
      {
        time: '7:00 PM',
        title: 'Community Engagement',
        description: 'You spend an hour replying to comments, posting Instagram Stories, and engaging with your community. Building a creator career means building relationships.',
        skill_highlight: 'Community Building',
      },
    ],
    summary: 'Content creation blends creativity, business, and technology. You\'re a one-person media company — writer, director, editor, and marketer. It offers freedom but requires discipline, consistency, and thick skin.',
  },
  {
    id: 'entrepreneur',
    career: 'Entrepreneur',
    icon: 'Lightbulb',
    duration: '7 min',
    steps: [
      {
        time: '7:00 AM',
        title: 'Morning Metrics',
        description: 'You check your startup\'s dashboard. Your ed-tech platform gained 200 new users yesterday, but only 15% completed onboarding. That\'s a problem.',
        skill_highlight: 'Data-Driven Thinking',
      },
      {
        time: '8:30 AM',
        title: 'Team Standup',
        description: 'Your 5-person team gathers. The developer reports a critical bug. The designer has 2 new mockups. The marketing intern needs guidance on the Instagram campaign.',
        choice: {
          question: 'Everything feels urgent. What do you prioritize?',
          options: [
            { label: 'Fix the bug first — broken product loses users', outcome: 'Right call. The bug was causing 30% of new users to crash during onboarding. Fixing it immediately improves retention.', skill: 'Prioritization' },
            { label: 'Review mockups — the redesign has been pending', outcome: 'The mockups look great but the bug keeps losing users. Sometimes urgent beats important.', skill: 'Design Thinking' },
            { label: 'Help the intern — quick win for marketing', outcome: 'Good mentorship but the leaky bucket (bug) means new users from marketing also churn.', skill: 'Team Development' },
          ],
        },
        skill_highlight: 'Leadership',
      },
      {
        time: '10:00 AM',
        title: 'Customer Calls',
        description: 'You call 3 early users to understand their experience. One school principal says your content is good but teachers find the admin panel confusing.',
        skill_highlight: 'Customer Discovery',
      },
      {
        time: '12:00 PM',
        title: 'Investor Pitch Prep',
        description: 'You\'re pitching to an angel investor tomorrow. You refine your 12-slide deck: problem, solution, market size, traction, team, and ask.',
        choice: {
          question: 'Your traction is modest (2000 users, no revenue yet). How do you position it?',
          options: [
            { label: 'Focus on engagement metrics — users love the product', outcome: 'Smart framing. You show that active users spend 25 min/day on the platform. Engagement signals product-market fit.', skill: 'Storytelling' },
            { label: 'Emphasize the massive market size (500M students in India)', outcome: 'Big TAM is impressive but investors want to know why YOU can capture it. Market size alone doesn\'t close deals.', skill: 'Market Analysis' },
            { label: 'Be honest about where you are and share your 12-month roadmap', outcome: 'Transparency builds trust. The investor appreciates your self-awareness and realistic milestones.', skill: 'Honesty & Vision' },
          ],
        },
        skill_highlight: 'Fundraising',
      },
      {
        time: '3:00 PM',
        title: 'Product Decision',
        description: 'Your developer can either build a parent dashboard (new feature) or optimize load time (technical improvement). You have bandwidth for only one this sprint.',
        skill_highlight: 'Product Strategy',
      },
      {
        time: '6:00 PM',
        title: 'Networking Event',
        description: 'You attend a startup meetup. You meet a potential co-founder with strong tech skills. You also connect with a school chain owner who could be your first enterprise client.',
        skill_highlight: 'Networking',
      },
    ],
    summary: 'Entrepreneurship is chaos, creativity, and conviction wrapped together. You wear every hat — CEO, salesperson, product manager, and therapist. It\'s not for everyone, but if you love building things from scratch, nothing compares.',
  },
  {
    id: 'architect',
    career: 'Architect',
    icon: 'Building2',
    duration: '6 min',
    steps: [
      {
        time: '9:00 AM',
        title: 'Client Brief',
        description: 'A young couple wants to build their dream home on a 2400 sq ft plot in Bangalore. Budget: 80 lakhs. They want 3 bedrooms, a home office, and lots of natural light.',
        skill_highlight: 'Client Communication',
      },
      {
        time: '10:30 AM',
        title: 'Site Analysis',
        description: 'You visit the plot with your junior architect. You study the sun path, wind direction, neighboring buildings, and tree positions. This data will inform your design.',
        choice: {
          question: 'The plot has a beautiful old neem tree right where the living room should go. What do you do?',
          options: [
            { label: 'Design around the tree — make it a courtyard feature', outcome: 'The tree becomes the heart of the home. Clients are thrilled. The courtyard brings natural cooling too.', skill: 'Creative Problem Solving' },
            { label: 'Recommend removing the tree for optimal floor plan', outcome: 'Practical but the plot loses character. The clients feel a pang of regret.', skill: 'Pragmatism' },
            { label: 'Propose two options — with and without the tree', outcome: 'Clients choose the courtyard option. Giving choices builds trust and shows design range.', skill: 'Design Flexibility' },
          ],
        },
        skill_highlight: 'Site Analysis',
      },
      {
        time: '12:00 PM',
        title: 'Concept Sketching',
        description: 'Back at the studio, you sketch initial concepts by hand. You explore 3 different layouts — L-shaped, courtyard, and split-level — each responding differently to the site.',
        skill_highlight: 'Design Thinking',
      },
      {
        time: '2:00 PM',
        title: 'CAD & 3D Modeling',
        description: 'You model your preferred concept in AutoCAD and create a 3D walkthrough in SketchUp. The clients will see their future home before a single brick is laid.',
        skill_highlight: 'Technical Skills',
      },
      {
        time: '4:00 PM',
        title: 'Material Selection',
        description: 'You research sustainable building materials: exposed brick for walls, Kota stone for flooring, and reclaimed wood for accents. Budget and beauty must balance.',
        choice: {
          question: 'The client wants Italian marble but it\'s 40% over budget. What do you suggest?',
          options: [
            { label: 'Suggest Indian marble alternatives that look similar', outcome: 'Rajnagar marble gives 80% of the look at 50% of the cost. Client is happy with the savings.', skill: 'Material Knowledge' },
            { label: 'Use Italian marble only in the foyer, local stone elsewhere', outcome: 'Strategic luxury placement. The foyer makes a statement, and the budget stays on track.', skill: 'Budget Management' },
            { label: 'Redesign the flooring plan to reduce marble area needed', outcome: 'Clever design reduces marble area by 40%. Italian marble stays within budget.', skill: 'Design Optimization' },
          ],
        },
        skill_highlight: 'Material & Budget Awareness',
      },
      {
        time: '5:30 PM',
        title: 'Team Review',
        description: 'You review structural drawings from the civil engineer and discuss MEP (mechanical, electrical, plumbing) routing with the consultant. Architecture is a team sport.',
        skill_highlight: 'Coordination',
      },
    ],
    summary: 'Architects shape the physical world — homes, offices, cities. It blends art, engineering, and psychology. Long education (5 years BArch) but deeply creative work. Perfect for those who want to leave a tangible mark.',
  },
  {
    id: 'ai-engineer',
    career: 'AI/ML Engineer',
    icon: 'BrainCircuit',
    duration: '6 min',
    steps: [
      {
        time: '9:00 AM',
        title: 'Model Training Review',
        description: 'Your image classification model finished training overnight. Accuracy: 94.2% on the test set. But you notice it performs poorly on images with dark backgrounds — a bias issue.',
        skill_highlight: 'Model Evaluation',
      },
      {
        time: '10:00 AM',
        title: 'Debugging Bias',
        description: 'You investigate the training data and find it\'s 70% light-background images. The model hasn\'t seen enough dark-background examples to generalize well.',
        choice: {
          question: 'How do you fix the bias?',
          options: [
            { label: 'Augment data with dark-background variations', outcome: 'Data augmentation (random backgrounds, brightness changes) improves dark-image accuracy from 72% to 91%.', skill: 'Data Engineering' },
            { label: 'Collect more diverse training data', outcome: 'You source 5000 new images. Model becomes robust but data collection takes 2 weeks.', skill: 'Data Collection' },
            { label: 'Add background normalization as a preprocessing step', outcome: 'Preprocessing equalizes backgrounds. Quick fix that works but might lose some useful context.', skill: 'Feature Engineering' },
          ],
        },
        skill_highlight: 'Bias Detection',
      },
      {
        time: '11:30 AM',
        title: 'Paper Reading',
        description: 'You read a new paper on vision transformers that claims 3% better accuracy than CNNs on similar tasks. You take notes and discuss with your team.',
        skill_highlight: 'Research',
      },
      {
        time: '2:00 PM',
        title: 'API Development',
        description: 'Your model needs to be served as an API for the mobile app team. You wrap it in a FastAPI endpoint, add input validation, and set up model versioning.',
        choice: {
          question: 'The model is 2GB and inference takes 3 seconds. The mobile team needs <500ms response time. What do you do?',
          options: [
            { label: 'Quantize the model to INT8 for faster inference', outcome: 'Quantization reduces model to 500MB and inference to 800ms. Small accuracy drop (0.3%) is acceptable.', skill: 'Model Optimization' },
            { label: 'Use knowledge distillation to train a smaller student model', outcome: 'Student model is 200MB with 400ms inference. Takes a week to train but the result is production-grade.', skill: 'Advanced ML' },
            { label: 'Deploy on GPU servers and cache frequent predictions', outcome: 'GPU brings it to 200ms. Caching handles 60% of requests instantly. Cost goes up but performance is excellent.', skill: 'Infrastructure' },
          ],
        },
        skill_highlight: 'MLOps',
      },
      {
        time: '4:00 PM',
        title: 'Ethics Discussion',
        description: 'Your team discusses a request to build a facial recognition feature. You raise concerns about privacy, consent, and potential misuse.',
        skill_highlight: 'AI Ethics',
      },
      {
        time: '5:30 PM',
        title: 'Experimentation',
        description: 'You experiment with a new architecture idea — combining CNN features with transformer attention. It might not work, but the best breakthroughs come from exploration.',
        skill_highlight: 'Innovation',
      },
    ],
    summary: 'AI/ML Engineers build the intelligence behind smart products. You\'ll code, research, and solve puzzles daily. It requires strong math, programming, and curiosity. One of the highest-growth and highest-paying tech careers.',
  },
  {
    id: 'psychologist',
    career: 'Clinical Psychologist',
    icon: 'Brain',
    duration: '6 min',
    steps: [
      {
        time: '9:00 AM',
        title: 'Session Preparation',
        description: 'You review case notes for your first client — a 17-year-old dealing with exam anxiety and sleep issues. This is your 4th session together. Last week you introduced CBT techniques.',
        skill_highlight: 'Preparation',
      },
      {
        time: '10:00 AM',
        title: 'Therapy Session',
        description: 'During the session, the client reveals they\'ve been having panic attacks at school. They describe tightness in chest, racing heart, and fear of "going crazy."',
        choice: {
          question: 'How do you respond?',
          options: [
            { label: 'Normalize the experience and teach grounding techniques', outcome: 'You teach 5-4-3-2-1 sensory grounding. The client feels understood and leaves with a practical tool.', skill: 'Empathy & Intervention' },
            { label: 'Explore the root cause — what triggers the panic?', outcome: 'You discover the attacks started when parents threatened to send them to a stricter school. Core issue revealed.', skill: 'Deep Exploration' },
            { label: 'Refer to a psychiatrist for medication evaluation', outcome: 'Appropriate if severe, but therapy should be tried first for exam anxiety. Premature referral can feel dismissive.', skill: 'Clinical Judgment' },
          ],
        },
        skill_highlight: 'Therapeutic Skills',
      },
      {
        time: '11:30 AM',
        title: 'Psychological Assessment',
        description: 'A school has referred a 9-year-old for learning difficulties. You administer a cognitive assessment (WISC) and observe the child\'s behavior during testing.',
        skill_highlight: 'Assessment',
      },
      {
        time: '1:30 PM',
        title: 'Parent Counseling',
        description: 'You meet with the 17-year-old\'s parents. They\'re pushing for IIT coaching. You need to help them understand how their pressure affects their child.',
        choice: {
          question: 'The parents say "We just want what\'s best." How do you navigate this?',
          options: [
            { label: 'Share research on how academic pressure affects adolescent mental health', outcome: 'Data-driven approach helps parents see the bigger picture without feeling blamed.', skill: 'Psychoeducation' },
            { label: 'Facilitate a family session so the child can express feelings directly', outcome: 'Emotional but powerful. Parents hear their child\'s experience for the first time.', skill: 'Family Therapy' },
            { label: 'Validate parents\' intentions while reframing "best" to include mental health', outcome: 'You\'re building an alliance with parents, not against them. They start seeing mental health as part of success.', skill: 'Reframing' },
          ],
        },
        skill_highlight: 'Family Work',
      },
      {
        time: '3:30 PM',
        title: 'Case Notes & Report Writing',
        description: 'You write detailed session notes, update treatment plans, and draft the psychometric report for the 9-year-old. Documentation is crucial for ethical practice.',
        skill_highlight: 'Documentation',
      },
      {
        time: '5:00 PM',
        title: 'Supervision & Self-Care',
        description: 'You attend a peer supervision group where psychologists discuss challenging cases. After that, you practice your own mindfulness routine — therapists need self-care too.',
        skill_highlight: 'Professional Growth',
      },
    ],
    summary: 'Clinical psychologists help people navigate their inner world. You\'ll listen deeply, assess carefully, and guide healing. It requires years of training (MPhil RCI) and emotional resilience. Deeply fulfilling for those who care about human well-being.',
  },
  {
    id: 'product-manager',
    career: 'Product Manager',
    icon: 'Rocket',
    duration: '6 min',
    steps: [
      {
        time: '9:00 AM',
        title: 'Metrics Review',
        description: 'You open your product dashboard. Daily active users are up 12% but the new feature\'s adoption rate is only 8%. You need to figure out why users aren\'t discovering it.',
        skill_highlight: 'Data Analysis',
      },
      {
        time: '10:00 AM',
        title: 'User Interview',
        description: 'You hop on a call with a power user. She loves the product but says the new feature is "hidden" — she only found it because a friend told her.',
        choice: {
          question: 'How do you improve feature discovery?',
          options: [
            { label: 'Add an onboarding tooltip that highlights the feature', outcome: 'Tooltips increase feature discovery by 35%. Non-intrusive and effective.', skill: 'UX Thinking' },
            { label: 'Redesign the navigation to make the feature more prominent', outcome: 'Navigation change is risky — it affects all users. A/B test shows mixed results. Big changes need big evidence.', skill: 'Product Design' },
            { label: 'Send a targeted email/push notification to relevant users', outcome: 'Targeted nudge works well. Feature adoption jumps to 22% among notified users.', skill: 'Growth Strategy' },
          ],
        },
        skill_highlight: 'User Research',
      },
      {
        time: '11:30 AM',
        title: 'Sprint Planning',
        description: 'You meet with engineering and design to plan the next 2-week sprint. There are 15 items in the backlog but capacity for only 5. Hard choices ahead.',
        skill_highlight: 'Prioritization',
      },
      {
        time: '1:00 PM',
        title: 'PRD Writing',
        description: 'You write a Product Requirements Document for a new gamification feature. You define user stories, acceptance criteria, edge cases, and success metrics.',
        choice: {
          question: 'Engineering pushes back — they say gamification will take 6 weeks, not the 3 you estimated. What do you do?',
          options: [
            { label: 'Scope down — launch with basic XP and badges, add leaderboard later', outcome: 'MVP approach. You ship something in 3 weeks and iterate based on user response. Lean and smart.', skill: 'Scoping' },
            { label: 'Accept the 6-week timeline and plan other work around it', outcome: 'Realistic planning. Engineering trusts you more because you respect their estimates.', skill: 'Stakeholder Management' },
            { label: 'Propose a design sprint to find a simpler implementation', outcome: 'A 2-day design sprint reveals a simpler architecture. Feature ships in 4 weeks. Collaboration wins.', skill: 'Creative Problem Solving' },
          ],
        },
        skill_highlight: 'Product Specification',
      },
      {
        time: '3:30 PM',
        title: 'Competitive Analysis',
        description: 'A competitor just launched a similar feature. You do a quick SWOT analysis and identify 3 things they do better and 2 things you do better.',
        skill_highlight: 'Strategic Thinking',
      },
      {
        time: '5:00 PM',
        title: 'Stakeholder Update',
        description: 'You send a weekly update to the CEO and board: key metrics, wins, risks, and next week\'s priorities. Communication is the PM\'s superpower.',
        skill_highlight: 'Communication',
      },
    ],
    summary: 'Product Managers are the CEO of the product — you decide what gets built and why. You\'ll talk to users, crunch numbers, write specs, and coordinate teams. It requires a rare blend of technical understanding, business sense, and empathy.',
  },
];
