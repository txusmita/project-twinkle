import { useState, useEffect, useCallback } from 'react';
import { Initiative, InitiativeFormData, calculateICEScore } from '@/types/initiative';

const STORAGE_KEY = 'initiatives';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useInitiatives = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setInitiatives(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load initiatives:', error);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever initiatives change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initiatives));
    }
  }, [initiatives, isLoading]);

  const addInitiative = useCallback((data: InitiativeFormData): Initiative => {
    const now = new Date().toISOString();
    const newInitiative: Initiative = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    setInitiatives(prev => [...prev, newInitiative]);
    return newInitiative;
  }, []);

  const updateInitiative = useCallback((id: string, data: Partial<InitiativeFormData>): void => {
    setInitiatives(prev =>
      prev.map(init =>
        init.id === id
          ? { ...init, ...data, updatedAt: new Date().toISOString() }
          : init
      )
    );
  }, []);

  const deleteInitiative = useCallback((id: string): void => {
    setInitiatives(prev => prev.filter(init => init.id !== id));
  }, []);

  const getInitiativeById = useCallback((id: string): Initiative | undefined => {
    return initiatives.find(init => init.id === id);
  }, [initiatives]);

  // Sort by ICE score (highest first)
  const sortedInitiatives = [...initiatives].sort((a, b) => {
    return calculateICEScore(b) - calculateICEScore(a);
  });

  return {
    initiatives: sortedInitiatives,
    isLoading,
    addInitiative,
    updateInitiative,
    deleteInitiative,
    getInitiativeById,
  };
};
