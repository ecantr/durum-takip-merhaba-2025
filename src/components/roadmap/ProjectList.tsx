import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Project } from '@/services/projectService';

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
      case 'completed': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'in-progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'delayed': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
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
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Projeler ({projects.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mainProjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-base font-medium mb-1">Henüz proje eklenmemiş</div>
            <div className="text-sm">Yeni proje eklemek için yukarıdaki butonu kullanın</div>
          </div>
        ) : (
          <div className="space-y-3">
            {mainProjects.map((project) => {
              const isExpanded = expandedProjects.includes(project.id);
              const hasSubProjects = project.subProjects && project.subProjects.length > 0;
              
              return (
                <div key={project.id} className="border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {hasSubProjects && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(project.id)}
                              className="p-1 h-6 w-6 hover:bg-gray-100 rounded-md"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-3 w-3 text-gray-600" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-gray-600" />
                              )}
                            </Button>
                          )}
                          <h4 className="font-medium text-base text-gray-900">
                            {project.name}
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                            %{project.completionPercentage}
                          </Badge>
                          <Badge className={`${getStatusColor(project.status)} text-white text-xs px-2 py-0.5`}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>
                            <span className="font-medium text-gray-700">Kategori:</span>
                            <span className="ml-1">{project.category}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Sorumlu:</span>
                            <span className="ml-1">{project.responsible}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Plan:</span>
                            <span className="ml-1">{project.plannedStartQuarter} - {project.plannedEndQuarter}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Gerçek:</span>
                            <span className="ml-1">{project.actualStartQuarter} - {project.actualEndQuarter}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(project)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(project.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
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
                          className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-700 rounded-md"
                          title="Alt Proje Ekle"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Alt projeler */}
                    {hasSubProjects && isExpanded && (
                      <div className="mt-3 ml-6 border-l-2 border-gray-200 pl-3 space-y-2">
                        {project.subProjects!.map((subProject) => (
                          <div key={subProject.id} className="border border-gray-100 rounded-md p-3 bg-gray-50/50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-sm text-gray-800 mb-2">
                                  {subProject.name}
                                </h5>
                                
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                                    %{subProject.completionPercentage}
                                  </Badge>
                                  <Badge className={`${getStatusColor(subProject.status)} text-white text-xs px-2 py-0.5`}>
                                    {getStatusText(subProject.status)}
                                  </Badge>
                                </div>
                                
                                <div className="space-y-1 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium text-gray-700">Sorumlu:</span>
                                    <span className="ml-1">{subProject.responsible}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Plan:</span>
                                    <span className="ml-1">{subProject.plannedStartQuarter} - {subProject.plannedEndQuarter}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEdit(subProject)}
                                  className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                                  title="Düzenle"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDelete(subProject.id)}
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                                  title="Sil"
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
