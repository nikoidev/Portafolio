'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface EditModeContextType {
    isEditMode: boolean;
    setEditMode: (enabled: boolean) => void;
    toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
    const [isEditMode, setIsEditMode] = useState(false);

    const setEditMode = (enabled: boolean) => {
        setIsEditMode(enabled);
    };

    const toggleEditMode = () => {
        setIsEditMode((prev) => !prev);
    };

    return (
        <EditModeContext.Provider value={{ isEditMode, setEditMode, toggleEditMode }}>
            {children}
        </EditModeContext.Provider>
    );
}

export function useEditMode() {
    const context = useContext(EditModeContext);
    if (context === undefined) {
        throw new Error('useEditMode must be used within an EditModeProvider');
    }
    return context;
}

