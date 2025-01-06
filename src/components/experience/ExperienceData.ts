export type ExperienceType = 'industry' | 'research' | 'internship' | 'responsibility';
export type CompanyType = 'corporate' | 'university' | 'research-lab';

export interface Experience {
  id: string;
  title: string;
  company: string;
  companyType: CompanyType;
  type: ExperienceType;
  period: {
    start: string;
    end: string | 'Present';
  };
  location: string;
  photo: {
    src: string;
    alt: string;
  };
  highlights: string[];
  skills: string[];
  documents?: {
    certificate?: string;
    report?: string;
    paper?: string;
  };
  links?: {
    github?: string;
    project?: string;
    publication?: string;
  };
}

export interface ExperienceGroup {
  type: ExperienceType;
  title: string;
  description: string;
  experiences: Experience[];
}

export const experienceGroups: ExperienceGroup[] = [
  {
    type: 'industry',
    title: 'Industry Experience',
    description: 'Professional experience in AI and software development',
    experiences: [
      {
        id: 'zoho-ds',
        title: 'Data Scientist',
        company: 'ZOHO',
        companyType: 'corporate',
        type: 'industry',
        period: {
          start: 'May 2022',
          end: 'July 2024'
        },
        location: 'Chennai, India',
        photo: {
          src: '/assets/imgs/zoho_ds.jpg',
          alt: 'ZOHO Data Science'
        },
        highlights: [
          'Advanced RAG Architecture: Developed and scaled an advanced Retrieval-Augmented Generation (RAG) system using VLLM, supporting millions of users with multi-modal input processing and reduced hallucinations',
          'Implemented diverse AI solutions, including customer assistance prediction, phishing detection with 90% accuracy, Resume Parser and Date Extraction, generative AI tasks like FAQ Generation, reply mail generation, and summary generation',
          'Multimodality Research: Engaged in foundational work on multimodal AI systems',
          'Mentorship: Guided, and mentored interns to full-time employees'
        ],
        skills: ['RAG', 'VLLM', 'NLP', 'Machine Learning', 'Deep Learning', 'Python'],
        documents: {
          certificate: '/certificates/Experience.pdf'
        }
      },
      {
        id: 'zoho-trainee',
        title: 'Trainee',
        company: 'ZOHO',
        companyType: 'corporate',
        type: 'industry',
        period: {
          start: 'Sep 2021',
          end: 'Apr 2022'
        },
        location: 'Chennai, India',
        photo: {
          src: '/assets/imgs/zoho.png',
          alt: 'ZOHO Training Period'
        },
        highlights: [
          'Learning phase - Foundational NLP research ranging from rule-based methodologies to implementation of seq-to-seq architectures',
          'Developed a Java-based e-commerce web application with RESTful APIs using JAX-RS, Spring Boot, and MySQL',
        ],
        skills: ['NLP', 'Java', 'REST APIs', 'JAX-RS'],
        documents: {
          certificate: ''
        }
      }
    ]
  },
  {
    type: 'research',
    title: 'Research Experience',
    description: 'Academic research in aerial depth mapping and computer vision',
    experiences: [
      {
        id: 'cu-aerial',
        title: 'Research Assistant',
        company: 'University of Colorado Boulder',
        companyType: 'university',
        type: 'research',
        period: {
          start: 'Sep 2024',
          end: 'Oct 2024'
        },
        location: 'Boulder, Colorado',
        photo: {
          src: '/assets/imgs/praise.png',
          alt: 'Aerial Depth Mapping Research'
        },
        highlights: [
          'Research on Deep learning models architecturally optimized for edge devices',
          'Studied depth mapping techniques for aerial imagery',
        ],
        skills: ['Deep Learning', 'Computer Vision', 'Edge Computing', 'Python', 'PyTorch', 'Google coral'],
        links: {
          project: 'https://praisecu.github.io/research-areas',
          github: ''
        }
      },
      {
        id: 'sairam-agv',
        title: 'Research Student Lead - Team LMES',
        company: 'Sri Sai Ram Engineering College',
        companyType: 'university',
        type: 'research',
        period: {
          start: 'Nov 2019',
          end: 'Feb 2022'
        },
        location: 'Chennai, India',
        photo: {
          src: '/assets/imgs/agv.png',
          alt: 'AGV Project'
        },
        highlights: [
          'Developed AGV bot with lane & object detection',
          'Implemented navigation using Raspberry Pi, Jetson Nano, and YOLOv4'
        ],
        skills: ['Computer Vision', 'Robotics', 'YOLO', 'Python', 'Raspberry Pi', 'Jetson Nano'],
        documents: {
          report: '/certificates/Final_year_project.pdf'
        },
        links: {
          github: 'https://github.com/Balaji-th/Autonomous_Vehicle',
          project: 'https://youtu.be/48irckF3vA0?feature=shared'
        }
      },
    ]
  },
  {
    type: 'internship',
    title: 'Internships',
    description: 'Professional internships and hands-on training experiences',
    experiences: [
      {
        id: 'zoho-intern',
        title: 'Student Intern',
        company: 'ZOHO',
        companyType: 'corporate',
        type: 'internship',
        period: {
          start: 'May 2021',
          end: 'June 2021'
        },
        location: 'Chennai, India',
        photo: {
          src: '/assets/imgs/zoho.png',
          alt: 'Student Internship at ZOHO'
        },
        highlights: [
          'Low level design and implementation of Parking Management System, Cricket Score Management System, and a Library Management System',
        ],
        skills: ['Java', 'MySQL', 'Spring Boot', 'REST APIs'],
        documents: {
          certificate: '/certificates/Zoho_Internship.pdf'
        }
      },
      {
        id: 'siemens-intern',
        title: 'Intern',
        company: 'SIEMENS',
        companyType: 'corporate',
        type: 'internship',
        period: {
          start: 'Apr 2021',
          end: 'Apr 2021'
        },
        location: 'Chennai, India',
        photo: {
          src: '/assets/imgs/Siemens_Healthineers_logo.png',
          alt: 'Siemens Internship'
        },
        highlights: [
          'Gained hands-on experience with advanced medical imaging systems, principal components of PET-CT, MRI, and CT'
        ],
        skills: ['Medical Imaging', 'PET-CT', 'MRI', 'CT'],
        documents: {
          certificate: '/certificates/Siemens_cert.pdf',
          report: '/certificates/SIEMENS_INTERNSHIP_REPORT.pdf'
        }
      },
      {
        id: 'bsnl-inplant',
        title: 'In-plant Trainee',
        company: 'BSNL',
        companyType: 'corporate',
        type: 'internship',
        period: {
          start: 'Dec 2019',
          end: 'Dec 2019'
        },
        location: 'Chennai, India',
        photo: {
          src: '/assets/imgs/bsnl.png',
          alt: 'BSNL In plant training'
        },
        highlights: [
          'Hands-on experience with telecom equipment and networking devices',
          'Learned about the functioning of the telecom industry',
          'Learned about the seven layers of the OSI model and the TCP/IP model'
        ],
        skills: ['Networking', 'Telecom', 'OSI Model', 'TCP/IP Model'],
        documents: {
          certificate: '/certificates/bsnl_cert.pdf'
        }
      },
    ]
  },
  {
    type: 'responsibility',
    title: 'Responsibilities',
    description: 'Leadership roles and responsibilities in academic and professional settings',
    experiences: [
      {
        id: 'icms',
        title: 'Indian Classical Music Society - President',
        company: 'University of Colorado Boulder',
        companyType: 'university',
        type: 'responsibility',
        period: {
          start: 'Dec 2024',
          end: 'Present'
        },
        location: 'Boulder, Colorado',
        photo: {
          src: '/assets/imgs/icms.png',
          alt: 'Indian Classical Music Society'
        },
        highlights: [
          'First Recognized Indian Classical Music Society at CU Boulder',
          'Started with 3 members and now has 20+ members'
        ],
        skills: ['Leadership', 'Team Management', 'Event Planning', 'Public Speaking'],
        documents: {
          certificate: '/certificates/icms_signup.pdf'
        }
      }
    ]
  }
];