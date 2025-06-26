import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Trash2 } from 'lucide-react';
import ProjectForm from '@/components/roadmap/ProjectForm';
import GanttChart from '@/components/roadmap/GanttChart';
import ProjectList from '@/components/roadmap/ProjectList';
import ProjectPhaseInfo from '@/components/roadmap/ProjectPhaseInfo';
import { convertRoadmapData } from '@/utils/dataImport';
import { useToast } from '@/hooks/use-toast';
import CSVImport from '@/components/roadmap/CSVImport';
import { projectService, type Project } from '@/services/projectService';

const Roadmap = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Sayfa yüklendiğinde projeleri getir
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      console.log('Projeler Supabase\'den yükleniyor...');
      const loadedProjects = await projectService.getAllProjects();
      console.log('Yüklenen projeler:', loadedProjects.length);
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Projeler yüklenirken hata:', error);
      toast({
        title: "Hata",
        description: "Projeler yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async (project: Omit<Project, 'id'>) => {
    try {
      console.log('Yeni proje ekleniyor:', project.name);
      const newProject = await projectService.createProject(project);
      setProjects(prev => [...prev, newProject]);
      setShowForm(false);
      toast({
        title: "Başarılı",
        description: "Proje başarıyla eklendi",
      });
    } catch (error) {
      console.error('Proje eklenirken hata:', error);
      toast({
        title: "Hata",
        description: "Proje eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleEditProject = (project: Project) => {
    console.log('Düzenleme için seçilen proje:', project);
    setEditingProject(project);
    setShowForm(true);
  };

  const handleUpdateProject = async (updatedProject: Omit<Project, 'id'>) => {
    if (!editingProject) return;

    try {
      console.log('Proje güncelleniyor:', editingProject.id, updatedProject);
      const updated = await projectService.updateProject(editingProject.id, updatedProject);
      console.log('Güncellenmiş proje:', updated);
      
      // Alt projeleri yeniden yükle
      await loadProjects();
      
      setEditingProject(null);
      setShowForm(false);
      toast({
        title: "Başarılı",
        description: "Proje başarıyla güncellendi",
      });
    } catch (error) {
      console.error('Proje güncellenirken hata:', error);
      toast({
        title: "Hata",
        description: "Proje güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      console.log('Proje siliniyor:', projectId);
      await projectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Başarılı",
        description: "Proje başarıyla silindi",
      });
    } catch (error) {
      console.error('Proje silinirken hata:', error);
      toast({
        title: "Hata",
        description: "Proje silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleAddSubProject = async (parentId: string, subProject: Omit<Project, 'id'>) => {
    try {
      const newSubProject = {
        ...subProject,
        isSubProject: true,
        parentId: parentId,
      };

      console.log('Alt proje ekleniyor:', newSubProject.name);
      await projectService.createProject(newSubProject);
      
      // Projeleri yeniden yükle
      await loadProjects();
      
      toast({
        title: "Başarılı",
        description: "Alt proje başarıyla eklendi",
      });
    } catch (error) {
      console.error('Alt proje eklenirken hata:', error);
      toast({
        title: "Hata",
        description: "Alt proje eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleLoadSampleData = async () => {
    try {
      const sampleProjects = convertRoadmapData();
      console.log('Örnek veriler ekleniyor:', sampleProjects.length);
      await projectService.createMultipleProjects(sampleProjects);
      await loadProjects();
      toast({
        title: "Başarılı",
        description: `${sampleProjects.length} proje başarıyla yüklendi`,
      });
    } catch (error) {
      console.error('Örnek veriler yüklenirken hata:', error);
      toast({
        title: "Hata",
        description: "Örnek veriler yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleClearAllData = async () => {
    try {
      console.log('Tüm projeler siliniyor...');
      // Tüm projeleri sil
      for (const project of projects) {
        await projectService.deleteProject(project.id);
      }
      setProjects([]);
      toast({
        title: "Başarılı",
        description: "Tüm projeler temizlendi",
      });
    } catch (error) {
      console.error('Projeler silinirken hata:', error);
      toast({
        title: "Hata",
        description: "Projeler silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleCSVImport = async (importedProjects: Project[]) => {
    try {
      console.log('CSV\'den projeler içe aktarılıyor:', importedProjects.length);
      await projectService.createMultipleProjects(importedProjects);
      await loadProjects();
      setShowCSVImport(false);
      toast({
        title: "Başarılı",
        description: `${importedProjects.length} proje başarıyla içe aktarıldı`,
      });
    } catch (error) {
      console.error('CSV import hatası:', error);
      toast({
        title: "Hata",
        description: "Projeler içe aktarılırken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Projeler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">2025 Proje Roadmap</h1>
          <p className="text-muted-foreground">
            Projelerinizi takip edin ve Gantt chart ile görselleştirin
            {projects.length > 0 && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {projects.length} proje kayıtlı
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {projects.length > 0 && (
            <Button 
              onClick={handleClearAllData} 
              variant="outline" 
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Tümünü Temizle
            </Button>
          )}
          <Button 
            onClick={() => setShowCSVImport(true)} 
            variant="outline" 
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <Upload className="w-4 h-4" />
            Toplu İthalat
          </Button>
          <Button onClick={handleLoadSampleData} variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Örnek Veri Yükle (25 Proje)
          </Button>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Yeni Proje
          </Button>
        </div>
      </div>

      {showCSVImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <CSVImport
            onImport={handleCSVImport}
            onClose={() => setShowCSVImport(false)}
          />
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProject ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm
              project={editingProject}
              onSubmit={editingProject ? handleUpdateProject : handleAddProject}
              onCancel={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <ProjectPhaseInfo />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProjectList
              projects={projects}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onAddSubProject={handleAddSubProject}
            />
          </div>
          <div className="lg:col-span-3">
            <GanttChart projects={projects} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
