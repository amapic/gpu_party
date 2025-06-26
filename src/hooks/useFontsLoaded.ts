import { useState, useEffect } from 'react';

export const useFontsLoaded = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if ('fonts' in document) {
      Promise.all([
        document.fonts.load('300 1em Prompt'),
        document.fonts.load('400 1em Prompt'),
        document.fonts.load('500 1em Prompt'),
        document.fonts.load('600 1em Prompt'),
      ]).then(() => {
        setFontsLoaded(true);
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Font Loading
      setFontsLoaded(true);
    }
  }, []);

  return fontsLoaded;
}; 