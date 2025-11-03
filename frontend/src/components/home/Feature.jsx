import React, { useState } from "react";
import { FaMicrophone, FaFileAlt, FaRobot, FaArrowRight, FaPlay } from "react-icons/fa";

const Feature = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: "speech",
      icon: FaMicrophone,
      title: "Voice-to-Text & Text-to-Speech",
      description: "Transform conversations with our in-house powerful speech capabilities. Convert text to natural-sounding speech and vice versa for seamless, engaging cross-language communication.",
      stats: [
        { label: "Languages", value: "75+" },
        { label: "Accuracy", value: "99%" },
        { label: "Response", value: "<1s" },
      ],
      badge: "Powered",
      color: "primary",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
    },
    {
      id: "files",
      icon: FaFileAlt,
      title: "File Sharing",
      description: "Share documents, images, and media directly in your chat rooms with built-in language annotation. File sharing is seamless, secure, and efficient for all your cross-cultural collaborative needs.",
      stats: [
        { label: "Max Size", value: "100MB" },
        { label: "File Types", value: "All" },
        { label: "Security", value: "E2E" },
      ],
      badge: "Secure",
      color: "accent",
      bgGradient: "from-pink-500/10 to-rose-500/10",
    },
    {
      id: "summarize",
      icon: FaRobot,
      title: "Chat Summarization",
      description: "Quickly summarize multilingual conversations within any date range. Stay updated without reading every message and get key takeaways in your preferred language.",
      stats: [
        { label: "Speed", value: "Instant" },
        { label: "Accuracy", value: "95%" },
        { label: "Support", value: "Multilingual" },
      ],
      badge: "Coming Soon",
      color: "success",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
  ];

  const colorMap = {
    primary: {
      bg: "bg-indigo-500",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-500",
      gradient: "from-indigo-600 to-purple-600",
    },
    accent: {
      bg: "bg-pink-500",
      text: "text-pink-600 dark:text-pink-400",
      border: "border-pink-500",
      gradient: "from-pink-600 to-rose-600",
    },
    success: {
      bg: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500",
      gradient: "from-emerald-600 to-teal-600",
    },
  };

  return (
    <div className="relative py-20 bg-white dark:bg-slate-900 transition-colors overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 dark:bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-100 dark:bg-slate-800 rounded-full border border-primary-200 dark:border-primary-800 shadow-sm">
            <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
            Everything you need for
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
              seamless communication
            </span>
          </h2>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            AI-powered features designed to break down language barriers
          </p>
        </div>

        {/* Interactive Feature Tabs */}
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-col md:flex-row gap-3 mb-8 p-2 bg-neutral-100 dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
                  activeFeature === index
                    ? `bg-white dark:bg-slate-700 shadow-lg ${colorMap[feature.color].text} border-2 ${colorMap[feature.color].border} dark:border-opacity-50`
                    : 'bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-white/50 dark:hover:bg-slate-700/50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${activeFeature === index ? colorMap[feature.color].bg : 'bg-neutral-300 dark:bg-slate-600'} transition-colors`}>
                    <feature.icon className="text-white text-lg" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold">{feature.title.split(' ')[0]}</p>
                  </div>
                  {activeFeature === index && (
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${colorMap[feature.color].bg} text-white`}>
                      {feature.badge}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Feature Content */}
          <div className="relative">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`transition-all duration-500 ${
                  activeFeature === index ? 'opacity-100 block' : 'opacity-0 hidden'
                }`}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left: Content */}
                  <div className="space-y-6 order-2 md:order-1">
                    <div className="space-y-4">
                      <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {feature.stats.map((stat, idx) => (
                        <div key={idx} className="p-4 bg-neutral-50 dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                          <div className={`text-2xl font-bold ${colorMap[feature.color].text}`}>
                            {stat.value}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className={`group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colorMap[feature.color].gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105`}>
                      <span>Learn More</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Right: Visual */}
                  <div className="order-1 md:order-2">
                    <div className={`relative p-12 bg-gradient-to-br ${feature.bgGradient} dark:${feature.bgGradient.replace('/10', '/20')} rounded-3xl border border-neutral-200 dark:border-neutral-700`}>
                      <div className="relative flex items-center justify-center">
                        {/* Large Icon Display */}
                        <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${colorMap[feature.color].gradient} flex items-center justify-center shadow-2xl animate-float`}>
                          <feature.icon className="text-white text-7xl" />
                        </div>
                        {/* Play Button Overlay for Demo */}
                        {feature.id === 'speech' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                              <FaPlay className="text-primary-600 dark:text-primary-400 ml-1" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Grid - Mini Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-neutral-50 dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300">
            <div className="text-primary-600 dark:text-primary-400 text-3xl mb-3">🔒</div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">End-to-End Encryption</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Your messages are always secure and private</p>
          </div>
          <div className="p-6 bg-neutral-50 dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:border-accent-500 dark:hover:border-accent-400 transition-all duration-300">
            <div className="text-accent-600 dark:text-accent-400 text-3xl mb-3">⚡</div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">Lightning Fast</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Real-time translation with minimal latency</p>
          </div>
          <div className="p-6 bg-neutral-50 dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:border-success-500 dark:hover:border-success-400 transition-all duration-300">
            <div className="text-success-600 dark:text-success-400 text-3xl mb-3">🌍</div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">Global Access</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Available anywhere, anytime, on any device</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
