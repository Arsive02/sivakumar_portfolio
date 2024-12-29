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
      certificatePDF?: string;
    }>;
    awards: Array<{
      title: string;
      description: string;
      longDescription: string;
      issuer: string;
      date: string;
      skills: string[];
      highlights: string[];
      verificationLink?: string;
      category?: string;
      certificateImage?: string;
      certificatePDF?: string;
    }>;
    contributions: Array<{
      title: string;
      description: string;
      longDescription: string;
      issuer: string;
      date: string;
      skills: string[];
      highlights: string[];
      verificationLink?: string;
      category?: string;
      certificateImage?: string;
      certificatePDF?: string;
    }>;
  };

  const categoryData: CategoryData = {
   certifications: [
    {
      title: "Natural Language Processing Specialization",
      description: "Advanced NLP techniques and architectures",
      longDescription: "Comprehensive specialization covering core NLP concepts, deep learning approaches for NLP, and sequence models.",
      issuer: "Coursera - Stanford University - DeepLearning.AI",
      date: "Oct 2022",
      credentialId: "JFDNHB4YM3AR",
      skills: ["NLP", "Deep Learning", "Text Processing", "Sequence Models"],
      category: "ai-ml",
      verificationLink: "https://www.coursera.org/account/accomplishments/specialization/JFDNHB4YM3AR",
      highlights: [
        "Use logistic regression, naïve Bayes, and word vectors to implement sentiment analysis, complete analogies & translate words.",
        "Use dynamic programming, hidden Markov models, and word embeddings to implement autocorrect, autocomplete & identify part-of-speech tags for words.",
        "Use recurrent neural networks, LSTMs, GRUs & Siamese networks for sentiment analysis, text generation & named entity recognition.",
        "Use encoder-decoder, causal, & self-attention to machine translate complete sentences, summarize text, and answer questions."
      ]
    },
    {
      title: "Deep Learning Specialization",
      description: "Advanced neural network architectures and deep learning concepts",
      longDescription: "In-depth study of neural networks, optimization algorithms, and deep learning applications across various domains.",
      issuer: "Coursera - DeepLearning.AI",
      date: "Apr 2022",
      credentialId: "DEVTH7W95X9T",
      skills: ["Neural Networks", "CNN", "RNN", "Deep Learning"],
      category: "ai-ml",
      verificationLink: "https://www.coursera.org/account/accomplishments/specialization/DEVTH7W95X9T",
      highlights: [
        "Build and train deep neural networks, identify key architecture parameters, implement vectorized neural networks and deep learning to applications",
        "Train test sets, analyze variance for DL applications, use standard techniques and optimization algorithms, and build neural networks in TensorFlow",
        "Build a CNN and apply it to detection and recognition tasks, use neural style transfer to generate art, and apply algorithms to image and video data",
        "Build and train RNNs, work with NLP and Word Embeddings, and use HuggingFace tokenizers and transformer models to perform NER and Question Answering"
      ]
    },
    {
      title: "Machine Learning",
      description: "Core machine learning algorithms and methodologies",
      longDescription: "Comprehensive coverage of machine learning concepts, from supervised learning to unsupervised learning and special applications.",
      issuer: "Coursera - Stanford University - Andrew Ng",
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
        "Create, train and evaluate a neural network in TensorFlow",
        "Understand the basics of neural networks",
        "Solve classification problems with neural networks",
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
      title: "Introduction to Git and GitHub",
      description: "Version control and collaboration using Git",
      longDescription: "Certification for understanding the basics of Git version control and GitHub collaboration.",
      issuer: "Coursera - Google",
      date: "July 2020",
      credentialId: "EKH2UNG5RWNG",
      category: "tools",
      verificationLink: "https://www.coursera.org/account/accomplishments/verify/EKH2UNG5RWNG",
      certificatePDF: "/certificates/git.pdf",
      skills: ["Git", "GitHub", "Version Control", "Collaboration"],
      highlights: [
        "Understand why version control is a fundamental tool for coding and collaboration",
        "Install and run Git on your local machine",
        "Use and interact with GitHub",
        "Collaborate with others through remote repositories"
      ]
    },
    {
      title: "Introduction to Programming with MATLAB",
      description: "MATLAB programming fundamentals",
      longDescription: "Certification for understanding the basics of MATLAB programming and data analysis.",
      issuer: "Coursera - Vanderbilt University",
      date: "August 2020",
      credentialId: "LGLX4PLXAGQG",
      category: "programming",
      verificationLink: "https://www.coursera.org/account/accomplishments/verify/LGLX4PLXAGQG",
      certificatePDF: "/certificates/matlab.pdf",
      skills: ["MATLAB", "Programming", "Data Analysis", "Problem Solving"],
      highlights: [
        "Fundamental computer programming concepts such as variables, control structures, functions and many others.",
        "Various data types and how to handle them in MATLAB.",
        "Working with matrices.",
        "File input or output."
      ]
    },
    {
      title: "The Sustainable Development Goals – A global, transdisciplinary vision for the future",
      description: "Sustainable development and global goals",
      longDescription: "Certification for understanding the United Nations Sustainable Development Goals and their global impact.",
      issuer: "Coursera - University of Copenhagen",
      date: "July 2020",
      credentialId: "5Q7YQ5XU7N3Q",
      category: "data-science",
      verificationLink: "https://www.coursera.org/account/accomplishments/verify/5Q7YQ5XU7N3Q",
      certificatePDF: "/certificates/datascience.pdf",
      skills: ["Sustainable Development", "Global Goals", "Impact Assessment"],
      highlights: [
        "Understanding the 17 Sustainable Development Goals (SDGs) and their interconnectivity.",
        "The role of the United Nations in global governance and the SDGs.",
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
      certificateImage: "/certificates/jlpt.png",
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
      title: "Goodreads Book Review Competition - Winner",
      description: "Winner of the Goodreads book review competition - 2022",
      longDescription: "Developed a custom T5 base model for predicting book ratings based on reviews and won the Goodreads competition on both public and private leaderboard.",
      issuer: "Kaggle",
      date: "2023",
      category: "nlp",
      verificationLink: "https://www.kaggle.com/competitions/goodreads-books-reviews-290312/leaderboard",
      skills: ["NLP", "Deep Learning", "T5 Model", "Competition"],
      highlights: [
        "Developed custom T5 model for book rating prediction",
        "Optimized model for inference speed and accuracy",
        "Achieved top position on public and private leaderboard"
      ]
    },
    {
      title: "National Mathematics Conference - 2nd Place",
      description: "2nd place in the International Mathematics Conference",
      longDescription: "Field of Mathematics in Astronomy - Second place in the International Mathematics Conference for presenting a paper on 'Applications of Differential Equations in Celestial Mechanics'.",
      issuer: "SRM Institute of Science and Technology",
      date: "2018",
      category: "mathematics",
      skills: ["Mathematics", "Astronomy", "Differential Equations", "Research"],
      highlights: [
        "Presented paper on celestial mechanics",
        "Applications of differential equations",
        "Mathematical modeling in astronomy"
      ]
    },
    {
      title: "Paper Presentation - AIoT",
      description: "3rd place in the National Paper Presentation on AIoT",
      longDescription: "National level paper presentation competition on Artificial Intelligence of Things (AIoT) - Secured 3rd place for presenting a paper on 'AIoT in Smart BiCycles'.",
      issuer: "Prince Shri Bhavani College of Engineering and Technology",
      date: "2021",
      category: "iot",
      skills: ["AIoT", "Smart Devices", "Research", "Paper Presentation"],
      highlights: [
        "Presented paper on AIoT in smart devices",
        "Applications of AI in IoT",
        "Smart bicycles and AIoT"
      ]
    },
    {
      title: "Academic Excellence Award",
      description: "Class topper in Electronics and Communication Engineering freshman year",
      longDescription: "Awarded for performing consistently in the freshman year of Electronics and Communication Engineering.",
      issuer: "Anna University - Sai Ram Engineering College",
      date: "2019",
      category: "engineering",
      skills: ["Electronics", "Communication", "Engineering", "Academic Excellence"],
      highlights: [
        "Topper in freshman year",
        "Consistent academic performance",
        "Electronics and Communication Engineering"
      ]
    }
  ],
  
  // Open Source Page
   contributions: [
    {
      title: "Goodreads competition winner model - T5 base",
      description: "Custom T5 model for book rating prediction",
      longDescription: "Open sourced a custom T5 base model for predicting book ratings based on reviews that won the Goodreads competition 2022 on both public and private leaderboard.",
      issuer: "Personal Project",
      date: "2022",
      skills: ["NLP", "Deep Learning", "T5 Model", "Competition"],
      highlights: [
        "Custom T5 model for book rating prediction",
        "Optimized model for inference speed and accuracy",
        "Achieved top position on public and private leaderboard"
      ],
      verificationLink: "https://github.com/Arsive02/Goodreads_Books_Review_Rating_Prediction"
    },
    {
      title: "RoBERTa Toxicity Classifier",
      description: "Toxicity classification model using RoBERTa",
      longDescription: "Developed a RoBERTa model for classifying toxic comments in online forums and open sourced the model for public use.",
      issuer: "Personal Project",
      date: "2023",
      skills: ["NLP", "Deep Learning", "RoBERTa Model", "Classification"],
      highlights: [
        "RoBERTa model for toxicity classification",
        "Optimized model for accuracy and speed",
        "Open sourced for public use"
      ],
      verificationLink: "https://huggingface.co/Arsive/roberta-toxicity-classifier"
    },
    {
      title: "Paligemma Image to JSON Converter",
      description: "Invoice image to JSON data converter",
      longDescription: "Developed a custom image to JSON converter for extracting text data from invoice images and open sourced the model for public use.",
      issuer: "Personal Project",
      date: "2023",
      skills: ["Computer Vision", "OCR", "Data Extraction", "Open Source"],
      highlights: [
        "Image to JSON data extraction",
        "OCR for text extraction",
        "Open sourced for public use"
      ],
      verificationLink: "https://huggingface.co/Arsive/paligemma-img-to-json"
    },
    {
      title: "Mistral Optimization - Look Ahead Decoder Mechanism",  
      description: "Custom decoder mechanism for Mistral models",
      longDescription: "Contributed a custom look ahead decoder mechanism for Mistral models to improve inference speed and accuracy.",
      issuer: "contributor",
      date: "2024",
      skills: ["NLP", "Deep Learning", "Mistral Model", "Optimization"],
      highlights: [
        "Custom decoder mechanism for Mistral models",
        "Optimized for inference speed and accuracy",
        "Contributed to open source project"
      ]
    }
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