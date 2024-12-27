import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy } from 'lucide-react';
import AchievementCarousel from '@/components/achievements/AchievementCarousel';

const AchievementsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeType, setActiveType] = useState<keyof CategoryData>('certifications');
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && ['certifications', 'awards', 'contributions'].includes(category)) {
      setActiveType(category as keyof CategoryData);
    }
  }, [location]);
  type CategoryData = {
    certifications: Array<{
      title: string;
      description: string;
      longDescription: string;
      issuer: string;
      date: string;
      credentialId: string;
      skills: string[];
      category: string;
      verificationLink: string;
      highlights: string[];
      certificateImage?: string;
    }>;
    awards: Array<{
      title: string;
      description: string;
      longDescription: string;
      issuer: string;
      date: string;
      skills: string[];
      highlights: string[];
    }>;
    contributions: Array<{
      title: string;
      description: string;
      longDescription: string;
      issuer: string;
      date: string;
      skills: string[];
      highlights: string[];
    }>;
  };

  const categoryData: CategoryData = {
   certifications: [
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
      credentialId: "",
      category: "language",
      verificationLink: "",
      certificateImage: "/certificates/jlpt-n5.png",
      skills: ["Japanese Language", "Basic Communication", "Cultural Understanding"],
      highlights: [
        "Basic Conversation",
        "Hiragana and Katakana",
        "Basic Kanji",
        "Cultural Context"
      ]
    }
  ],
  
   awards: [
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
    }
    // Add more awards as needed
  ],
  
  // Open Source Page
   contributions: [
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
    }
    // Add more contributions as needed
  ]
  };

  const handleBack = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Navigate back to home page achievements section
    navigate('/home?section=achievements');
  };

  const handleCategoryChange = (category: keyof CategoryData) => {
    setActiveType(category);
    // Update URL without navigating
    const newUrl = `/achievements?category=${category}`;
    window.history.pushState({}, '', newUrl);
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white
                     px-4 py-2 rounded-lg transition-colors
                     hover:bg-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Title Section */}
      <div className="fixed top-0 left-0 right-0 pt-20 pb-8 z-40 pointer-events-none
                    bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="text-center relative">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-blue-500/20 backdrop-blur-sm">
              <Trophy className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Achievements Gallery
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Explore my certifications, awards, and contributions
          </p>
        </div>
      </div>

      {/* Category Selection */}
      <div className="fixed top-40 left-1/2 transform -translate-x-1/2 z-50 
                    flex items-center gap-4 px-6 py-3 rounded-2xl
                    bg-black/30 backdrop-blur-xl border border-white/10">
        {Object.entries(categoryData).map(([key, items]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key as keyof CategoryData)}
            className={`px-4 py-2 rounded-xl transition-all duration-300
                      ${activeType === key 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'text-gray-400 hover:text-white'}`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-900/50 text-xs">
              {items.length}
            </span>
          </button>
        ))}
      </div>

      {/* Carousel Section */}
      <div className="min-h-screen pt-60">
        <AchievementCarousel data={categoryData[activeType]} />
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default AchievementsPage;