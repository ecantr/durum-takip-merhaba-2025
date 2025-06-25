
import { Project } from '@/pages/Roadmap';

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

  // İlk satırı header olarak atla (eğer varsa)
  const dataLines = lines.filter(line => line.trim() !== '');
  
  dataLines.forEach((line, index) => {
    try {
      // Tab veya virgül ile ayrılmış değerleri parse et
      const columns = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
      
      if (columns.length < 6) {
        errors.push(`Satır ${index + 1}: Yetersiz veri (en az 6 sütun gerekli)`);
        return;
      }

      const [
        name,
        plannedStart,
        plannedEnd,
        actualStart,
        actualEnd,
        responsible,
        completionStr
      ] = columns.map(col => col.trim());

      // Proje adı boşsa atla
      if (!name || name === '') {
        return;
      }

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

      const project: Project = {
        id: `import-${Date.now()}-${index}`,
        name: name,
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

      projects.push(project);
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
