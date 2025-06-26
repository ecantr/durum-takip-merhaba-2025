import { Project } from '@/services/projectService';

// Sample roadmap data for testing
export const convertRoadmapData = (): Project[] => {
  const roadmapData = [
    {
      name: "Tezgahüstü Ödünç Sistemi",
      year: 2025,
      plannedStartQuarter: "Q1-2025",
      plannedEndQuarter: "Q3-2025",
      actualStartQuarter: "Q1-2025",
      actualEndQuarter: "Q3-2025",
      responsible: "Merve Nur Öztürk - Emre Can Tuncer",
      completion: 75,
      category: "Sistem Geliştirme"
    },
    {
      name: "Yabancı Hisse",
      year: 2025,
      plannedStartQuarter: "2024",
      plannedEndQuarter: "Q2-2025",
      actualStartQuarter: "2024",
      actualEndQuarter: "Q2-2025",
      responsible: "Dilruba Şentürk- Alp Demirezen - Ürün Geliştirme",
      completion: 15,
      category: "Ürün Geliştirme",
      subProjects: [
        {
          name: "Faz1",
          year: 2025,
          plannedStartQuarter: "2024",
          plannedEndQuarter: "Q1-2025",
          actualStartQuarter: "2024",
          actualEndQuarter: "Q1-2025",
          responsible: "Dilruba Şentürk",
          completion: 50,
          category: "Ürün Geliştirme"
        },
        {
          name: "Faz2 (E-Şube Entegrasyonu)",
          year: 2025,
          plannedStartQuarter: "Q1-2025",
          plannedEndQuarter: "Q2-2025",
          actualStartQuarter: "Q1-2025",
          actualEndQuarter: "Q2-2025",
          responsible: "Alp Demirezen",
          completion: 0,
          category: "Ürün Geliştirme"
        }
      ]
    },
    {
      name: "AI",
      year: 2025,
      plannedStartQuarter: "Q3-2025",
      plannedEndQuarter: "Q4-2025",
      actualStartQuarter: "Q3-2025",
      actualEndQuarter: "Q4-2025",
      responsible: "Alp Demirezen",
      completion: 0,
      category: "Yapay Zeka"
    },
    {
      name: "Açık Servisler Platformu",
      year: 2025,
      plannedStartQuarter: "Q2-2025",
      plannedEndQuarter: "Q3-2025",
      actualStartQuarter: "Q2-2025",
      actualEndQuarter: "Q3-2025",
      responsible: "Dilruba Şentürk - Merve Nur Öztürk",
      completion: 0,
      category: "Platform"
    },
    {
      name: "DWH",
      year: 2025,
      plannedStartQuarter: "2024",
      plannedEndQuarter: "Q2-2025",
      actualStartQuarter: "2024",
      actualEndQuarter: "Q2-2025",
      responsible: "Alp Demirezen-Emre Can Tuncer",
      completion: 70,
      category: "Veri Ambarı",
      subProjects: [
        {
          name: "Analytics Altyapısı",
          year: 2025,
          plannedStartQuarter: "2024",
          plannedEndQuarter: "Q2-2025",
          actualStartQuarter: "2024",
          actualEndQuarter: "Q2-2025",
          responsible: "Alp Demirezen",
          completion: 30,
          category: "Veri Ambarı"
        }
      ]
    },
    {
      name: "Mobil Uygulama Geliştirme",
      year: 2025,
      plannedStartQuarter: "Q1-2025",
      plannedEndQuarter: "Q4-2025",
      actualStartQuarter: "Q1-2025",
      actualEndQuarter: "Q4-2025",
      responsible: "Mehmet Yılmaz - Ayşe Kaya",
      completion: 40,
      category: "Mobil Geliştirme"
    },
    {
      name: "API Gateway",
      year: 2025,
      plannedStartQuarter: "Q2-2025",
      plannedEndQuarter: "Q3-2025",
      actualStartQuarter: "Q2-2025",
      actualEndQuarter: "Q3-2025",
      responsible: "Can Özkan",
      completion: 60,
      category: "Altyapı"
    },
    {
      name: "Blockchain Entegrasyonu",
      year: 2025,
      plannedStartQuarter: "Q3-2025",
      plannedEndQuarter: "Q4-2025",
      actualStartQuarter: "Q3-2025",
      actualEndQuarter: "Q4-2025",
      responsible: "Blockchain Ekibi",
      completion: 10,
      category: "Blockchain"
    },
    {
      name: "İnsan Kaynakları Modülü",
      year: 2025,
      plannedStartQuarter: "Q1-2025",
      plannedEndQuarter: "Q2-2025",
      actualStartQuarter: "Q1-2025",
      actualEndQuarter: "Q2-2025",
      responsible: "HR Ekibi",
      completion: 85,
      category: "HR Sistemi"
    },
    {
      name: "Muhasebe Sistemi",
      year: 2025,
      plannedStartQuarter: "2024",
      plannedEndQuarter: "Q3-2025",
      actualStartQuarter: "2024",
      actualEndQuarter: "Q3-2025",
      responsible: "Finans Ekibi",
      completion: 95,
      category: "Finans"
    },
    {
      name: "E-Ticaret Platformu",
      year: 2025,
      plannedStartQuarter: "Q2-2025",
      plannedEndQuarter: "Q4-2025",
      actualStartQuarter: "Q2-2025",
      actualEndQuarter: "Q4-2025",
      responsible: "E-Ticaret Ekibi",
      completion: 25,
      category: "E-Ticaret",
      subProjects: [
        {
          name: "Ödeme Sistemi",
          year: 2025,
          plannedStartQuarter: "Q2-2025",
          plannedEndQuarter: "Q3-2025",
          actualStartQuarter: "Q2-2025",
          actualEndQuarter: "Q3-2025",
          responsible: "Ödeme Ekibi",
          completion: 45,
          category: "E-Ticaret"
        },
        {
          name: "Kargo Entegrasyonu",
          year: 2025,
          plannedStartQuarter: "Q3-2025",
          plannedEndQuarter: "Q4-2025",
          actualStartQuarter: "Q3-2025",
          actualEndQuarter: "Q4-2025",
          responsible: "Lojistik Ekibi",
          completion: 15,
          category: "E-Ticaret"
        }
      ]
    },
    {
      name: "CRM Sistemi",
      year: 2025,
      plannedStartQuarter: "Q1-2025",
      plannedEndQuarter: "Q3-2025",
      actualStartQuarter: "Q1-2025",
      actualEndQuarter: "Q3-2025",
      responsible: "CRM Ekibi",
      completion: 55,
      category: "Müşteri Yönetimi"
    },
    {
      name: "Raporlama Modülü",
      year: 2025,
      plannedStartQuarter: "Q2-2025",
      plannedEndQuarter: "Q4-2025",
      actualStartQuarter: "Q2-2025",
      actualEndQuarter: "Q4-2025",
      responsible: "BI Ekibi",
      completion: 35,
      category: "İş Zekası"
    },
    {
      name: "Güvenlik Altyapısı",
      year: 2025,
      plannedStartQuarter: "2024",
      plannedEndQuarter: "Q1-2025",
      actualStartQuarter: "2024",
      actualEndQuarter: "Q1-2025",
      responsible: "Güvenlik Ekibi",
      completion: 100,
      category: "Güvenlik"
    },
    {
      name: "DevOps Pipeline",
      year: 2025,
      plannedStartQuarter: "Q1-2025",
      plannedEndQuarter: "Q2-2025",
      actualStartQuarter: "Q1-2025",
      actualEndQuarter: "Q2-2025",
      responsible: "DevOps Ekibi",
      completion: 80,
      category: "DevOps"
    },
    {
      name: "IoT Sensör Ağı",
      year: 2025,
      plannedStartQuarter: "Q3-2025",
      plannedEndQuarter: "Q4-2025",
      actualStartQuarter: "Q3-2025",
      actualEndQuarter: "Q4-2025",
      responsible: "IoT Ekibi",
      completion: 5,
      category: "IoT"
    },
    {
      name: "Veri Göçü Projesi",
      year: 2025,
      plannedStartQuarter: "Q1-2025",
      plannedEndQuarter: "Q2-2025",
      actualStartQuarter: "Q1-2025",
      actualEndQuarter: "Q2-2025",
      responsible: "Veri Ekibi",
      completion: 90,
      category: "Veri Yönetimi"
    },
    {
      name: "Chatbot Geliştirme",
      year: 2025,
      plannedStartQuarter: "Q2-2025",
      plannedEndQuarter: "Q3-2025",
      actualStartQuarter: "Q2-2025",
      actualEndQuarter: "Q3-2025",
      responsible: "AI Ekibi",
      completion: 20,
      category: "Yapay Zeka"
    },
    {
      name: "Video Konferans Sistemi",
      year: 2025,
      plannedStartQuarter: "Q1-2025",
      plannedEndQuarter: "Q2-2025",
      actualStartQuarter: "Q1-2025",
      actualEndQuarter: "Q2-2025",
      responsible: "İletişim Ekibi",
      completion: 65,
      category: "İletişim"
    },
    {
      name: "Sosyal Medya Entegrasyonu",
      year: 2025,
      plannedStartQuarter: "Q3-2025",
      plannedEndQuarter: "Q4-2025",
      actualStartQuarter: "Q3-2025",
      actualEndQuarter: "Q4-2025",
      responsible: "Sosyal Medya Ekibi",
      completion: 30,
      category: "Pazarlama"
    },
    {
      name: "Envanter Yönetimi",
      year: 2025,
      plannedStartQuarter: "Q2-2025",
      plannedEndQuarter: "Q3-2025",
      actualStartQuarter: "Q2-2025",
      actualEndQuarter: "Q3-2025",
      responsible: "Operasyon Ekibi",
      completion: 50,
      category: "Operasyon"
    },
    {
      name: "QR Kod Sistemi",
      year: 2025,
      plannedStartQuarter: "Q1-2025",
      plannedEndQuarter: "Q1-2025",
      actualStartQuarter: "Q1-2025",
      actualEndQuarter: "Q1-2025",
      responsible: "QR Ekibi",
      completion: 100,
      category: "Dijital Çözümler"
    },
    {
      name: "Bulut Depolama",
      year: 2025,
      plannedStartQuarter: "Q2-2025",
      plannedEndQuarter: "Q4-2025",
      actualStartQuarter: "Q2-2025",
      actualEndQuarter: "Q4-2025",
      responsible: "Bulut Ekibi",
      completion: 40,
      category: "Altyapı",
      subProjects: [
        {
          name: "Veri Yedekleme",
          year: 2025,
          plannedStartQuarter: "Q2-2025",
          plannedEndQuarter: "Q3-2025",
          actualStartQuarter: "Q2-2025",
          actualEndQuarter: "Q3-2025",
          responsible: "Yedekleme Ekibi",
          completion: 60,
          category: "Altyapı"
        }
      ]
    },
    {
      name: "Makine Öğrenmesi Modeli",
      year: 2025,
      plannedStartQuarter: "Q3-2025",
      plannedEndQuarter: "Q4-2025",
      actualStartQuarter: "Q3-2025",
      actualEndQuarter: "Q4-2025",
      responsible: "ML Ekibi",
      completion: 15,
      category: "Yapay Zeka"
    },
    {
      name: "Web Sitesi Yenileme",
      year: 2025,
      plannedStartQuarter: "Q1-2025",
      plannedEndQuarter: "Q2-2025",
      actualStartQuarter: "Q1-2025",
      actualEndQuarter: "Q2-2025",
      responsible: "Web Ekibi",
      completion: 75,
      category: "Web Geliştirme"
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
