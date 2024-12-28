export type ExperienceType = 'industry' | 'research' | 'internship';
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
    type: 'research',
    title: 'Research Experience',
    description: 'Academic research and assistantships',
    experiences: [
      {
        id: 'cu-ra',
        title: 'Research Assistant',
        company: 'University of Colorado Boulder',
        companyType: 'university',
        type: 'research',
        period: {
          start: 'Dec 2024',
          end: 'Present'
        },
        location: 'Boulder, Colorado',
        photo: {
          src: '/assets/imgs/cu_boulder.png',
          alt: 'Quantum Computing research at CU Boulder'
        },
        highlights: [
          'Quantum Computing Research',
          'Quantum Machine Learning',
          'Quantum Algorithms',
          "Quantum Error Correction"
        ],
        skills: ['Quantum Computing', 'Python', 'Qiskit', 'Quantum Algorithms'],
        links: {
          publication: '',
          github: ''
        }
      }
    ]
  },
  {
    type: 'industry',
    title: 'Industry Experience',
    description: 'Professional experience in the tech industry',
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
          alt: 'ZOHO Data Science Work'
        },
        highlights: [
          'Advanced RAG Architecture Development',
          'AI Solutions Implementation',
          'Multimodal Research',
          'Team Leadership & Mentoring'
        ],
        skills: ['RAG', 'NLP', 'Machine Learning', 'Deep Learning', 'Python'],
        documents: {
          certificate: '/certificates/zoho_ds_certificate.pdf'
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
          src: '/assets/imgs/zoho_trainee.jpg',
          alt: 'ZOHO Training Period'
        },
        highlights: [
          'NLP Research and Implementation',
          'Web Application Development'
        ],
        skills: ['NLP', 'Java', 'REST APIs', 'Spring Boot'],
        documents: {
          certificate: '/certificates/zoho_trainee_certificate.pdf'
        }
      }
    ]
  },
  {
    type: 'internship',
    title: 'Internships',
    description: 'Professional internships and training experiences',
    experiences: [
      {
        id: 'siemens-intern',
        title: 'Technical Intern',
        company: 'SIEMENS',
        companyType: 'corporate',
        type: 'internship',
        period: {
          start: 'Apr 2021',
          end: 'May 2021'
        },
        location: 'Chennai, India',
        photo: {
          src: '/assets/imgs/siemens_internship.png',
          alt: 'Siemens Internship'
        },
        highlights: [
          'Medical Imaging Systems',
          'Hardware Experience'
        ],
        skills: ['Medical Imaging', 'PET-CT', 'MRI', 'Technical Documentation'],
        documents: {
          certificate: '/certificates/siemens_certificate.pdf',
          report: '/certificates/SIEMENS_INTERNSHIP_REPORT.pdf'
        }
      }
    ]
  }
];