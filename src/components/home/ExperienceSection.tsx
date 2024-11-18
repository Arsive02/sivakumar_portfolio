import { ArrowRight, Briefcase, LucideArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExperienceSection = () => {
  const experiences = [
    {
      title: "Data Scientist",
      company: "ZOHO",
      period: "May 2022 – July 2024",
      highlights: [
        "Advanced RAG Architecture: Developed and scaled an advanced Retrieval-Augmented Generation (RAG) system using VLLM, supporting millions of users with multi-modal input processing and reduced hallucinations.",
        "Implemented diverse AI solutions, including customer assistance prediction, phishing detection with 90% accuracy, generative AI tasks like FAQ Generation, reply mail generation, and summary generation.",
        "Multimodality Research: Engaged in foundational work on multimodal AI systems.",
        "Mentorship: Guided, and mentored interns to full-time employees."
      ]
    },
    {
      title: "Trainee",
      company: "ZOHO",
      period: "Sep 2021 – Apr 2022",
      highlights: [
        "Foundational NLP research ranging from rule-based methodologies to implementation of seq-to-seq architectures.",
        "Developed a Java-based e-commerce web application with RESTful APIs using JAX-RS."
      ]
    }
  ];

  return (
    <section className="relative py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold">Experience</h2>
          </div>
          <Link 
            to="/experience"
            className="group flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg
                     hover:bg-gray-800/80 transition-all duration-300"
          >
            <span className="text-gray-300 group-hover:text-white">View All</span>
            <LucideArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-white 
                                         transform group-hover:translate-x-1 group-hover:-translate-y-1 
                                         transition-transform duration-300" />
          </Link>
        </div>

        {/* Timeline */}
        <div className="relative space-y-8">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 to-purple-500 opacity-20" />

          {experiences.map((exp, index) => (
            <div 
              key={index}
              className="relative pl-24 group"
            >
              {/* Timeline Node */}
              <div className="absolute left-7 top-0 w-3 h-3 rounded-full bg-blue-500 
                            transform -translate-x-1/2 group-hover:scale-125 transition-transform duration-300">
                <div className="absolute inset-0 rounded-full bg-blue-500 opacity-25 
                              group-hover:animate-ping" />
              </div>

              {/* Content Card */}
              <div className="relative p-6 bg-gray-900/50 rounded-lg border border-blue-500/20
                            transform hover:scale-[1.02] transition-all duration-300
                            hover:bg-gray-900/70 group-hover:border-blue-500/40">
                {/* Company & Duration */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-400">{exp.title}</h3>
                    <p className="text-gray-400">{exp.company}</p>
                  </div>
                  <span className="px-3 py-1 text-sm text-gray-400 bg-gray-800/50 rounded-full">
                    {exp.period}
                  </span>
                </div>

                {/* Highlights */}
                <ul className="space-y-3">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <ArrowRight className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;