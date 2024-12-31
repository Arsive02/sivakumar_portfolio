import { BookMarked, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredResources = [
  {
    topic: "Quantum Computing",
    resources: [
      {
        title: "Dancing with Qubits",
        description: "How quantum computing works and how it can change the world of computing",
        url: "https://learning.oreilly.com/library/view/dancing-with-qubits",
        tags: ["Quantum Computing", "Book"],
      }
    ]
  },
  {
    topic: "Mathematics",
    resources: [
      {
        title: "3Blue1Brown: Linear Algebra",
        description: "Visual and intuitive understanding of linear algebra",
        url: "https://www.3blue1brown.com/topics/linear-algebra",
        tags: ["Linear Algebra", "Playlist"],
      }
    ]
  },
  {
    topic: "AI",
    resources: [
      {
        title: "Deep learning book",
        description: "Textbook for deep learning",
        url: "https://www.deeplearningbook.org/",
        tags: ["Deep Learning", "Book"],
      }
    ]
  },
  {
    topic: "Statistics",
    resources: [
      {
        title: "Introduction to Statistical Learning",
        description: "Textbook for statistical learning",
        url: "https://www.statlearning.com/",
        tags: ["Statistical Learning", "Book"],
      }
    ]
  }
];

const ResourcePreview = () => {
  return (
    <section id="resources-preview" className="relative py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10">
              <BookMarked className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learning Resources
            </h2>
          </div>
          <Link 
            to="/resources"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-indigo-500/10 hover:bg-indigo-500/20 transition-all duration-300
                     text-indigo-400 hover:text-indigo-300"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300
                                   group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredResources.map((topicGroup, topicIndex) => (
            <div 
              key={topicIndex}
              className="space-y-6"
            >
              {/* Topic Header */}
              <h3 className="text-xl font-semibold text-white/90">
                {topicGroup.topic}
              </h3>

              {/* Resources */}
              <div className="space-y-4">
                {topicGroup.resources.map((resource, resourceIndex) => (
                  <div
                    key={resourceIndex}
                    className="group relative overflow-hidden p-6 rounded-xl
                             bg-gradient-to-br from-gray-900/80 via-gray-900/90 to-gray-900/80
                             border-l-4 border-indigo-500/50 hover:border-indigo-400
                             transition-all duration-300 hover:shadow-lg 
                             hover:shadow-indigo-500/10"
                  >
                    {/* Resource Content */}
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-medium text-indigo-300 
                                   group-hover:text-indigo-200 transition-colors">
                        {resource.title}
                      </h4>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20
                                 transition-all duration-300 group-hover:scale-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                      </a>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">
                      {resource.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 text-xs rounded-full
                                   bg-gradient-to-r from-indigo-500/10 to-purple-500/10
                                   text-indigo-300 ring-1 ring-indigo-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Hover Gradient */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br
                                  from-indigo-500/5 via-purple-500/5 to-pink-500/5
                                  opacity-0 group-hover:opacity-100
                                  transition-opacity duration-500" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default ResourcePreview;