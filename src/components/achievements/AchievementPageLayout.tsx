import { ChevronLeft, Search, Award, Star, Code, ExternalLink, LayoutList, LayoutGrid, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AchievementCard from './AchievementCard';

// Base Achievement Page Layout
interface AchievementPageLayoutProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  children: React.ReactNode;
  verificationLink?: string;
}

const AchievementPageLayout: React.FC<AchievementPageLayoutProps> = ({ 
  title, 
  icon: Icon, 
  color, 
  children 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
            to="/home?section=achievements" 
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-900/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-3 rounded-xl bg-${color}-500/10`}>
            <Icon className={`w-8 h-8 text-${color}-400`} />
          </div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};

// Achievement Detail Component
interface Achievement {
  verificationLink?: string;
  title: string;
  description: string;
  longDescription: string;
  issuer: string;
  date: string;
  skills?: string[];
  highlights?: string[];
}

const AchievementDetail: React.FC<{ achievement: Achievement; color: string }> = ({ achievement, color }) => (
  <div className="bg-gray-900/30 rounded-xl p-6 h-full border border-gray-800">
    <h3 className="text-xl font-semibold text-gray-200 mb-4">About this Achievement</h3>
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
        <p className="text-gray-300">{achievement.longDescription}</p>
      </div>
      {achievement.skills && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Skills Gained</h4>
          <div className="flex flex-wrap gap-2">
            {achievement.skills.map((skill, index) => (
              <span 
                key={index}
                className={`px-2 py-1 text-sm rounded-full bg-${color}-500/10 text-${color}-300`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {achievement.highlights && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Highlights</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {achievement.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

interface Certificate {
  title: string;
  description: string;
  longDescription: string;
  issuer: string;
  date: string;
  skills?: string[];
  highlights?: string[];
  verificationLink?: string;
  category: string;
}

interface CertificatesDisplayProps {
  certificates: Certificate[];
  viewMode: 'list' | 'grid';
  filterCategory: string;
  searchTerm: string;
  sortBy: 'date' | 'title' | 'issuer';
  sortOrder: 'asc' | 'desc';
  setViewMode: (mode: 'list' | 'grid') => void;
  setFilterCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: 'date' | 'title' | 'issuer') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}


const certifications = [
  {
    title: "Natural Language Processing Specialization",
    description: "Advanced NLP techniques and architectures",
    longDescription: "Comprehensive specialization covering core NLP concepts, deep learning approaches for NLP, and sequence models.",
    issuer: "Coursera",
    date: "Oct 2022",
    credentialId: "JFDNHB4YM3AR",
    skills: ["NLP", "Deep Learning", "Text Processing", "Sequence Models"],
    category: "ai-ml",
    verificationLink: "https://www.coursera.org/account/accomplishments/specialization/JFDNHB4YM3AR",
    highlights: [
      "Sentiment analysis and text classification",
      "Neural machine translation",
      "Speech recognition systems",
      "Attention mechanisms and transformers"
    ]
  },
  {
    title: "Deep Learning Specialization",
    description: "Advanced neural network architectures and deep learning concepts",
    longDescription: "In-depth study of neural networks, optimization algorithms, and deep learning applications across various domains.",
    issuer: "Coursera",
    date: "Apr 2022",
    credentialId: "DEVTH7W95X9T",
    skills: ["Neural Networks", "CNN", "RNN", "Deep Learning"],
    category: "ai-ml",
    verificationLink: "https://www.coursera.org/account/accomplishments/specialization/DEVTH7W95X9T",
    highlights: [
      "Convolutional Neural Networks",
      "Sequence Models",
      "Optimization Algorithms",
      "Deep Learning Projects"
    ]
  },
  {
    title: "Machine Learning",
    description: "Core machine learning algorithms and methodologies",
    longDescription: "Comprehensive coverage of machine learning concepts, from supervised learning to unsupervised learning and special applications.",
    issuer: "Coursera",
    date: "Apr 2022",
    credentialId: "Q7G4VB62HQBK",
    category: "ai-ml",
    verificationLink: "https://www.coursera.org/account/accomplishments/verify/Q7G4VB62HQBK",
    skills: ["Supervised Learning", "Unsupervised Learning", "ML Algorithms", "Data Analysis"],
    highlights: [
      "Linear and Logistic Regression",
      "Neural Networks",
      "Support Vector Machines",
      "Clustering Algorithms"
    ]
  },
  {
    title: "Problem Solving (Basic)",
    description: "Algorithmic problem-solving certification",
    longDescription: "Certification for demonstrating proficiency in basic algorithms and data structures.",
    issuer: "HackerRank",
    date: "Sep 2021",
    credentialId: "3C2D7E87403C",
    category: "programming",
    verificationLink: "https://www.hackerrank.com/certificates/3C2D7E87403C",
    skills: ["Algorithms", "Data Structures", "Problem Solving"],
    highlights: [
      "Algorithm Implementation",
      "Data Structure Usage",
      "Time Complexity Analysis"
    ]
  },
  {
    title: "Python (Basic)",
    description: "Core Python programming certification",
    longDescription: "Certification demonstrating proficiency in Python programming fundamentals.",
    issuer: "HackerRank",
    date: "Sep 2021",
    credentialId: "8ED97EAC7704",
    category: "programming",
    verificationLink: "https://www.hackerrank.com/certificates/8ED97EAC7704",
    skills: ["Python", "Programming", "Data Structures"],
    highlights: [
      "Python Fundamentals",
      "Object-Oriented Programming",
      "Python Libraries"
    ]
  },
  {
    title: "Basic Image Classification with TensorFlow",
    description: "Image classification using deep learning",
    longDescription: "Practical implementation of image classification using TensorFlow and deep learning techniques.",
    issuer: "Coursera",
    date: "May 2020",
    credentialId: "W2HZ4BZDQ54H",
    category: "computer-vision",
    verificationLink: "https://www.coursera.org/account/accomplishments/verify/W2HZ4BZDQ54H",
    skills: ["TensorFlow", "Computer Vision", "Deep Learning", "Image Classification"],
    highlights: [
      "CNN Architecture",
      "Image Processing",
      "Model Training",
      "Performance Optimization"
    ]
  },
  {
    title: "Image Super Resolution Using Autoencoders",
    description: "Advanced image processing techniques",
    longDescription: "Implementation of autoencoder architectures for image super-resolution using Keras.",
    issuer: "Coursera",
    date: "May 2020",
    credentialId: "224HMQYX5MP6",
    category: "computer-vision",
    verificationLink: "https://www.coursera.org/account/accomplishments/verify/224HMQYX5MP6",
    skills: ["Deep Learning", "Computer Vision", "Keras", "Autoencoders"],
    highlights: [
      "Autoencoder Architecture",
      "Image Enhancement",
      "Deep Learning Models",
      "Keras Implementation"
    ]
  },
  {
    title: "Japanese Language N5 Level",
    description: "Basic Japanese language proficiency",
    longDescription: "Certification for basic Japanese language skills including reading, writing, and conversation.",
    issuer: "The Japan Foundation",
    date: "Dec 2019",
    category: "language",
    skills: ["Japanese Language", "Basic Communication", "Cultural Understanding"],
    highlights: [
      "Basic Conversation",
      "Hiragana and Katakana",
      "Basic Kanji",
      "Cultural Context"
    ]
  }
];

const CertificatesDisplay: React.FC<CertificatesDisplayProps> = ({
  certificates,
  viewMode,
  filterCategory,
  searchTerm,
  sortBy,
  sortOrder,
  setViewMode,
  setFilterCategory,
  setSearchTerm,
  setSortBy,
  setSortOrder
}) => {
  const categories = {
    'all': 'All Certifications',
    'ai-ml': 'AI & Machine Learning',
    'programming': 'Programming & Development',
    'computer-vision': 'Computer Vision',
    'language': 'Language & Others'
  };

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'title', label: 'Title' },
    { value: 'issuer', label: 'Issuer' }
  ];

  const sortCertifications = (certs: Certificate[]) => {
    return [...certs].sort((a, b) => {
      let compareResult = 0;
      switch (sortBy) {
        case 'date':
          compareResult = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'title':
          compareResult = a.title.localeCompare(b.title);
          break;
        case 'issuer':
          compareResult = a.issuer.localeCompare(b.issuer);
          break;
      }
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
  };

  // Filter function
  const filteredCertifications = sortCertifications(
    certificates.filter(cert => 
      (filterCategory === 'all' || cert.category === filterCategory) &&
      (cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       cert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="mb-8 space-y-4">
        {/* View Mode and Sort Controls */}
        <div className="flex justify-between items-center">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-4 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="List View"
            >
              <LayoutList className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
              title="Toggle Sort Order"
            >
              {sortOrder === 'asc' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterCategory(key)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                filterCategory === key 
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {label}
              <span className="ml-2 text-sm opacity-75">
                ({certificates.filter(cert => key === 'all' || cert.category === key).length})
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Certificates Display */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
        {filteredCertifications.map((cert, index) => (
          <div key={index} className={`flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row gap-8'}`}>
            {/* Certificate Card */}
            <div className={`${viewMode === 'grid' ? 'w-full' : 'w-1/2'} bg-gray-900/50 rounded-xl 
                          border border-gray-800/50 transition-all duration-500 transform 
                          hover:scale-[1.02] hover:border-blue-500/30`}>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Award className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-400">
                      {cert.title}
                    </h3>
                  </div>
                  {cert.verificationLink && (
                    <a
                      href={cert.verificationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                    </a>
                  )}
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                  <span>{cert.issuer}</span>
                  <span>{cert.date}</span>
                </div>

                <p className="text-gray-300">{cert.description}</p>

                {cert.skills && (
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-sm rounded-full bg-blue-500/10 text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Details Panel */}
            <div className={`${viewMode === 'grid' ? 'w-full mt-4' : 'w-1/2'} 
                          bg-gray-900/30 rounded-xl border border-gray-800 p-6`}>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                  <p className="text-gray-300">{cert.longDescription}</p>
                </div>

                {cert.highlights && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Key Highlights</h4>
                    <ul className="space-y-3">
                      {cert.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3 group">
                          <div className="flex-shrink-0 mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 
                                          group-hover:scale-125 transition-transform" />
                          </div>
                          <span className="text-gray-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CertificationsPage = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'issuer'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  return (
    <AchievementPageLayout title="Certifications" icon={Award} color="blue">
      <CertificatesDisplay
        certificates={certifications}
        viewMode={viewMode}
        filterCategory={filterCategory}
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setViewMode={setViewMode}
        setFilterCategory={setFilterCategory}
        setSearchTerm={setSearchTerm}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
      />
    </AchievementPageLayout>
  );
};

// Awards Page
const AwardsPage = () => {
  const [selectedAward, setSelectedAward] = useState<Achievement | null>(null);
  
  const awards = [
    {
      title: "Kaggle Competition - Top 5%",
      description: "Achieved exceptional ranking in NLP competition",
      longDescription: "Developed an innovative approach to natural language processing that ranked in the top 5% of global participants.",
      issuer: "Kaggle",
      date: "2023",
      skills: ["NLP", "Python", "Machine Learning", "Data Analysis"],
      highlights: [
        "Implemented custom BERT architecture",
        "Achieved 95% accuracy on test set",
        "Shared solution with community"
      ]
    },
    // Add more awards
  ];

  return (
    <AchievementPageLayout title="Awards & Achievements" icon={Star} color="purple">
      <div className="flex gap-8">
        <div className="w-1/2 space-y-4">
          {awards.map((award, index) => (
            <div
              key={index}
              onClick={() => setSelectedAward(award)}
              className={`cursor-pointer transition-all duration-300 ${
                selectedAward === award ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <AchievementCard
                {...award}
                icon={Star}
                color="purple"
              />
            </div>
          ))}
        </div>
        
        <div className="w-1/2 sticky top-24">
          {selectedAward ? (
            <AchievementDetail 
              achievement={selectedAward}
              color="purple"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select an award to view details
            </div>
          )}
        </div>
      </div>
    </AchievementPageLayout>
  );
};

// Open Source Page
const OpenSourcePage = () => {
  const [selectedContribution, setSelectedContribution] = useState<Achievement | null>(null);
  
  const contributions = [
    {
      title: "TensorFlow",
      description: "Contributed to core documentation and bug fixes",
      longDescription: "Made significant contributions to TensorFlow's documentation and fixed critical bugs in the core library.",
      issuer: "Google",
      date: "2023",
      skills: ["Python", "TensorFlow", "Technical Writing", "Debugging"],
      highlights: [
        "Improved documentation clarity",
        "Fixed memory leak in data pipeline",
        "Added new examples for custom training loops"
      ]
    },
    // Add more contributions
  ];

  return (
    <AchievementPageLayout title="Open Source Contributions" icon={Code} color="emerald">
      <div className="flex gap-8">
        <div className="w-1/2 space-y-4">
          {contributions.map((contribution, index) => (
            <div
              key={index}
              onClick={() => setSelectedContribution(contribution)}
              className={`cursor-pointer transition-all duration-300 ${
                selectedContribution === contribution ? 'ring-2 ring-emerald-500' : ''
              }`}
            >
              <AchievementCard
                {...contribution}
                icon={Code}
                color="green"
              />
            </div>
          ))}
        </div>
        
        <div className="w-1/2 sticky top-24">
          {selectedContribution ? (
            <AchievementDetail 
              achievement={selectedContribution}
              color="emerald"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a contribution to view details
            </div>
          )}
        </div>
      </div>
    </AchievementPageLayout>
  );
};

export { CertificationsPage, AwardsPage, OpenSourcePage };