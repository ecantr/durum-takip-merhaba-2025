
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Database tablosundaki tür
type DatabaseProject = Database['public']['Tables']['projects']['Row'];
type DatabaseProjectInsert = Database['public']['Tables']['projects']['Insert'];
type DatabaseProjectUpdate = Database['public']['Tables']['projects']['Update'];

// Uygulama içinde kullanılan tür
export interface Project {
  id: string;
  name: string;
  plannedStartQuarter: string;
  plannedEndQuarter: string;
  actualStartQuarter: string;
  actualEndQuarter: string;
  year: number;
  completionPercentage: number;
  category: string;
  responsible: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'continuous';
  subProjects?: Project[];
  isSubProject?: boolean;
  parentId?: string;
  sortOrder?: number;
}

// Veritabanı verilerini uygulama formatına dönüştür
function mapDatabaseToProject(dbProject: DatabaseProject): Project {
  return {
    id: dbProject.id,
    name: dbProject.name,
    plannedStartQuarter: dbProject.planned_start_quarter,
    plannedEndQuarter: dbProject.planned_end_quarter,
    actualStartQuarter: dbProject.actual_start_quarter,
    actualEndQuarter: dbProject.actual_end_quarter,
    year: dbProject.year,
    completionPercentage: dbProject.completion_percentage,
    category: dbProject.category || '',
    responsible: dbProject.responsible || '',
    status: dbProject.status as Project['status'],
    isSubProject: dbProject.is_sub_project || false,
    parentId: dbProject.parent_id || undefined,
    sortOrder: dbProject.sort_order || 0,
  };
}

// Uygulama verilerini veritabanı formatına dönüştür
function mapProjectToDatabase(project: Omit<Project, 'id'>): DatabaseProjectInsert {
  return {
    name: project.name,
    planned_start_quarter: project.plannedStartQuarter,
    planned_end_quarter: project.plannedEndQuarter,
    actual_start_quarter: project.actualStartQuarter,
    actual_end_quarter: project.actualEndQuarter,
    year: project.year,
    completion_percentage: project.completionPercentage,
    category: project.category || null,
    responsible: project.responsible || null,
    status: project.status,
    is_sub_project: project.isSubProject || false,
    parent_id: project.parentId || null,
    sort_order: project.sortOrder || 0,
  };
}

export const projectService = {
  // Tüm projeleri getir (sıralama ile)
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Projeler getirilirken hata:', error);
      throw error;
    }

    // Ana projeleri ve alt projeleri organize et
    const projects: Project[] = [];
    const subProjectsMap = new Map<string, Project[]>();

    data?.forEach(dbProject => {
      const project = mapDatabaseToProject(dbProject);
      
      if (project.isSubProject && project.parentId) {
        if (!subProjectsMap.has(project.parentId)) {
          subProjectsMap.set(project.parentId, []);
        }
        subProjectsMap.get(project.parentId)!.push(project);
      } else {
        projects.push(project);
      }
    });

    // Alt projeleri ana projelere ekle ve sırala
    projects.forEach(project => {
      if (subProjectsMap.has(project.id)) {
        const subProjects = subProjectsMap.get(project.id)!;
        subProjects.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        project.subProjects = subProjects;
      }
    });

    return projects;
  },

  // Yeni proje ekle
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    // Yeni proje için son sıra numarasını al
    const isSubProject = project.isSubProject || false;
    let maxSortOrder = 0;

    if (isSubProject && project.parentId) {
      // Alt proje ise, aynı parent_id'ye sahip projeler arasında max sort_order'ı bul
      const { data: siblingProjects } = await supabase
        .from('projects')
        .select('sort_order')
        .eq('parent_id', project.parentId)
        .eq('is_sub_project', true);
      
      maxSortOrder = siblingProjects?.reduce((max, p) => Math.max(max, p.sort_order || 0), 0) || 0;
    } else {
      // Ana proje ise, tüm ana projeler arasında max sort_order'ı bul
      const { data: mainProjects } = await supabase
        .from('projects')
        .select('sort_order')
        .or('is_sub_project.is.null,is_sub_project.eq.false');
      
      maxSortOrder = mainProjects?.reduce((max, p) => Math.max(max, p.sort_order || 0), 0) || 0;
    }

    const projectWithSortOrder = {
      ...project,
      sortOrder: maxSortOrder + 1
    };

    const dbProject = mapProjectToDatabase(projectWithSortOrder);
    
    const { data, error } = await supabase
      .from('projects')
      .insert(dbProject)
      .select()
      .single();

    if (error) {
      console.error('Proje eklenirken hata:', error);
      throw error;
    }

    return mapDatabaseToProject(data);
  },

  // Proje güncelle
  async updateProject(id: string, updates: Partial<Omit<Project, 'id'>>): Promise<Project> {
    const dbUpdates: DatabaseProjectUpdate = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.plannedStartQuarter !== undefined) dbUpdates.planned_start_quarter = updates.plannedStartQuarter;
    if (updates.plannedEndQuarter !== undefined) dbUpdates.planned_end_quarter = updates.plannedEndQuarter;
    if (updates.actualStartQuarter !== undefined) dbUpdates.actual_start_quarter = updates.actualStartQuarter;
    if (updates.actualEndQuarter !== undefined) dbUpdates.actual_end_quarter = updates.actualEndQuarter;
    if (updates.year !== undefined) dbUpdates.year = updates.year;
    if (updates.completionPercentage !== undefined) dbUpdates.completion_percentage = updates.completionPercentage;
    if (updates.category !== undefined) dbUpdates.category = updates.category || null;
    if (updates.responsible !== undefined) dbUpdates.responsible = updates.responsible || null;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.isSubProject !== undefined) dbUpdates.is_sub_project = updates.isSubProject;
    if (updates.parentId !== undefined) dbUpdates.parent_id = updates.parentId || null;
    if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

    const { data, error } = await supabase
      .from('projects')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Proje güncellenirken hata:', error);
      throw error;
    }

    return mapDatabaseToProject(data);
  },

  // Proje sil
  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Proje silinirken hata:', error);
      throw error;
    }
  },

  // Toplu proje ekleme
  async createMultipleProjects(projects: Omit<Project, 'id'>[]): Promise<Project[]> {
    const dbProjects = projects.map(mapProjectToDatabase);
    
    const { data, error } = await supabase
      .from('projects')
      .insert(dbProjects)
      .select();

    if (error) {
      console.error('Projeler eklenirken hata:', error);
      throw error;
    }

    return data.map(mapDatabaseToProject);
  },

  // Projeleri yeniden sırala
  async reorderProjects(projectIds: string[], isSubProject: boolean = false, parentId?: string): Promise<void> {
    console.log('Projeler yeniden sıralanıyor:', { projectIds, isSubProject, parentId });
    
    // Her proje için yeni sort_order değerini güncelle
    const updates = projectIds.map((id, index) => ({
      id,
      sort_order: index + 1
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('projects')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id);

      if (error) {
        console.error('Proje sıralaması güncellenirken hata:', error);
        throw error;
      }
    }

    console.log('Proje sıralaması başarıyla güncellendi');
  }
};
