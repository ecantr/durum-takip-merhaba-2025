
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Project } from '@/pages/Roadmap';

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
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Projeler ({projects.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mainProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg font-medium mb-2">Henüz proje eklenmemiş</div>
            <div className="text-sm">Yeni proje eklemek için yukarıdaki butonu kullanın</div>
          </div>
        ) : (
          <div className="space-y-4">
            {mainProjects.map((project) => {
              const isExpanded = expandedProjects.includes(project.id);
              const hasSubProjects = project.subProjects && project.subProjects.length > 0;
              
              return (
                <div key={project.id} className="border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow duration-200">
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          {hasSubProjects && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(project.id)}
                              className="p-1 h-7 w-7 hover:bg-gray-100 rounded-md"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                              )}
                            </Button>
                          )}
                          <h4 className="font-semibold text-lg text-gray-900 leading-tight">
                            {project.name}
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                            %{project.completionPercentage}
                          </Badge>
                          <Badge className={`${getStatusColor(project.status)} text-white text-sm font-medium px-3 py-1 transition-colors`}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 min-w-[80px]">Kategori:</span>
                            <span className="ml-2">{project.category}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 min-w-[80px]">Sorumlu:</span>
                            <span className="ml-2">{project.responsible}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 min-w-[80px]">Plan:</span>
                            <span className="ml-2">{project.plannedStartQuarter} - {project.plannedEndQuarter}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 min-w-[80px]">Gerçek:</span>
                            <span className="ml-2">{project.actualStartQuarter} - {project.actualEndQuarter}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(project)}
                          className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(project.id)}
                          className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
                          className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                          title="Alt Proje Ekle"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Alt projeler */}
                    {hasSubProjects && isExpanded && (
                      <div className="mt-5 ml-8 border-l-2 border-gray-200 pl-5 space-y-3">
                        {project.subProjects!.map((subProject) => (
                          <div key={subProject.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-base text-gray-800 mb-3 leading-tight">
                                  {subProject.name}
                                </h5>
                                
                                <div className="flex items-center gap-3 mb-3">
                                  <Badge variant="outline" className="text-sm font-medium px-2.5 py-1 bg-blue-50 text-blue-700 border-blue-200">
                                    %{subProject.completionPercentage}
                                  </Badge>
                                  <Badge className={`${getStatusColor(subProject.status)} text-white text-sm font-medium px-2.5 py-1 transition-colors`}>
                                    {getStatusText(subProject.status)}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <span className="font-medium text-gray-700 min-w-[70px]">Sorumlu:</span>
                                    <span className="ml-2">{subProject.responsible}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-gray-700 min-w-[70px]">Plan:</span>
                                    <span className="ml-2">{subProject.plannedStartQuarter} - {subProject.plannedEndQuarter}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEdit(subProject)}
                                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                                  title="Düzenle"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDelete(subProject.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
