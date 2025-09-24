import { useState } from 'react';
import { ChevronUp, ChevronDown, Bot, MessageSquare, Zap, Sparkles } from 'lucide-react';

const ChatSelector = ({ activeChatbot, setActiveChatbot, chatbotConfigs = {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getIconComponent = (icon) => {
    const iconMap = {
      '📰': MessageSquare,
      '🤝': Bot,
      '🎨': Sparkles,
      '💻': Zap
    };
    const IconComponent = iconMap[icon] || Bot;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="bg-silver-black-800/50 backdrop-blur-lg rounded-2xl border border-silver-black-700">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-silver-black-700/50 transition-colors rounded-t-2xl"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span>AI Assistants</span>
        </h2>
        <button className="text-silver-black-400 hover:text-white transition-colors">
          {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {Object.entries(chatbotConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveChatbot(key)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 group ${
                activeChatbot === key
                  ? `bg-gradient-to-r ${config.color} text-white shadow-lg transform scale-[1.02]`
                  : 'bg-silver-black-700/50 hover:bg-silver-black-700 text-silver-black-200 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    activeChatbot === key
                      ? 'bg-white/20'
                      : 'bg-silver-black-600 group-hover:bg-silver-black-500'
                  }`}
                >
                  {getIconComponent(config.icon)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{config.name}</div>
                  <div className="text-xs opacity-80 mt-1">{config.description}</div>
                </div>
                {activeChatbot === key && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatSelector;
