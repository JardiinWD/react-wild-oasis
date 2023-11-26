// Importing the createContext and useContext functions from React to create and consume the dark mode context
import { createContext, useContext, useEffect } from "react";
// Importing a custom hook for managing state in local storage
import { useLocalStorageState } from '../hooks/useLocalStorageState';


// Creating a context to provide dark mode state and toggle function to its descendants
const DarkModeContext = createContext();
// DarkModeProvider component to wrap its children with the dark mode context
function DarkModeProvider({ children }) {
    // Using the custom hook to manage the dark mode state in local storage
    const [isDarkMode, setIsDarkMode] = useLocalStorageState(false, 'isDarkMode');

    // Effect to update the document's class based on the dark mode state
    useEffect(() => {
        // Add or remove class based on dark mode state
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
        } else {
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    // Function to toggle the dark mode state
    function toggleDarkMode() {
        // Set the dark mode state to its opposite value
        setIsDarkMode(isDark => !isDark);
    }

    // Providing the dark mode state and toggle function to the context's descendants
    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

// Custom hook for consuming the dark mode context
function useDarkMode() {
    // Using the useContext hook to access the dark mode context
    const context = useContext(DarkModeContext);
    // Throw an error if the hook is used outside of the DarkModeProvider
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    // Return the dark mode context
    return context;
}

// Exporting the DarkModeContext and DarkModeProvider to use in other parts of the application
export { DarkModeProvider, useDarkMode };
