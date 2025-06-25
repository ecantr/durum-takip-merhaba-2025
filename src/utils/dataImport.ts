
import { Project } from '@/pages/Roadmap';

// Verilen veriyi Project formatına dönüştürür
export const convertRoadmapData = (): Project[] => {
  const roadmapData = [
    {
      name: "Tezgahüstü Ödünç Sistemi",
      year: 2025,
      startQuarter: "Q1",
      endQuarter: "Q3",
      responsible: "Merve Nur Öztürk - Emre Can Tuncer",
      completion: 75,
      category: "Sistem Geliştirme"
    },
    {
      name: "Yabancı Hisse",
      year: 2025,
      startQuarter: "Q1",
      endQuarter: "Q2",
      responsible: "Dilruba Şentürk- Alp Demirezen - Ürün Geliştirme",
      completion: 15,
      category: "Ürün Geliştirme"
    },
    {
      name: "AI",
      year: 2025,
      startQuarter: "Q3",
      endQuarter: "Q4",
      responsible: "Alp Demirezen",
      completion: 0,
      category: "Yapay Zeka"
    },
    {
      name: "Açık Servisler Platformu",
      year: 2025,
      startQuarter: "Q2",
      endQuarter: "Q3",
      responsible: "Dilruba Şentürk - Merve Nur Öztürk",
      completion: 0,
      category: "Platform"
    },
    {
      name: "DWH",
      year: 2024,
      startQuarter: "Q3",
      endQuarter: "Q2",
      responsible: "Alp Demirezen-Emre Can Tuncer",
      completion: 70,
      category: "Veri Ambarı"
    },
    {
      name: "CRM Faz1",
      year: 2024,
      startQuarter: "Q3",
      endQuarter: "Q4",
      responsible: "Dilruba Şentürk - Alp Demirezen",
      completion: 100,
      category: "CRM"
    },
    {
      name: "CRM Faz2",
      year: 2025,
      startQuarter: "Q1",
      endQuarter: "Q2",
      responsible: "Dilruba Şentürk - Alp Demirezen",
      completion: 50,
      category: "CRM"
    },
    {
      name: "ERP F&O Faz1",
      year: 2025,
      startQuarter: "Q1",
      endQuarter: "Q4",
      responsible: "Emre Can Tuncer",
      completion: 85,
      category: "ERP"
    },
    {
      name: "ERP HRM Faz2",
      year: 2025,
      startQuarter: "Q2",
      endQuarter: "Q4",
      responsible: "Emre Can Tuncer",
      completion: 70,
      category: "ERP"
    },
    {
      name: "Osmanlı Şifre",
      year: 2025,
      startQuarter: "Q1",
      endQuarter: "Q4",
      responsible: "Merve Nur Öztürk Ürün Geliştirme",
      completion: 90,
      category: "Güvenlik"
    },
    {
      name: "OsmanlıTrader Web/Mobil",
      year: 2025,
      startQuarter: "Q1",
      endQuarter: "Q4",
      responsible: "Ürün Geliştirme",
      completion: 100,
      category: "Trading"
    },
    {
      name: "Optimus Faz Geliştirme",
      year: 2025,
      startQuarter: "Q1",
      endQuarter: "Q4",
      responsible: "Merve Nur Öztürk",
      completion: 100,
      category: "Platform"
    }
  ];

  return roadmapData.map((item, index) => {
    // Çeyrek dönemleri tarihlere çevir
    const getDateFromQuarter = (quarter: string, year: number, isEnd: boolean = false) => {
      const quarterMap: { [key: string]: { month: number, day: number } } = {
        'Q1': { month: isEnd ? 2 : 0, day: isEnd ? 28 : 1 },  // Ocak-Mart
        'Q2': { month: isEnd ? 5 : 3, day: isEnd ? 30 : 1 },  // Nisan-Haziran
        'Q3': { month: isEnd ? 8 : 6, day: isEnd ? 30 : 1 },  // Temmuz-Eylül
        'Q4': { month: isEnd ? 11 : 9, day: isEnd ? 31 : 1 }  // Ekim-Aralık
      };
      
      const q = quarterMap[quarter] || quarterMap['Q1'];
      return new Date(year, q.month, q.day);
    };

    const getStatus = (completion: number): 'not-started' | 'in-progress' | 'completed' | 'delayed' => {
      if (completion === 0) return 'not-started';
      if (completion === 100) return 'completed';
      if (completion > 0 && completion < 100) return 'in-progress';
      return 'delayed';
    };

    return {
      id: (index + 1).toString(),
      name: item.name,
      startDate: getDateFromQuarter(item.startQuarter, item.year),
      endDate: getDateFromQuarter(item.endQuarter, item.year, true),
      completionPercentage: item.completion,
      category: item.category,
      responsible: item.responsible,
      status: getStatus(item.completion)
    };
  });
};
