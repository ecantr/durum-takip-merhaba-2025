
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Project } from '@/pages/Roadmap';
import { getPhaseColor } from '@/utils/projectPhases';

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
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

  const toggleExpanded = (projectId: string) => {
    setExpandedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in-progress': return 'Devam Ediyor';
      case 'delayed': return 'Gecikmiş';
      default: return 'Başlamadı';
    }
  };

  const mainProjects = projects.filter(p => !p.isSubProject);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeler ({projects.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {mainProjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Henüz proje eklenmemiş
          </div>
        ) : (
          <div className="space-y-3">
            {mainProjects.map((project) => {
              const isExpanded = expandedProjects.includes(project.id);
              const hasSubProjects = project.subProjects && project.subProjects.length > 0;
              
              return (
                <div key={project.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {hasSubProjects && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(project.id)}
                            className="p-0 h-5 w-5"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <h4 className="font-medium text-sm truncate">{project.name}</h4>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          %{project.completionPercentage}
                        </Badge>
                        <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                          {getStatusText(project.status)}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        <div>Kategori: {project.category}</div>
                        <div>Sorumlu: {project.responsible}</div>
                        <div>Plan: {project.plannedStartQuarter} - {project.plannedEndQuarter}</div>
                        <div>Gerçek: {project.actualStartQuarter} - {project.actualEndQuarter}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(project)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(project.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const subProject = {
                            name: `${project.name} - Alt Proje`,
                            plannedStartQuarter: project.plannedStartQuarter,
                            plannedEndQuarter: project.plannedEndQuarter,
                            actualStartQuarter: project.actualStartQuarter,
                            actualEndQuarter: project.actualEndQuarter,
                            year: project.year,
                            completionPercentage: 0,
                            category: project.category,
                            responsible: project.responsible,
                            status: 'not-started' as const
                          };
                          onAddSubProject(project.id, subProject);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Alt projeler */}
                  {hasSubProjects && isExpanded && (
                    <div className="ml-6 border-l-2 border-gray-200 pl-3 space-y-2">
                      {project.subProjects!.map((subProject) => (
                        <div key={subProject.id} className="border rounded p-2 bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-sm truncate">{subProject.name}</h5>
                              
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  %{subProject.completionPercentage}
                                </Badge>
                                <Badge className={`${getStatusColor(subProject.status)} text-white text-xs`}>
                                  {getStatusText(subProject.status)}
                                </Badge>
                              </div>
                              
                              <div className="text-xs text-muted-foreground mt-1">
                                <div>Sorumlu: {subProject.responsible}</div>
                                <div>Plan: {subProject.plannedStartQuarter} - {subProject.plannedEndQuarter}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(subProject)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(subProject.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectList;
