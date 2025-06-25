
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProjectForm from '@/components/roadmap/ProjectForm';
import GanttChart from '@/components/roadmap/GanttChart';
import ProjectList from '@/components/roadmap/ProjectList';

export interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  completionPercentage: number;
  category: string;
  responsible: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
}

const Roadmap = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    };
    setProjects([...projects, newProject]);
    setShowForm(false);
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
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">2025 Proje Roadmap</h1>
          <p className="text-muted-foreground">Projelerinizi takip edin ve Gantt chart ile görselleştirin</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yeni Proje
        </Button>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProjectList
            projects={projects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        </div>
        <div className="lg:col-span-2">
          <GanttChart projects={projects} />
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
