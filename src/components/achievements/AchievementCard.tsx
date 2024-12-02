import { ExternalLink } from 'lucide-react';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link?: string;
  date?: string;
  issuer?: string;
  color?: "blue" | "purple" | "green";
}

const AchievementCard: React.FC<AchievementCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  link, 
  date, 
  issuer,
  color = "blue" 
}) => {
  const colorVariants = {
    blue: "from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 border-blue-500/20 hover:border-blue-500/40",
    purple: "from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 border-purple-500/20 hover:border-purple-500/40",
    green: "from-emerald-500/10 to-emerald-500/5 hover:from-emerald-500/20 hover:to-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40"
  };

  return (
    <div className={`relative p-6 rounded-xl border bg-gradient-to-br transition-all duration-300 group 
                    ${colorVariants[color]} hover:transform hover:scale-[1.02]`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-2 rounded-lg bg-${color}-500/10 shrink-0`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold text-${color}-400 mb-2 truncate`}>{title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {issuer && <span className="truncate">{issuer}</span>}
            {date && <span className="shrink-0">{date}</span>}
          </div>
        </div>

        {/* External Link */}
        {link && (
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
          </a>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

export default AchievementCard;