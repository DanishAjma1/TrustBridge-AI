import { useEffect } from 'react';

type Icons = {
  online: {
    light: string;
    dark: string;
  };
  offline: {
    light: string;
    dark: string;
  };
};

export const useDynamicFavicon = () => {
  useEffect(() => {
    const faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    
    // Configuration for icons
    // Assuming these files exist in public folder
    const icons: Icons = {
      online: {
        light: '/tab-favicon-96x96.png', // Normal colored logo for light theme
        dark: '/tab-favicon-96x96.png',  // Normal colored logo for dark theme (can be same or different)
      },
      offline: {
        light: '/tab-favicon-96x96-monochrome.png', // Monochrome/Black for offline light theme
        dark: '/tab-favicon-96x96-monochrome.png',  // Monochrome/White for offline dark theme
      }
    };

    const updateFavicon = () => {
      if (!faviconLink) return;

      const isOnline = navigator.onLine;
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Determine the correct icon path
      let newIconPath: string;

      if (!isOnline) {
        // Offline state - use monochrome/warning icon
        newIconPath = isDarkMode ? icons.offline.dark : icons.offline.light;
        document.title = 'Offline - TrustBridge AI'; // Optional: Update title
      } else {
        // Online state - use brand icon
        newIconPath = isDarkMode ? icons.online.dark : icons.online.light;
        if (document.title.startsWith('Offline - ')) {
           document.title = document.title.replace('Offline - ', ''); // Restore title
        }
      }

      faviconLink.href = newIconPath;
    };

    // Initial check
    updateFavicon();

    // Listeners for network status
    window.addEventListener('online', updateFavicon);
    window.addEventListener('offline', updateFavicon);

    // Listener for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', updateFavicon);
    } else {
        // Fallback for older browsers
        mediaQuery.addListener(updateFavicon);
    }

    return () => {
      window.removeEventListener('online', updateFavicon);
      window.removeEventListener('offline', updateFavicon);
      if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', updateFavicon);
      } else {
          mediaQuery.removeListener(updateFavicon);
      }
    };
  }, []);
};
