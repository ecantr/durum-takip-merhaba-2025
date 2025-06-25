
export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  minPercentage: number;
  maxPercentage: number;
  color: string;
  bgColor: string;
}

export const PROJECT_PHASES: ProjectPhase[] = [
  {
    id: 'planning',
    name: 'Başlangıç ve Planlama',
    description: 'Proje kapsamı, gereksinim analizi, kaynak planlama',
    minPercentage: 0,
    maxPercentage: 15,
    color: 'text-gray-700',
    bgColor: 'bg-gray-500'
  },
  {
    id: 'design',
    name: 'Tasarım ve Analiz',
    description: 'Teknik tasarım, mimari planlama, prototip hazırlama',
    minPercentage: 16,
    maxPercentage: 30,
    color: 'text-blue-700',
    bgColor: 'bg-blue-500'
  },
  {
    id: 'development',
    name: 'Geliştirme ve Uygulama',
    description: 'Ana geliştirme süreci, kodlama, entegrasyonlar',
    minPercentage: 31,
    maxPercentage: 75,
    color: 'text-orange-700',
    bgColor: 'bg-orange-500'
  },
  {
    id: 'testing',
    name: 'Test ve Doğrulama',
    description: 'Sistem testleri, kullanıcı kabul testleri, hata düzeltme',
    minPercentage: 76,
    maxPercentage: 90,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-500'
  },
  {
    id: 'delivery',
    name: 'Teslim ve Kapanış',
    description: 'Son kontroller, dokümantasyon, kullanıcı eğitimi',
    minPercentage: 91,
    maxPercentage: 100,
    color: 'text-green-700',
    bgColor: 'bg-green-500'
  }
];

export const getProjectPhase = (completionPercentage: number): ProjectPhase => {
  return PROJECT_PHASES.find(phase => 
    completionPercentage >= phase.minPercentage && completionPercentage <= phase.maxPercentage
  ) || PROJECT_PHASES[0];
};

export const getPhaseColor = (completionPercentage: number): string => {
  const phase = getProjectPhase(completionPercentage);
  return phase.bgColor;
};

export const getPhaseInfo = (completionPercentage: number): { name: string; description: string } => {
  const phase = getProjectPhase(completionPercentage);
  return {
    name: phase.name,
    description: phase.description
  };
};
