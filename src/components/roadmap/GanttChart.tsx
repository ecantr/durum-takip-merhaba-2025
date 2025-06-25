
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/pages/Roadmap';
import { getPhaseColor } from '@/utils/projectPhases';

interface GanttChartProps {
  projects: Project[];
}

const GanttChart: React.FC<GanttChartProps> = ({ projects }) => {
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

    const startIndex = getTimePeriodIndex(project.plannedStartQuarter);
    const endIndex = getTimePeriodIndex(project.plannedEndQuarter);

    if (startIndex === -1 || endIndex === -1) return { left: 0, width: 0 };

    const left = (startIndex * 100) / totalPeriods;
    const width = ((endIndex - startIndex + 1) * 100) / totalPeriods;

    return { left, width };
  };

  const getActualProjectPosition = (project: Project) => {
    const totalPeriods = chartData.timeperiods.length;
    if (totalPeriods === 0) return { left: 0, width: 0 };

    const startIndex = getTimePeriodIndex(project.actualStartQuarter);
    const endIndex = getTimePeriodIndex(project.actualEndQuarter);

    if (startIndex === -1 || endIndex === -1) return { left: 0, width: 0 };

    const left = (startIndex * 100) / totalPeriods;
    const width = ((endIndex - startIndex + 1) * 100) / totalPeriods;

    return { left, width };
  };

  const getStatusColor = (status: string, completion: number) => {
    if (completion === 100) return 'bg-emerald-500';
    if (status === 'delayed') return 'bg-red-500';
    if (status === 'in-progress') return 'bg-osmanli-teal';
    
    // Proje fazına göre renk belirleme
    return getPhaseColor(completion);
  };

  // Get all projects including subprojects for the chart
  const allProjects = useMemo(() => {
    const result: Project[] = [];
    
    projects.filter(p => !p.isSubProject).forEach(project => {
      result.push(project);
      if (project.subProjects) {
        result.push(...project.subProjects);
      }
    });
    
    return result;
  }, [projects]);

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-osmanli-teal to-osmanli-teal-light text-white">
        <CardTitle className="font-poppins font-semibold">
          Gantt Chart (2024-2025 Roadmap)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {allProjects.length === 0 ? (
          <div className="text-center py-8 text-osmanli-text-muted">
            <div className="font-medium text-osmanli-text-dark mb-2">
              Projeler eklendikçe Gantt chart burada görünecek
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Timeline header */}
            <div className="flex border-b-2 border-osmanli-teal/20 pb-3">
              <div className="w-48 font-poppins font-semibold text-osmanli-text-dark">Proje</div>
              <div className="flex-1 relative">
                <div className="flex">
                  {chartData.timeperiods.map((period) => (
                    <div 
                      key={period.value}
                      className="flex-1 text-xs text-center border-l border-gray-200 px-1 font-medium text-osmanli-text-dark"
                    >
                      {period.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project rows */}
            {allProjects.map((project) => {
              const plannedPosition = getProjectPosition(project);
              const actualPosition = getActualProjectPosition(project);
              return (
                <div key={project.id} className="flex items-center py-3 hover:bg-osmanli-bg-light/50 rounded-lg transition-colors">
                  <div className="w-48 pr-4">
                    <div className={`font-poppins font-medium text-sm ${project.isSubProject ? 'pl-4 text-osmanli-text-muted' : 'text-osmanli-text-dark'}`}>
                      {project.isSubProject && '└ '}
                      {project.name}
                    </div>
                    <div className="text-xs text-osmanli-teal font-medium">
                      %{project.completionPercentage}
                    </div>
                  </div>
                  <div className="flex-1 relative h-12">
                    {/* Planned timeline (lighter background) */}
                    <div 
                      className="absolute h-4 rounded-md bg-gray-300 opacity-60 top-0"
                      style={{
                        left: `${plannedPosition.left}%`,
                        width: `${plannedPosition.width}%`,
                      }}
                      title={`Plan: ${project.plannedStartQuarter} - ${project.plannedEndQuarter}`}
                    />
                    
                    {/* Actual timeline */}
                    <div 
                      className={`absolute h-4 rounded-md ${getStatusColor(project.status, project.completionPercentage)} opacity-90 flex items-center justify-center top-6 shadow-sm`}
                      style={{
                        left: `${actualPosition.left}%`,
                        width: `${actualPosition.width}%`,
                      }}
                      title={`Gerçek: ${project.actualStartQuarter} - ${project.actualEndQuarter}`}
                    >
                      <span className="text-white text-xs font-medium">
                        %{project.completionPercentage}
                      </span>
                    </div>
                    
                    {/* Progress overlay */}
                    {project.completionPercentage > 0 && project.completionPercentage < 100 && (
                      <div 
                        className="absolute h-4 rounded-md bg-emerald-500 opacity-70 top-6"
                        style={{
                          left: `${actualPosition.left}%`,
                          width: `${(actualPosition.width * project.completionPercentage) / 100}%`,
                        }}
                      />
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

export default GanttChart;
