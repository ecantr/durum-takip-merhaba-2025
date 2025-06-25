import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Project } from '@/pages/Roadmap';
import { getPhaseColor, getPhaseInfo } from '@/utils/projectPhases';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onAddSubProject: (parentId: string, subProject: Omit<Project, 'id'>) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  onEdit, 
  onDelete, 
  onAddSubProject 
}) => {
  const [openProjects, setOpenProjects] = useState<Set<string>>(new Set());
  const [showSubProjectForm, setShowSubProjectForm] = useState<string | null>(null);

  const toggleProject = (projectId: string) => {
    const newOpenProjects = new Set(openProjects);
    if (newOpenProjects.has(projectId)) {
      newOpenProjects.delete(projectId);
    } else {
      newOpenProjects.add(projectId);
    }
    setOpenProjects(newOpenProjects);
  };

  const getStatusColor = (status: string, completion: number) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'delayed') return 'bg-red-500';
    
    // Proje fazına göre renk belirleme
    return getPhaseColor(completion);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in-progress': return 'Devam Ediyor';
      case 'delayed': return 'Gecikmiş';
      default: return 'Başlanmadı';
    }
  };

  const handleAddSubProject = (parentId: string) => {
    const subProject: Omit<Project, 'id'> = {
      name: 'Yeni Alt Proje',
      plannedStartQuarter: 'Q1',
      plannedEndQuarter: 'Q2',
      actualStartQuarter: 'Q1',
      actualEndQuarter: 'Q2',
      year: 2025,
      completionPercentage: 0,
      category: 'Alt Proje',
      responsible: '',
      status: 'not-started',
      isSubProject: true,
      parentId: parentId
    };
    onAddSubProject(parentId, subProject);
    setShowSubProjectForm(null);
  };

  // Ana projeleri filtrele (alt projeler hariç)
  const mainProjects = projects.filter(p => !p.isSubProject);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeler ({mainProjects.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mainProjects.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Henüz proje eklenmedi. Yeni proje eklemek için yukarıdaki butonu kullanın.
          </p>
        ) : (
          mainProjects.map((project) => {
            const phaseInfo = getPhaseInfo(project.completionPercentage);
            return (
              <Collapsible
                key={project.id}
                open={openProjects.has(project.id)}
                onOpenChange={() => toggleProject(project.id)}
              >
                <div className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 flex items-center gap-2">
                      <CollapsibleTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-0 h-auto"
                          disabled={!project.subProjects?.length}
                        >
                          {project.subProjects?.length ? (
                            openProjects.has(project.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        {project.category && (
                          <p className="text-sm text-muted-foreground">{project.category}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowSubProjectForm(project.id)}
                        title="Alt proje ekle"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(project)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(project.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(project.status, project.completionPercentage)}>
                      {getStatusText(project.status)}
                    </Badge>
                    <span className="text-sm font-medium">
                      %{project.completionPercentage}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {phaseInfo.name}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {phaseInfo.description}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Plan: {project.year} {project.plannedStartQuarter} - {project.plannedEndQuarter}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Gerçek: {project.year} {project.actualStartQuarter} - {project.actualEndQuarter}
                  </div>
                  
                  {project.responsible && (
                    <div className="text-xs text-muted-foreground">
                      Sorumlu: {project.responsible}
                    </div>
                  )}

                  {showSubProjectForm === project.id && (
                    <div className="border-t pt-2 mt-2">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleAddSubProject(project.id)}
                        >
                          Alt Proje Ekle
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowSubProjectForm(null)}
                        >
                          İptal
                        </Button>
                      </div>
                    </div>
                  )}

                  <CollapsibleContent className="space-y-2">
                    {project.subProjects?.map((subProject) => {
                      const subPhaseInfo = getPhaseInfo(subProject.completionPercentage);
                      return (
                        <div key={subProject.id} className="ml-6 border-l-2 border-gray-200 pl-3 py-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="text-sm font-medium">{subProject.name}</h5>
                              {subProject.category && (
                                <p className="text-xs text-muted-foreground">{subProject.category}</p>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onEdit(subProject)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDelete(subProject.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${getStatusColor(subProject.status, subProject.completionPercentage)} text-xs`}>
                              {getStatusText(subProject.status)}
                            </Badge>
                            <span className="text-xs font-medium">
                              %{subProject.completionPercentage}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {subPhaseInfo.name}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-1">
                            {subPhaseInfo.description}
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-1">
                            Plan: {subProject.year} {subProject.plannedStartQuarter} - {subProject.plannedEndQuarter}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Gerçek: {subProject.year} {subProject.actualStartQuarter} - {subProject.actualEndQuarter}
                          </div>
                          
                          {subProject.responsible && (
                            <div className="text-xs text-muted-foreground">
                              Sorumlu: {subProject.responsible}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectList;
