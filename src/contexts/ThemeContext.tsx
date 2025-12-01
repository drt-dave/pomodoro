import { createContext, useContext, useState, useEffect, use  } from "react";
import type { ReactNode } from "react";

// Define the theme type (only 'light' or 'dark')
type Theme = 'light' | 'dark';

// Define what the context will provide
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the  context (initially undefined)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//Props for the Provider component
interface ThemeProviderProps {
  children: ReactNode;
}

// Provider component that wraps your app
export function ThemeProvider({children}: ThemeProviderProps)  {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => { 
	// Chack if there's a saved theme in localStorage
	const savedTheme = localStorage.getItem('pomodoro-theme') as Theme;
	if (savedTheme) {
	  return savedTheme;
	}

	// If no saved theme, check system preference
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	  return 'dark';
	}

	// Default to light
	return 'light';
  });

  // Apply theme to document and save to localStorage whenever it changes
  useEffect(() => {
  	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('pomodoro-theme', theme);
  }, [ theme ]);

  // Function to toggle between 

}
