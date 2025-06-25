import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Trash2 } from 'lucide-react';
import ProjectForm from '@/components/roadmap/ProjectForm';
import GanttChart from '@/components/roadmap/GanttChart';
import ProjectList from '@/components/roadmap/ProjectList';
import ProjectPhaseInfo from '@/components/roadmap/ProjectPhaseInfo';
import { convertRoadmapData } from '@/utils/dataImport';
import { saveProjectsToStorage, loadProjectsFromStorage, clearProjectsFromStorage, checkStorageStatus } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import CSVImport from '@/components/roadmap/CSVImport';

export interface Project {
  id: string;
  name: string;
  plannedStartQuarter: string; // Q1, Q2, Q3, Q4
  plannedEndQuarter: string;
  actualStartQuarter: string; // Q1, Q2, Q3, Q4
  actualEndQuarter: string;
  year: number;
  completionPercentage: number;
  category: string;
  responsible: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'continuous';
  subProjects?: Project[]; // Alt projeler
  isSubProject?: boolean; // Alt proje mi?
  parentId?: string; // Ana proje ID'si
}

const Roadmap = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Sayfa yüklendiğinde localStorage'dan projeleri yükle
  useEffect(() => {
    console.log('Roadmap bileşeni yüklendi, localStorage\'dan veri çekiliyor...');
    checkStorageStatus(); // Debug için durum kontrolü
    
    const savedProjects = loadProjectsFromStorage();
    console.log('Yüklenen projeler:', savedProjects);
    
    if (savedProjects.length > 0) {
      setProjects(savedProjects);
      console.log('Projeler state\'e yüklendi:', savedProjects.length);
    } else {
      console.log('Yüklenecek proje bulunamadı');
    }
    
    setIsLoading(false);
  }, []);

  // Projeler değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      console.log('Projeler değişti, localStorage\'a kaydediliyor:', projects.length);
      saveProjectsToStorage(projects);
    }
  }, [projects, isLoading]);

  // Sayfa kapatılmadan önce kaydet
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (projects.length > 0) {
        console.log('Sayfa kapatılıyor, projeler kaydediliyor...');
        saveProjectsToStorage(projects);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [projects]);

  const handleAddProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    };
    console.log('Yeni proje ekleniyor:', newProject.name);
    setProjects([...projects, newProject]);
    setShowForm(false);
    toast({
      title: "Başarılı",
      description: "Proje başarıyla eklendi",
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleUpdateProject = (updatedProject: Omit<Project, 'id'>) => {
    if (editingProject) {
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...updatedProject, id: editingProject.id }
          : p
      ));
      setEditingProject(null);
      setShowForm(false);
      toast({
        title: "Başarılı",
        description: "Proje başarıyla güncellendi",
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast({
      title: "Başarılı",
      description: "Proje başarıyla silindi",
    });
  };

  const handleAddSubProject = (parentId: string, subProject: Omit<Project, 'id'>) => {
    const newSubProject: Project = {
      ...subProject,
      id: Date.now().toString(),
      isSubProject: true,
      parentId: parentId,
    };

    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === parentId 
          ? {
              ...project,
              subProjects: [...(project.subProjects || []), newSubProject]
            }
          : project
      )
    );
    toast({
      title: "Başarılı",
      description: "Alt proje başarıyla eklendi",
    });
  };

  const handleLoadSampleData = () => {
    const sampleProjects = convertRoadmapData();
    setProjects(sampleProjects);
    toast({
      title: "Başarılı",
      description: `${sampleProjects.length} proje başarıyla yüklendi`,
    });
  };

  const handleClearAllData = () => {
    setProjects([]);
    clearProjectsFromStorage();
    toast({
      title: "Başarılı",
      description: "Tüm projeler temizlendi",
    });
  };

  const handleCSVImport = (importedProjects: Project[]) => {
    console.log('CSV\'den projeler içe aktarılıyor:', importedProjects.length);
    setProjects(prevProjects => [...prevProjects, ...importedProjects]);
    setShowCSVImport(false);
    toast({
      title: "Başarılı",
      description: `${importedProjects.length} proje başarıyla içe aktarıldı`,
    });
  };

  // Manual save fonksiyonu - test amaçlı
  const handleManualSave = () => {
    saveProjectsToStorage(projects);
    checkStorageStatus();
    toast({
      title: "Kayıt Tamamlandı",
      description: `${projects.length} proje localStorage'a kaydedildi`,
    });
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
          <Button 
            onClick={handleManualSave} 
            variant="outline" 
            className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100"
          >
            💾 Manuel Kaydet
          </Button>
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
