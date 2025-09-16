import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,

  initializeTheme: () => {
    // Detect system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    set({ isDark: systemPrefersDark });
    
    // Apply theme to document
    if (systemPrefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      set({ isDark: e.matches });
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup function would be needed in a real app
    return () => mediaQuery.removeEventListener('change', handleChange);
  },
}));