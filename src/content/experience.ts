export type ExperienceType = 'industry' | 'research' | 'internship' | 'teaching' | 'responsibility'

export interface Experience {
  id: string
  title: string
  company: string
  type: ExperienceType
  period: { start: string; end: string }
  location: string
  logo?: string
  highlights: string[]
  skills: string[]
  documents?: { certificate?: string; report?: string }
  links?: { github?: string; project?: string }
}

// Ordered newest → oldest; this order drives the timeline and the Bloch-sphere states.
export const experiences: Experience[] = [
  {
    id: 'ricoh-senior',
    title: 'Senior Applied AI Engineer',
    company: 'Ricoh',
    type: 'industry',
    period: { start: 'Apr 2026', end: 'Present' },
    location: 'USA',
    logo: 'ricoh',
    highlights: [
      'Architected and shipped a Claude-powered multi-agent platform: an orchestrator routes each request to a Data Analyst agent or a Service agent that pulls maintenance documentation to help field technicians fix printers',
      'Added image support to the Service agent, so repair steps come with the matching procedural illustrations',
      'Built a document pipeline on Ray that processes thousands of documents in under an hour',
      'Automated localized UI screenshots with an agentic harness: 130 screens in each of 7 languages (900+ images), cutting 60 hours of manual work to 40 minutes',
    ],
    skills: ['Claude', 'Multi-agent', 'Tool calling', 'Ray', 'AWS', 'Python', 'SQL'],
  },
  {
    id: 'ricoh-ai-intern',
    title: 'Applied AI Engineer (Internship)',
    company: 'Ricoh',
    type: 'internship',
    period: { start: 'May 2025', end: 'Apr 2026' },
    location: 'USA',
    logo: 'ricoh',
    highlights: [
      'Led the first deployment of the Service agent, with human feedback loops for continuous improvement, conversational memory, and tool calls to JIRA and Redmine through AWS connectors',
      'Designed the shared AWS foundation (Lambda, DynamoDB, S3, Aurora SQL) that later agents are built on',
    ],
    skills: ['Agentic AI', 'AWS Lambda', 'DynamoDB', 'S3', 'Aurora', 'Python', 'SQL'],
  },
  {
    id: 'cu-course-assistant',
    title: 'Course Assistant, Statistical Methods',
    company: 'University of Colorado Boulder',
    type: 'teaching',
    period: { start: 'Aug 2025', end: 'Apr 2026' },
    location: 'Boulder, Colorado',
    highlights: [
      'Course assistant for Statistical Methods and Applications I (STAT 4000/5000) in the fall and II (STAT 4010/5010) in the spring',
      'Graded and wrote detailed feedback for undergraduate and graduate students',
    ],
    skills: ['Statistics', 'Probability', 'Regression', 'Teaching'],
  },
  {
    id: 'cu-quantum',
    title: 'Member, Quantum Computing Research Group',
    company: 'University of Colorado Boulder',
    type: 'research',
    period: { start: 'Feb 2025', end: 'Apr 2025' },
    location: 'Boulder, Colorado',
    highlights: ['Volunteer study group working through the fundamentals of quantum computing and quantum algorithms'],
    skills: ['Quantum Computing', 'Linear Algebra', 'Quantum Algorithms'],
  },
  {
    id: 'icms',
    title: 'President, Indian Classical Music Society',
    company: 'University of Colorado Boulder',
    type: 'responsibility',
    period: { start: 'Dec 2024', end: 'Present' },
    location: 'Boulder, Colorado',
    logo: 'icms',
    highlights: ['Founded the first recognised Indian Classical Music Society at CU Boulder', 'Grew it from 3 to 20+ members'],
    skills: ['Leadership', 'Event Planning', 'Public Speaking'],
  },
  {
    id: 'cu-aerial',
    title: 'Research Assistant',
    company: 'University of Colorado Boulder',
    type: 'research',
    period: { start: 'Sep 2024', end: 'Oct 2024' },
    location: 'Boulder, Colorado',
    logo: 'praise',
    highlights: ['Deep-learning architectures optimised for edge devices', 'Depth-mapping techniques for aerial imagery'],
    skills: ['Deep Learning', 'Computer Vision', 'Edge Computing', 'PyTorch', 'Google Coral'],
    links: { project: 'https://praisecu.github.io/research-areas' },
  },
  {
    id: 'zoho-ds',
    title: 'NLP Developer',
    company: 'ZOHO',
    type: 'industry',
    period: { start: 'May 2022', end: 'Jul 2024' },
    location: 'Chennai, India',
    logo: 'zoho_ds',
    highlights: [
      'Architected a RAG system serving millions of customers, cutting response latency by 20% and hallucinations by 35% with hybrid retriever and reranker fusion on vLLM',
      'Built customer-assistance AI with PyTorch and Transformers: phishing detection at 90% accuracy and a resume parser handling 2K+ resumes a month',
      'Generative features: FAQ generation, reply drafting and summarisation',
      'Foundational multimodal research; mentored interns into full-time hires',
    ],
    skills: ['RAG', 'vLLM', 'NLP', 'Machine Learning', 'Deep Learning', 'Python'],
    documents: { certificate: '/docs/Experience.pdf' },
  },
  {
    id: 'zoho-trainee',
    title: 'Trainee',
    company: 'ZOHO',
    type: 'industry',
    period: { start: 'Sep 2021', end: 'Apr 2022' },
    location: 'Chennai, India',
    logo: 'zoho',
    highlights: [
      'Worked through NLP from the ground up: sentiment analysis with SVM and Naive Bayes, then seq2seq models with RNN, LSTM and GRU, encoder-decoder machine translation, and finally Transformers',
      'Java e-commerce app with RESTful APIs (JAX-RS, Spring Boot, MySQL)',
    ],
    skills: ['NLP', 'Seq2Seq', 'Transformers', 'Java', 'JAX-RS'],
  },
  {
    id: 'zoho-intern',
    title: 'Student Intern',
    company: 'ZOHO',
    type: 'internship',
    period: { start: 'May 2021', end: 'Jun 2021' },
    location: 'Chennai, India',
    logo: 'zoho',
    highlights: ['Low-level design of parking, cricket-score and library management systems'],
    skills: ['Java', 'MySQL', 'Spring Boot'],
    documents: { certificate: '/docs/Zoho_Internship.pdf' },
  },
  {
    id: 'siemens-intern',
    title: 'Intern',
    company: 'Siemens Healthineers',
    type: 'internship',
    period: { start: 'Apr 2021', end: 'Apr 2021' },
    location: 'Chennai, India',
    logo: 'Siemens_Healthineers_logo',
    highlights: ['Studied PET-CT and MRI imaging workflows', 'Prototyped a CNN classifier on public CT scans to explore how AI could flag abnormal scans for faster radiologist review'],
    skills: ['Medical Imaging', 'CNN', 'PET-CT', 'MRI'],
    documents: { report: '/docs/SIEMENS_INTERNSHIP_REPORT.pdf' },
  },
  {
    id: 'mit-square',
    title: 'Student Intern',
    company: 'MIT Square',
    type: 'internship',
    period: { start: 'May 2020', end: 'Jul 2020' },
    location: 'India',
    highlights: ['Worked on a smart water purifier and built a data-driven chatbot for it'],
    skills: ['IoT', 'Chatbots', 'Python'],
  },
  {
    id: 'sairam-agv',
    title: 'Student Research Lead, Team LMES',
    company: 'Sri Sai Ram Engineering College',
    type: 'research',
    period: { start: 'Nov 2019', end: 'Feb 2022' },
    location: 'Chennai, India',
    logo: 'agv',
    highlights: ['Autonomous ground vehicle with lane and object detection', 'Navigation on Raspberry Pi + Jetson Nano with YOLOv4'],
    skills: ['Computer Vision', 'Robotics', 'YOLO', 'Jetson Nano'],
    documents: { report: '/docs/Final_year_project.pdf' },
    links: { github: 'https://github.com/Balaji-th/Autonomous_Vehicle', project: 'https://youtu.be/48irckF3vA0' },
  },
  {
    id: 'bsnl-inplant',
    title: 'In-plant Trainee',
    company: 'BSNL',
    type: 'internship',
    period: { start: 'Dec 2019', end: 'Dec 2019' },
    location: 'Chennai, India',
    logo: 'bsnl',
    highlights: ['Telecom equipment, networking devices, OSI and TCP/IP models'],
    skills: ['Networking', 'Telecom'],
    documents: { certificate: '/docs/bsnl_cert.pdf' },
  },
]

export const education = [
  {
    degree: 'M.S. Data Science',
    institution: 'University of Colorado Boulder',
    period: 'Aug 2024 to May 2026',
    location: 'Boulder, Colorado',
    gpa: '4.00',
    courses: ['Applied Deep Learning', 'Computer Vision', 'Natural Language Processing', 'Machine Learning', 'Data Mining', 'Advanced Statistics & Probability', 'Cybersecurity in Data Science', 'Ethics in Data Science'],
  },
  {
    degree: 'B.E. Electronics & Communication',
    institution: 'Sri Sai Ram Engineering College',
    period: 'Aug 2018 to Jun 2022',
    location: 'Chennai, India',
    gpa: '3.65',
    courses: ['Digital Signal Processing', 'Linear Algebra, Calculus & Probability', 'Machine Learning Techniques', 'Control Systems', 'Embedded Systems', 'Robotics', 'Wireless Communication', 'Data Structures & Algorithms'],
  },
]
