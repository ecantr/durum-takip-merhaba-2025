
import { Project } from '@/pages/Roadmap';

const STORAGE_KEY = 'roadmap-projects';

export const saveProjectsToStorage = (projects: Project[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Projeler kaydedilemedi:', error);
  }
};

export const loadProjectsFromStorage = (): Project[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Projeler yüklenemedi:', error);
  }
  return [];
};

export const clearProjectsFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Projeler temizlenemedi:', error);
  }
};
