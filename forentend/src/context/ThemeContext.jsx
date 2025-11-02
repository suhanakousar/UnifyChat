import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  // Smooth transition effect
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--transition-duration', '300ms');
    root.style.setProperty('--transition-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');

    // Add transition class to html and body for smooth color changes
    document.documentElement.classList.add('theme-transition');
    document.body.classList.add('theme-transition');

    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
      document.body.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timeout);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="theme-wrapper">
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </div>
  );
};
