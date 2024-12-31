import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Gamepad2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HobbyData {
  id: string;
  title: string;
  description: string;
  story: string;
  level: number;
  xp: number;
  achievements: string[];
  images: string[];
  video?: {
    url: string;
    title: string;
  };
  socials?: {
    name: string;
    url: string;
  }[];
}

const getEmbedUrl = (url: string) => {
    // Handle YouTube Shorts
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('shorts/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Handle regular YouTube URLs
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    return url;
  };

const HobbiesPage = () => {
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const hobbies: HobbyData[] = [
    {
      id: 'chess',
      title: 'Chess',
      description: 'Path to some title :)',
      level: 30,
      xp: 1200,
      story: `Quest Log: Chess Journey\n
      Initial Spawn: Started as a beginner pawn, learning the basic moves and strategies.\n
      Level Up: Through countless battles on the checkered battlefield, reached the rank of... well, 1000 ELO.\n
      Boss Battles: Competed in local tournaments, only to get humiliated by 9 year olds\n
      Current Quest: Getting out from the 1200 ELO plateau and aiming for 1400.`,
      achievements: [
        'Started Chess Journey',
        'Surpassed 1000 ELO',
        'Local Tournament Participant'
      ],
      images: [],
      video: {
        url: 'https://youtube.com/shorts/XfDiKDH0_WM?si=eQrvlUHAmd62nvhg',
        title: 'Chess Gameplay'
      },
        socials: [
            {
            name: 'lichess',
            url: 'https://lichess.org/@/Arsive02'
            },
            {
            name: 'chess.com',
            url: 'https://www.chess.com/member/arsive'
            }
        ]
    },
    {
      id: 'flute',
      title: 'Flute',
      description: 'Wind Instrument - The Sound of Nature',
      level: 10,
      xp: 2000,
      story: `Quest Log: Mastering the Flute\n
      Tutorial Stage: Learned basic notes and breathing techniques.\n
      Skill Tree Unlocked: Few classical pieces and unlocked contemporary style abilities.\n
      Side Quests: Performed at my first event, gaining experience points and new musical powers.\n
      Current Mission: Practicing ear training and improvisation skills.`,
      achievements: [
        'First Public Performance',
        'Classical Music Lover',
        'Contemporary Flute Player'
      ],
      images: [],
        video: {
            url: '/assets/vids/flute_public.mp4',
            title: 'Flute Performance'
        },
    },
    {
      id: 'boxing',
      title: 'Boxing',
      description: 'Physical Combat Class',
      level: 2,
      xp: 500,
      story: `Quest Log: Boxing Saga\n
      Tutorial Complete: Mastered basic stances and combinations.\n
      Skill Points Invested: Developed knockout power and defensive techniques.\n
      Current Quest: Training for the first sparring match and endurance challenges.`,
      achievements: [
        'Punching Bag Destroyer',
        'Defensive Master',
        'Endurance +50'
      ],
      images: []
    },
    {
      id: 'japanese',
      title: 'Language learning',
      description: 'Linguistic Mastery',
      level: 25,
      xp: 4200,
      story: `Quest Log: Japanese Language Quest\n
      Beginning Stage: Started with basic hiragana and katakana spells.\n
      Skill Tree Progress: Unlocked kanji knowledge and conversation abilities.\n
      Achievement Unlocked: JLPT N5 certification acquired.\n
      Current Mission: Training to master more advanced language skills.`,
      achievements: [
        'JLPT N5 Complete',
        'Basic Conversation Master',
        'Cultural Knowledge +100'
      ],
      images: ['/assets/imgs/jlpt_class.jpg']
    }
  ];

  const selectedHobbyData = hobbies.find(h => h.id === selectedHobby);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background Game Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(33,33,33,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(33,33,33,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md z-50 border-b-2 border-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            to="/home?section=hobbies"
            className="group flex items-center gap-2 w-fit px-4 py-2 rounded-lg 
                     bg-purple-500/20 hover:bg-purple-500/30 
                     border-2 border-purple-500/50 hover:border-purple-500
                     transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400">Return to Hub</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Gamepad2 className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text 
                         bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Character Skills & Abilities
            </h1>
          </div>
          <p className="text-purple-300/80">Select a skill to view your progress and achievements</p>
        </div>

        {/* Skill Selector */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 rounded-lg 
                       bg-purple-500/20 hover:bg-purple-500/30
                       border-2 border-purple-500/50 hover:border-purple-500
                       flex items-center justify-between
                       transition-all duration-300 group"
            >
              <span className="text-purple-300">
                {selectedHobby ? hobbies.find(h => h.id === selectedHobby)?.title : 'Select Skill'}
              </span>
              <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform duration-300 
                                  ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 py-2
                           bg-black border-2 border-purple-500/50 rounded-lg
                           shadow-lg shadow-purple-500/20 z-50"
                >
                  {hobbies.map((hobby) => (
                    <button
                      key={hobby.id}
                      onClick={() => {
                        setSelectedHobby(hobby.id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-purple-300
                               hover:bg-purple-500/20 transition-colors duration-300
                               flex items-center justify-between group"
                    >
                      <span>{hobby.title}</span>
                      <span className="text-sm text-purple-400">Lvl {hobby.level}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Selected Skill Content */}
        <AnimatePresence mode="wait">
          {selectedHobbyData && (
            <motion.div
              key={selectedHobbyData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Skill Stats */}
              <div className="mb-8 p-6 rounded-lg bg-purple-500/10 border-2 border-purple-500/50">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-purple-400">
                    {selectedHobbyData.title}
                  </h2>
                  <div className="text-right">
                    <div className="text-purple-300">Level {selectedHobbyData.level}/100</div>
                    <div className="text-sm text-purple-400/80">XP: {selectedHobbyData.xp}</div>
                </div>
                </div>

                {/* XP Bar */}
                <div className="w-full h-4 bg-purple-900/50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedHobbyData.level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
                </div>
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {selectedHobbyData.images.map((image, index) => (
                  <div 
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden
                             border-2 border-purple-500/50 group"
                  >
                    <img 
                      src={image}
                      alt={`${selectedHobbyData.title} ${index + 1}`}
                      className="w-full h-full object-cover 
                               transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                ))}
              </div>

              {selectedHobbyData.video && (
                <div className="mb-8">
                    <div className="relative aspect-video rounded-lg overflow-hidden
                                border-2 border-purple-500/50">
                    <div className="flex justify-center">
                      {selectedHobbyData.video.url.includes('youtube.com') ? (
                        <iframe width="560" height="315"
                          src={getEmbedUrl(selectedHobbyData.video.url)}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen></iframe>
                      ) : (
                        <video width="560" height="315" controls>
                          <source src={selectedHobbyData.video.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                    </div>
                </div>
                )}

              {/* Quest Log */}
              <div className="space-y-6">
                {/* Story */}
                <div className="p-6 rounded-lg bg-purple-500/10 border-2 border-purple-500/50">
                  <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Quest Progress
                  </h3>
                  <div className="space-y-4 text-purple-300/90">
                    {selectedHobbyData.story.split('\n').map((paragraph, index) => (
                      <p key={index} className="leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="p-6 rounded-lg bg-purple-500/10 border-2 border-purple-500/50">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Achievements Unlocked</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedHobbyData.achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg bg-purple-500/20 border border-purple-500/50
                                 flex items-center gap-2"
                      >
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-purple-300">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

                {/* Social Links */}
                
                
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial State */}
        {!selectedHobbyData && (
          <div className="text-center text-purple-300/80">
            Select a skill to view your quest log
          </div>
        )}
      </main>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 
                     bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                     blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 
                     bg-gradient-to-tr from-blue-500/20 to-purple-500/20 
                     blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
};

export default HobbiesPage;