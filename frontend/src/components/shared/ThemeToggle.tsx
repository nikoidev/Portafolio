'use client';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative"
            aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
            {theme === 'light' ? (
                <Sun className="h-5 w-5 transition-all" />
            ) : (
                <Moon className="h-5 w-5 transition-all" />
            )}
        </Button>
    );
}

