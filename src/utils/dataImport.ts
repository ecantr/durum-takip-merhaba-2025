
import { Project } from '@/pages/Roadmap';

// Verilen veriyi Project formatına dönüştürür
export const convertRoadmapData = (): Project[] => {
  const roadmapData = [
    {
      name: "Tezgahüstü Ödünç Sistemi",
      year: 2025,
      plannedStartQuarter: "Q1",
      plannedEndQuarter: "Q3",
      actualStartQuarter: "Q1",
      actualEndQuarter: "Q3",
      responsible: "Merve Nur Öztürk - Emre Can Tuncer",
      completion: 75,
      category: "Sistem Geliştirme"
    },
    {
      name: "Yabancı Hisse",
      year: 2025,
      plannedStartQuarter: "Q1",
      plannedEndQuarter: "Q2",
      actualStartQuarter: "Q1",
      actualEndQuarter: "Q2",
      responsible: "Dilruba Şentürk- Alp Demirezen - Ürün Geliştirme",
      completion: 15,
      category: "Ürün Geliştirme",
      subProjects: [
        {
          name: "Faz1",
          year: 2025,
          plannedStartQuarter: "Q1",
          plannedEndQuarter: "Q1",
          actualStartQuarter: "Q1",
          actualEndQuarter: "Q1",
          responsible: "Dilruba Şentürk",
          completion: 50,
          category: "Ürün Geliştirme"
        },
        {
          name: "Faz2 (E-Şube Entegrasyonu)",
          year: 2025,
          plannedStartQuarter: "Q1",
          plannedEndQuarter: "Q2",
          actualStartQuarter: "Q1",
          actualEndQuarter: "Q2",
          responsible: "Alp Demirezen",
          completion: 0,
          category: "Ürün Geliştirme"
        }
      ]
    },
    {
      name: "AI",
      year: 2025,
      plannedStartQuarter: "Q3",
      plannedEndQuarter: "Q4",
      actualStartQuarter: "Q3",
      actualEndQuarter: "Q4",
      responsible: "Alp Demirezen",
      completion: 0,
      category: "Yapay Zeka"
    },
    {
      name: "Açık Servisler Platformu",
      year: 2025,
      plannedStartQuarter: "Q2",
      plannedEndQuarter: "Q3",
      actualStartQuarter: "Q2",
      actualEndQuarter: "Q3",
      responsible: "Dilruba Şentürk - Merve Nur Öztürk",
      completion: 0,
      category: "Platform"
    },
    {
      name: "DWH",
      year: 2025,
      plannedStartQuarter: "Q1",
      plannedEndQuarter: "Q2",
      actualStartQuarter: "Q1",
      actualEndQuarter: "Q2",
      responsible: "Alp Demirezen-Emre Can Tuncer",
      completion: 70,
      category: "Veri Ambarı",
      subProjects: [
        {
          name: "Analytics Altyapısı",
          year: 2025,
          plannedStartQuarter: "Q1",
          plannedEndQuarter: "Q2",
          actualStartQuarter: "Q1",
          actualEndQuarter: "Q2",
          responsible: "Alp Demirezen",
          completion: 30,
          category: "Veri Ambarı"
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
      plannedStartQuarter: item.plannedStartQuarter,
      plannedEndQuarter: item.plannedEndQuarter,
      actualStartQuarter: item.actualStartQuarter,
      actualEndQuarter: item.actualEndQuarter,
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
        plannedStartQuarter: subItem.plannedStartQuarter,
        plannedEndQuarter: subItem.plannedEndQuarter,
        actualStartQuarter: subItem.actualStartQuarter,
        actualEndQuarter: subItem.actualEndQuarter,
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
