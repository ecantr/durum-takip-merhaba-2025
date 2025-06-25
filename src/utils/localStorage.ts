
import { Project } from '@/pages/Roadmap';

const STORAGE_KEY = 'roadmap-projects';

export const saveProjectsToStorage = (projects: Project[]): void => {
  try {
    const dataToSave = JSON.stringify(projects);
    localStorage.setItem(STORAGE_KEY, dataToSave);
    console.log('Projeler localStorage\'a kaydedildi:', projects.length, 'proje');
    console.log('Kaydedilen veri boyutu:', dataToSave.length, 'karakter');
  } catch (error) {
    console.error('Projeler kaydedilemedi:', error);
  }
};

export const loadProjectsFromStorage = (): Project[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('localStorage\'dan okuma yapılıyor...');
    console.log('Okunan ham veri:', stored ? `${stored.length} karakter` : 'null');
    
    if (stored) {
      const projects = JSON.parse(stored);
      console.log('Yüklenen projeler:', projects.length, 'proje');
      return projects;
    } else {
      console.log('localStorage\'da proje verisi bulunamadı');
    }
  } catch (error) {
    console.error('Projeler yüklenemedi:', error);
  }
  return [];
};

export const clearProjectsFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('localStorage temizlendi');
  } catch (error) {
    console.error('Projeler temizlenemedi:', error);
  }
};

// Debug amaçlı - localStorage durumunu kontrol et
export const checkStorageStatus = (): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('=== localStorage Durum Kontrolü ===');
    console.log('Key:', STORAGE_KEY);
    console.log('Veri var mı:', stored !== null);
    console.log('Veri boyutu:', stored ? stored.length : 0);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Toplam proje sayısı:', parsed.length);
    }
    console.log('=====================================');
  } catch (error) {
    console.error('localStorage kontrol hatası:', error);
  }
};
