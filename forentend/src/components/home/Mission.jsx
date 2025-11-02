import React from "react";
import { mission } from "../../assets";
import { FaGlobeAmericas, FaUsers, FaHeadset } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const Mission = () => {
  const { theme } = useTheme();

  const stats = [
    {
      id: "languages",
      icon: FaGlobeAmericas,
      title: "140+",
      subtitle: "Supported Languages",
      description: "Covering 95% of the world's population",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      iconBg: "bg-primary-500",
    },
    {
      id: "users",
      icon: FaUsers,
      title: "10K+",
      subtitle: "Happy Users",
      description: "And growing every day",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      iconBg: "bg-accent-500",
    },
    {
      id: "support",
      icon: FaHeadset,
      title: "24/7",
      subtitle: "Support",
      description: "Always here to help you",
      gradient: "from-pink-500 via-rose-500 to-red-500",
      iconBg: "bg-aurora-500",
    },
  ];

  return (
    <div className={`relative py-32 overflow-hidden ${theme === 'dark' ? 'bg-neutral-950' : 'bg-white'}`}>
      {/* Background Image with advanced overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
        style={{ backgroundImage: `url(${mission})` }}
      >
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-neutral-950/95 via-neutral-950/85 to-neutral-900/90' : 'bg-gradient-to-br from-gray-900/80 via-gray-700/70 to-gray-900/80 opacity-95'}`}></div>
        <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-neutral-950 via-transparent to-transparent' : 'from-white/90 via-transparent to-transparent'}`}></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-8 animate-slide-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass-dark rounded-full border border-primary-500/30">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">Our Mission</span>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-display font-bold leading-[1.1]">
                A World Without
                <br />
                <span className="text-gradient">Language Barriers</span>
              </h2>

              <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
            </div>

            <p className={`text-xl leading-relaxed max-w-2xl ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'}`}>
              By combining cutting-edge AI with secure, seamless access, we bring people together—breaking down
              linguistic divides and building a more <span className="text-primary-400 font-semibold">connected world</span>.
            </p>
            
          </div>

          {/* Right Stats Grid */}
          <div className="grid grid-cols-1 gap-6 animate-slide-left">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300 overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-start space-x-4">
                    <div className={`w-14 h-14 ${stat.iconBg} dark:${stat.iconBg}/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <stat.icon className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400 mb-2">{stat.title}</div>
                      <div className={`font-medium ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-800'}`}>{stat.subtitle}</div>
                      <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-600'}`}>{stat.description}</div>
                    </div>
                  </div>
                  
                  {/* Hover Indicator */}
                  <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient} rounded-full`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
