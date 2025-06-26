import Papa from 'papaparse';
import { Project } from '@/services/projectService';

export interface ImportResult {
  success: boolean;
  projects: Project[];
  errors: string[];
  totalRows: number;
  successfulRows: number;
}

export const parseCSVData = (csvText: string): ImportResult => {
  const lines = csvText.trim().split('\n');
  const errors: string[] = [];
  const projects: Project[] = [];
  let successfulRows = 0;
  let currentParentProject: Project | null = null;

  // İlk satırı header olarak atla (eğer varsa)
  const dataLines = lines.filter(line => line.trim() !== '');
  
  dataLines.forEach((line, index) => {
    try {
      // Tab veya virgül ile ayrılmış değerleri parse et
      const columns = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
      
      if (columns.length < 2) {
        errors.push(`Satır ${index + 1}: Yetersiz veri (en az 2 sütun gerekli)`);
        return;
      }

      // İlk kolonu kontrol et - numara varsa ana proje, yoksa alt proje
      const firstColumn = columns[0].trim();
      const isMainProject = /^\d+$/.test(firstColumn); // Sadece rakam varsa ana proje
      
      let projectName: string;
      let projectNumber: string | null = null;
      let dataColumns: string[];

      if (isMainProject) {
        // Ana proje - ilk kolon numara, ikinci kolon proje adı
        projectNumber = firstColumn;
        projectName = columns[1].trim();
        dataColumns = columns.slice(2); // İlk iki kolonu (numara ve isim) çıkar
      } else {
        // Alt proje - ilk kolon boş veya proje adı
        projectName = firstColumn || columns[1]?.trim() || '';
        dataColumns = columns.slice(1); // İlk kolonu çıkar
      }

      // Proje adı boşsa atla
      if (!projectName || projectName === '') {
        return;
      }

      // Veri kolonlarını parse et
      const [
        plannedStart = '',
        plannedEnd = '',
        actualStart = '',
        actualEnd = '',
        responsible = '',
        completionStr = ''
      ] = dataColumns.map(col => col?.trim() || '');

      // Tamamlanma yüzdesini parse et
      let completionPercentage = 0;
      if (completionStr) {
        const match = completionStr.match(/(\d+)%?/);
        if (match) {
          completionPercentage = parseInt(match[1]);
        }
      }

      // Tarihleri normalize et
      const normalizeDate = (date: string): string => {
        if (!date || date === '') return '2024';
        
        // Q1, Q2, Q3, Q4 formatlarını normalize et
        if (date.includes('Q1')) return 'Q1-2025';
        if (date.includes('Q2')) return 'Q2-2025';
        if (date.includes('Q3')) return 'Q3-2025';
        if (date.includes('Q4')) return 'Q4-2025';
        if (date.includes('2024')) return '2024';
        
        // Çoklu çeyrek formatını parse et (Q1-Q2-Q3-Q4)
        if (date.includes('-') && date.includes('Q')) {
          const quarters = date.split('-').filter(q => q.includes('Q'));
          if (quarters.length > 0) {
            return quarters[0] + '-2025';
          }
        }
        
        return date || '2024';
      };

      // Durum hesapla
      const getStatus = (completion: number): 'not-started' | 'in-progress' | 'completed' | 'delayed' => {
        if (completion === 0) return 'not-started';
        if (completion === 100) return 'completed';
        if (completion > 0 && completion < 100) return 'in-progress';
        return 'delayed';
      };

      // Kategori belirle (sorumlu kişiye göre)
      const getCategory = (responsible: string): string => {
        if (responsible.toLowerCase().includes('ürün geliştirme')) return 'Ürün Geliştirme';
        if (responsible.toLowerCase().includes('merve')) return 'Sistem Geliştirme';
        if (responsible.toLowerCase().includes('dilruba')) return 'Platform';
        return 'Genel';
      };

      const projectId = `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const project: Project = {
        id: projectId,
        name: projectNumber ? `${projectNumber}. ${projectName}` : projectName,
        plannedStartQuarter: normalizeDate(plannedStart),
        plannedEndQuarter: normalizeDate(plannedEnd),
        actualStartQuarter: normalizeDate(actualStart),
        actualEndQuarter: normalizeDate(actualEnd),
        year: 2025,
        completionPercentage: completionPercentage,
        category: getCategory(responsible || ''),
        responsible: responsible || 'Belirlenmemiş',
        status: getStatus(completionPercentage)
      };

      if (isMainProject) {
        // Ana proje
        project.subProjects = [];
        projects.push(project);
        currentParentProject = project;
        console.log(`Ana proje eklendi: ${project.name}`);
      } else {
        // Alt proje
        if (currentParentProject) {
          project.isSubProject = true;
          project.parentId = currentParentProject.id;
          currentParentProject.subProjects = currentParentProject.subProjects || [];
          currentParentProject.subProjects.push(project);
          console.log(`Alt proje eklendi: ${project.name} -> ${currentParentProject.name}`);
        } else {
          // Ana proje yoksa bağımsız proje olarak ekle
          projects.push(project);
          console.log(`Bağımsız proje eklendi: ${project.name}`);
        }
      }

      successfulRows++;

    } catch (error) {
      errors.push(`Satır ${index + 1}: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  });

  return {
    success: errors.length === 0 || successfulRows > 0,
    projects,
    errors,
    totalRows: dataLines.length,
    successfulRows
  };
};
