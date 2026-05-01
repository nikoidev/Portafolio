'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Initialize theme from document class (set by script in head)
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
        return 'light';
    });

    // Sync initial state — the inline script in layout.tsx already set the class,
    // this just ensures localStorage matches if somehow they diverge on first render.
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, []);

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement;
        if (newTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', newTheme);
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        // View Transitions API for a smooth circular reveal; CSS fallback already in globals.css
        if (typeof document !== 'undefined' && 'startViewTransition' in document) {
            (document as any).startViewTransition(() => applyTheme(next));
        } else {
            applyTheme(next);
        }
    };

    const setTheme = (newTheme: Theme) => {
        applyTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

