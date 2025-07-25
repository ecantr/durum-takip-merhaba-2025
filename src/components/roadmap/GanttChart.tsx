import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Project } from '@/services/projectService';
import { getPhaseColor } from '@/utils/projectPhases';

interface GanttChartProps {
  projects: Project[];
}

const GanttChart: React.FC<GanttChartProps> = ({ projects }) => {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const chartData = useMemo(() => {
    // Sabit zaman çizelgesi: 2024 (tek blok) + 2025 çeyrekleri
    const timeperiods = [
      { value: '2024', label: '2024', year: 2024 },
      { value: 'Q1-2025', label: '2025 Q1', year: 2025 },
      { value: 'Q2-2025', label: '2025 Q2', year: 2025 },
      { value: 'Q3-2025', label: '2025 Q3', year: 2025 },
      { value: 'Q4-2025', label: '2025 Q4', year: 2025 }
    ];

    return { timeperiods };
  }, []);

  const getTimePeriodIndex = (period: string) => {
    return chartData.timeperiods.findIndex(t => t.value === period);
  };

  const getProjectPosition = (project: Project) => {
    const totalPeriods = chartData.timeperiods.length;
    if (totalPeriods === 0) return { left: 0, width: 0 };

    // Sürekli projeler için tüm zaman dilimini kapla
    if (project.status === 'continuous') {
      return { left: 0, width: 100 };
    }

    // Planlanan tarihler yoksa null döndür
    if (!project.plannedStartQuarter || !project.plannedEndQuarter) {
      return null;
    }

    const startIndex = getTimePeriodIndex(project.plannedStartQuarter);
    const endIndex = getTimePeriodIndex(project.plannedEndQuarter);

    if (startIndex === -1 || endIndex === -1) return null;

    const left = (startIndex * 100) / totalPeriods;
    const width = ((endIndex - startIndex + 1) * 100) / totalPeriods;

    return { left, width };
  };

  const getActualProjectPosition = (project: Project) => {
    const totalPeriods = chartData.timeperiods.length;
    if (totalPeriods === 0) return { left: 0, width: 0 };

    // Sürekli projeler için tüm zaman dilimini kapla
    if (project.status === 'continuous') {
      return { left: 0, width: 100 };
    }

    const startIndex = getTimePeriodIndex(project.actualStartQuarter);
    const endIndex = getTimePeriodIndex(project.actualEndQuarter);

    if (startIndex === -1 || endIndex === -1) return { left: 0, width: 0 };

    const left = (startIndex * 100) / totalPeriods;
    const width = ((endIndex - startIndex + 1) * 100) / totalPeriods;

    return { left, width };
  };

  const getStatusColor = (status: string, completion: number) => {
    if (completion === 100) return 'bg-green-500';
    if (status === 'delayed') return 'bg-red-500';
    if (status === 'continuous') return 'bg-purple-500';
    
    // Proje fazına göre renk belirleme
    return getPhaseColor(completion);
  };

  const getTextColor = (status: string, completion: number) => {
    // Daha iyi görünürlük için koyu renk kullan
    if (completion === 100) return 'text-white';
    if (status === 'delayed') return 'text-white';
    if (status === 'continuous') return 'text-white';
    return 'text-gray-800';
  };

  const formatPlannedPeriod = (startQuarter: string, endQuarter: string) => {
    // Q1-2025 formatından Q1 çıkar
    const formatQuarter = (quarter: string) => {
      if (quarter === '2024') return '2024';
      return quarter.replace('-2025', '');
    };
    
    const start = formatQuarter(startQuarter);
    const end = formatQuarter(endQuarter);
    
    if (start === end) {
      return `Planlanan:${start}`;
    }
    return `Planlanan:${start}-${end}`;
  };

  const toggleProjectExpansion = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Sadece ana projeleri al
  const mainProjects = useMemo(() => {
    return projects.filter(p => !p.isSubProject);
  }, [projects]);

  const ProjectRow = ({ project, isSubProject = false }: { project: Project, isSubProject?: boolean }) => {
    const plannedPosition = getProjectPosition(project);
    const actualPosition = getActualProjectPosition(project);
    const hasPlannedDates = plannedPosition !== null;
    
    return (
      <div className={`flex items-center py-2 hover:bg-gray-50 ${isSubProject ? 'bg-gray-25' : ''}`}>
        <div className="w-48 pr-4">
          <div className={`font-medium text-sm flex items-center ${isSubProject ? 'text-gray-600' : ''}`}>
            {isSubProject && (
              <div className="flex items-center mr-3">
                <div className="w-6 h-0.5 bg-gray-500 mr-2"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              </div>
            )}
            <span className={isSubProject ? 'ml-1' : ''}>
              {project.name}
            </span>
          </div>
          <div className={`text-xs text-muted-foreground ${isSubProject ? 'ml-12' : ''}`}>
            {project.status === 'continuous' ? 'Sürekli' : `%${project.completionPercentage}`}
          </div>
        </div>
        <div className="flex-1 relative h-12">
          {/* Sürekli projeler için sadece tek çubuk göster */}
          {project.status === 'continuous' ? (
            <div 
              className={`absolute h-8 rounded ${getStatusColor(project.status, project.completionPercentage)} opacity-90 flex items-center justify-center top-2`}
              style={{
                left: `${actualPosition.left}%`,
                width: `${actualPosition.width}%`,
              }}
              title="Sürekli proje"
            >
              <span className={`text-xs font-bold ${getTextColor(project.status, project.completionPercentage)}`}>
                Sürekli
              </span>
            </div>
          ) : (
            <>
              {/* Planned timeline (sadece planlanan tarihler varsa göster) */}
              {hasPlannedDates && plannedPosition && (
                <div 
                  className="absolute h-4 rounded bg-gray-300 opacity-60 top-0 flex items-center justify-center"
                  style={{
                    left: `${plannedPosition.left}%`,
                    width: `${plannedPosition.width}%`,
                  }}
                  title={`Plan: ${project.plannedStartQuarter} - ${project.plannedEndQuarter}`}
                >
                  <span className="text-gray-700 text-xs font-medium">
                    {formatPlannedPeriod(project.plannedStartQuarter!, project.plannedEndQuarter!)}
                  </span>
                </div>
              )}
              
              {/* Actual timeline - planlanan tarih yoksa ortada göster */}
              <div 
                className={`absolute h-4 rounded ${getStatusColor(project.status, project.completionPercentage)} opacity-90 flex items-center justify-center ${hasPlannedDates ? 'top-6' : 'top-4'}`}
                style={{
                  left: `${actualPosition.left}%`,
                  width: `${actualPosition.width}%`,
                }}
                title={`Gerçek: ${project.actualStartQuarter} - ${project.actualEndQuarter}`}
              >
                <span className={`text-xs font-bold ${getTextColor(project.status, project.completionPercentage)}`}>
                  %{project.completionPercentage}
                </span>
              </div>
              
              {/* Progress overlay */}
              {project.completionPercentage > 0 && project.completionPercentage < 100 && (
                <div 
                  className={`absolute h-4 rounded bg-green-600 opacity-70 ${hasPlannedDates ? 'top-6' : 'top-4'}`}
                  style={{
                    left: `${actualPosition.left}%`,
                    width: `${(actualPosition.width * project.completionPercentage) / 100}%`,
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Gantt Chart (2024-2025 Roadmap)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mainProjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Projeler eklendikçe Gantt chart burada görünecek
          </div>
        ) : (
          <div className="space-y-4">
            {/* Timeline header */}
            <div className="flex border-b pb-2">
              <div className="w-48 font-medium">Proje</div>
              <div className="flex-1 relative">
                <div className="flex">
                  {chartData.timeperiods.map((period) => (
                    <div 
                      key={period.value}
                      className="flex-1 text-xs text-center border-l border-gray-200 px-1"
                    >
                      {period.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project rows */}
            {mainProjects.map((project) => {
              const hasSubProjects = project.subProjects && project.subProjects.length > 0;
              const isExpanded = expandedProjects.has(project.id);
              
              return (
                <div key={project.id} className="space-y-1">
                  {/* Ana proje satırı */}
                  <div className="flex items-center">
                    <div className="flex items-center w-48 pr-4">
                      {/* Dropdown toggle butonu */}
                      {hasSubProjects ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto mr-2"
                          onClick={() => toggleProjectExpansion(project.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        <div className="w-8" /> // Boşluk için
                      )}
                      
                      <div className="flex-1">
                        <div className="font-medium text-sm flex items-center">
                          <span>{project.name}</span>
                          {hasSubProjects && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {project.subProjects!.length} alt proje
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {project.status === 'continuous' ? 'Sürekli' : `%${project.completionPercentage}`}
                        </div>
                      </div>
                    </div>
                    
                    {/* Ana proje timeline */}
                    <div className="flex-1 relative h-12">
                      {
                        (() => {
                        const plannedPosition = getProjectPosition(project);
                        const actualPosition = getActualProjectPosition(project);
                        const hasPlannedDates = plannedPosition !== null;
                        
                        return project.status === 'continuous' ? (
                          <div 
                            className={`absolute h-8 rounded ${getStatusColor(project.status, project.completionPercentage)} opacity-90 flex items-center justify-center top-2`}
                            style={{
                              left: `${actualPosition.left}%`,
                              width: `${actualPosition.width}%`,
                            }}
                            title="Sürekli proje"
                          >
                            <span className={`text-xs font-bold ${getTextColor(project.status, project.completionPercentage)}`}>
                              Sürekli
                            </span>
                          </div>
                        ) : (
                          <>
                            {hasPlannedDates && plannedPosition && (
                              <div 
                                className="absolute h-4 rounded bg-gray-300 opacity-60 top-0 flex items-center justify-center"
                                style={{
                                  left: `${plannedPosition.left}%`,
                                  width: `${plannedPosition.width}%`,
                                }}
                                title={`Plan: ${project.plannedStartQuarter} - ${project.plannedEndQuarter}`}
                              >
                                <span className="text-gray-700 text-xs font-medium">
                                  {formatPlannedPeriod(project.plannedStartQuarter!, project.plannedEndQuarter!)}
                                </span>
                              </div>
                            )}
                            
                            <div 
                              className={`absolute h-4 rounded ${getStatusColor(project.status, project.completionPercentage)} opacity-90 flex items-center justify-center ${hasPlannedDates ? 'top-6' : 'top-4'}`}
                              style={{
                                left: `${actualPosition.left}%`,
                                width: `${actualPosition.width}%`,
                              }}
                              title={`Gerçek: ${project.actualStartQuarter} - ${project.actualEndQuarter}`}
                            >
                              <span className={`text-xs font-bold ${getTextColor(project.status, project.completionPercentage)}`}>
                                %{project.completionPercentage}
                              </span>
                            </div>
                            
                            {project.completionPercentage > 0 && project.completionPercentage < 100 && (
                              <div 
                                className={`absolute h-4 rounded bg-green-600 opacity-70 ${hasPlannedDates ? 'top-6' : 'top-4'}`}
                                style={{
                                  left: `${actualPosition.left}%`,
                                  width: `${(actualPosition.width * project.completionPercentage) / 100}%`,
                                }}
                              />
                            )}
                          </>
                        );
                      })()
                      }
                    </div>
                  </div>
                  
                  {/* Alt projeler (genişletildiğinde göster) */}
                  {hasSubProjects && isExpanded && (
                    <div className="pl-6 space-y-1">
                      {project.subProjects!.map((subProject) => (
                        <ProjectRow key={subProject.id} project={subProject} isSubProject={true} />
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

export default GanttChart;
