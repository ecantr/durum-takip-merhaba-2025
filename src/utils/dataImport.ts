
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
      category: "Ürün Geliştirme",
      subProjects: [
        {
          name: "Faz1",
          year: 2025,
          startQuarter: "Q1",
          endQuarter: "Q1",
          responsible: "Dilruba Şentürk",
          completion: 50,
          category: "Ürün Geliştirme"
        },
        {
          name: "Faz2 (E-Şube Entegrasyonu)",
          year: 2025,
          startQuarter: "Q1",
          endQuarter: "Q2",
          responsible: "Alp Demirezen",
          completion: 0,
          category: "Ürün Geliştirme"
        },
        {
          name: "Faz3 (3rd Part Entegrasyonları)",
          year: 2025,
          startQuarter: "Q2",
          endQuarter: "Q2",
          responsible: "Ürün Geliştirme",
          completion: 0,
          category: "Ürün Geliştirme"
        }
      ]
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
      category: "Veri Ambarı",
      subProjects: [
        {
          name: "Analytics Altyapısı",
          year: 2025,
          startQuarter: "Q1",
          endQuarter: "Q2",
          responsible: "Alp Demirezen",
          completion: 30,
          category: "Veri Ambarı"
        },
        {
          name: "3rd party entegrasyonları",
          year: 2025,
          startQuarter: "Q2",
          endQuarter: "Q2",
          responsible: "Emre Can Tuncer",
          completion: 0,
          category: "Veri Ambarı"
        }
      ]
    },
    {
      name: "CRM",
      year: 2024,
      startQuarter: "Q3",
      endQuarter: "Q4",
      responsible: "Dilruba Şentürk - Alp Demirezen",
      completion: 75,
      category: "CRM",
      subProjects: [
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
          name: "CRM Faz3",
          year: 2025,
          startQuarter: "Q3",
          endQuarter: "Q4",
          responsible: "Dilruba Şentürk - Alp Demirezen",
          completion: 0,
          category: "CRM"
        }
      ]
    },
    {
      name: "ERP F&O",
      year: 2025,
      startQuarter: "Q1",
      endQuarter: "Q4",
      responsible: "Emre Can Tuncer",
      completion: 85,
      category: "ERP",
      subProjects: [
        {
          name: "ERP F&O Faz1",
          year: 2025,
          startQuarter: "Q1",
          endQuarter: "Q2",
          responsible: "Emre Can Tuncer",
          completion: 85,
          category: "ERP"
        },
        {
          name: "ERP F&O Faz2",
          year: 2025,
          startQuarter: "Q3",
          endQuarter: "Q4",
          responsible: "Emre Can Tuncer",
          completion: 0,
          category: "ERP"
        }
      ]
    },
    {
      name: "ERP HRM",
      year: 2025,
      startQuarter: "Q2",
      endQuarter: "Q4",
      responsible: "Emre Can Tuncer",
      completion: 70,
      category: "ERP",
      subProjects: [
        {
          name: "ERP HRM Faz2",
          year: 2025,
          startQuarter: "Q2",
          endQuarter: "Q4",
          responsible: "Emre Can Tuncer",
          completion: 70,
          category: "ERP"
        }
      ]
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
      category: "Platform",
      subProjects: [
        {
          name: "Faz Geliştirmeleri",
          year: 2025,
          startQuarter: "Q1",
          endQuarter: "Q2",
          responsible: "Merve Nur Öztürk",
          completion: 100,
          category: "Platform"
        },
        {
          name: "Faz Dışı Geliştirmeler",
          year: 2025,
          startQuarter: "Q3",
          endQuarter: "Q4",
          responsible: "Merve Nur Öztürk",
          completion: 100,
          category: "Platform"
        }
      ]
    }
  ];

  const result: Project[] = [];

  roadmapData.forEach((item, index) => {
    const getStatus = (completion: number): 'not-started' | 'in-progress' | 'completed' | 'delayed' => {
      if (completion === 0) return 'not-started';
      if (completion === 100) return 'completed';
      if (completion > 0 && completion < 100) return 'in-progress';
      return 'delayed';
    };

    const mainProject: Project = {
      id: (index + 1).toString(),
      name: item.name,
      startQuarter: item.startQuarter,
      endQuarter: item.endQuarter,
      year: item.year,
      completionPercentage: item.completion,
      category: item.category,
      responsible: item.responsible,
      status: getStatus(item.completion)
    };

    // Alt projeleri ekle
    if (item.subProjects) {
      mainProject.subProjects = item.subProjects.map((subItem, subIndex) => ({
        id: `${index + 1}-${subIndex + 1}`,
        name: subItem.name,
        startQuarter: subItem.startQuarter,
        endQuarter: subItem.endQuarter,
        year: subItem.year,
        completionPercentage: subItem.completion,
        category: subItem.category,
        responsible: subItem.responsible,
        status: getStatus(subItem.completion),
        isSubProject: true,
        parentId: mainProject.id
      }));
    }

    result.push(mainProject);
  });

  return result;
};
