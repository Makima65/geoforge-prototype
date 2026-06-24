import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    return localStorage.getItem('theme') || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('theme') || 'system';
    if (stored === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return stored;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (nextTheme) => {
      root.classList.remove('light', 'dark');
      root.classList.add(nextTheme);
      root.style.colorScheme = nextTheme;
    };

    const updateResolvedTheme = () => {
      const nextResolved = theme === 'system'
        ? (mediaQuery.matches ? 'dark' : 'light')
        : theme;

      setResolvedTheme(nextResolved);
      applyTheme(nextResolved);
    };

    updateResolvedTheme();
    localStorage.setItem('theme', theme);

    const onSystemChange = () => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onSystemChange);
    } else {
      mediaQuery.addListener(onSystemChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', onSystemChange);
      } else {
        mediaQuery.removeListener(onSystemChange);
      }
    };
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
