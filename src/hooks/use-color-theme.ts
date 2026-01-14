import { useEffect, useState } from 'react';

export type ColorTheme = 'zinc' | 'slate' | 'stone' | 'gray' | 'neutral' | 'red' | 'rose' | 'orange' | 'green' | 'blue' | 'yellow' | 'violet';

const COLOR_THEME_KEY = 'color-theme';

export function useColorTheme() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(COLOR_THEME_KEY) as ColorTheme) || 'zinc';
    }
    return 'zinc';
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove(
      'theme-zinc',
      'theme-slate',
      'theme-stone',
      'theme-gray',
      'theme-neutral',
      'theme-red',
      'theme-rose',
      'theme-orange',
      'theme-green',
      'theme-blue',
      'theme-yellow',
      'theme-violet'
    );

    // Add the selected theme class
    root.classList.add(`theme-${colorTheme}`);

    // Save to localStorage
    localStorage.setItem(COLOR_THEME_KEY, colorTheme);
  }, [colorTheme]);

  return { colorTheme, setColorTheme };
}
