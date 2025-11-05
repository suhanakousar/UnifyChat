import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaComments, FaLanguage, FaBolt, FaCheckCircle } from "react-icons/fa";

const Service = forwardRef((props, ref) => {
  const services = [
    {
      id: "translate",
      icon: FaLanguage,
      title: "140+ Languages",
      subtitle: "Instant Translation",
      description: "Break down language barriers with support for over 140 languages. Chat naturally while our AI handles the translation in real-time.",
      features: ["Real-time translation", "Context-aware", "Native accuracy"],
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      iconBg: "bg-indigo-500",
    },
    {
      id: "realtime",
      icon: FaBolt,
      title: "Lightning Fast",
      subtitle: "Real-Time Speed",
      description: "Experience conversations without delays. Our Azure-powered infrastructure ensures messages translate in milliseconds, not seconds.",
      features: ["&lt; 100ms latency", "WebSocket powered", "Always reliable"],
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      iconBg: "bg-cyan-500",
    },
    {
      id: "global",
      icon: FaGlobe,
      title: "Global Reach",
      subtitle: "Connect Worldwide",
      description: "Join chat rooms with people from around the world. Everyone sees messages in their own language automatically.",
      features: ["Auto-detection", "Smart routing", "Secure encryption"],
      gradient: "from-pink-500 via-rose-500 to-red-500",
      iconBg: "bg-pink-500",
    },
  ];

  return (
    <div ref={ref} id="services" className="relative py-20 bg-neutral-50 dark:bg-slate-900 transition-colors overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 dark:bg-accent-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-primary-200 dark:border-primary-800 shadow-sm">
            <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">Our Services</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
              communicate globally
            </span>
          </h2>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            Powerful AI-driven services designed for seamless cross-language communication
          </p>
        </div>

        {/* Services Grid - Unique Bento Box Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300 overflow-hidden">
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Floating Icon */}
                <div className="relative z-10 space-y-6">
                  <div className={`inline-flex p-4 ${service.iconBg} dark:${service.iconBg}/80 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="text-3xl text-white" />
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {service.subtitle}
                    </p>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <FaCheckCircle className="text-success-600 dark:text-success-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Hover Indicator */}
                  <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`h-1 w-full bg-gradient-to-r ${service.gradient} rounded-full`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col md:flex-row items-center gap-4 p-8 bg-white dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-lg">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Ready to connect with the world?
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Start chatting in any language, instantly
              </p>
            </div>
            <Link
              to="/Chat"
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-primary-500/30 whitespace-nowrap"
            >
              Start Chatting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

Service.displayName = 'Service';

export default Service;
