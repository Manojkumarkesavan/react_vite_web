import { createContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Optional: Persist dark mode preference
  useEffect(() => {
    const storedPreference = localStorage.getItem("darkMode");
    if (storedPreference) {
      setDarkMode(storedPreference === "true");
    }
  }, []);

  useEffect(() => {
    // Update the class on the root element
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Optional: Save preference to localStorage
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
