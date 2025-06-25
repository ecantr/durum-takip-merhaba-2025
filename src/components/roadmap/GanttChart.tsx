
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/pages/Roadmap';

interface GanttChartProps {
  projects: Project[];
}

const GanttChart: React.FC<GanttChartProps> = ({ projects }) => {
  const chartData = useMemo(() => {
    if (projects.length === 0) return { quarters: [], years: [] };

    // Get all main projects (not subprojects)
    const mainProjects = projects.filter(p => !p.isSubProject);
    
    if (mainProjects.length === 0) return { quarters: [], years: [] };

    // Find unique years
    const years = [...new Set(mainProjects.map(p => p.year))].sort();
    
    // Generate quarters for each year
    const quarters = [];
    for (const year of years) {
      quarters.push(
        { year, quarter: 'Q1', label: `${year} Q1` },
        { year, quarter: 'Q2', label: `${year} Q2` },
        { year, quarter: 'Q3', label: `${year} Q3` },
        { year, quarter: 'Q4', label: `${year} Q4` }
      );
    }

    return { quarters, years };
  }, [projects]);

  const getQuarterIndex = (year: number, quarter: string) => {
    return chartData.quarters.findIndex(q => q.year === year && q.quarter === quarter);
  };

  const getProjectPosition = (project: Project) => {
    const totalQuarters = chartData.quarters.length;
    if (totalQuarters === 0) return { left: 0, width: 0 };

    const startIndex = getQuarterIndex(project.year, project.plannedStartQuarter);
    const endIndex = getQuarterIndex(project.year, project.plannedEndQuarter);

    if (startIndex === -1 || endIndex === -1) return { left: 0, width: 0 };

    const left = (startIndex * 100) / totalQuarters;
    const width = ((endIndex - startIndex + 1) * 100) / totalQuarters;

    return { left, width };
  };

  const getActualProjectPosition = (project: Project) => {
    const totalQuarters = chartData.quarters.length;
    if (totalQuarters === 0) return { left: 0, width: 0 };

    const startIndex = getQuarterIndex(project.year, project.actualStartQuarter);
    const endIndex = getQuarterIndex(project.year, project.actualEndQuarter);

    if (startIndex === -1 || endIndex === -1) return { left: 0, width: 0 };

    const left = (startIndex * 100) / totalQuarters;
    const width = ((endIndex - startIndex + 1) * 100) / totalQuarters;

    return { left, width };
  };

  const getStatusColor = (status: string, completion: number) => {
    if (completion === 100) return 'bg-green-500';
    if (status === 'delayed') return 'bg-red-500';
    if (status === 'in-progress') return 'bg-blue-500';
    return 'bg-gray-400';
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
    <Card>
      <CardHeader>
        <CardTitle>
          Gantt Chart {chartData.years.length > 0 && `(${chartData.years.join(', ')})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allProjects.length === 0 ? (
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
                  {chartData.quarters.map((quarter, index) => (
                    <div 
                      key={`${quarter.year}-${quarter.quarter}`}
                      className="flex-1 text-xs text-center border-l border-gray-200 px-1"
                    >
                      {quarter.label}
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
                <div key={project.id} className="flex items-center py-2 hover:bg-gray-50">
                  <div className="w-48 pr-4">
                    <div className={`font-medium text-sm ${project.isSubProject ? 'pl-4 text-gray-600' : ''}`}>
                      {project.isSubProject && '└ '}
                      {project.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      %{project.completionPercentage}
                    </div>
                  </div>
                  <div className="flex-1 relative h-12">
                    {/* Planned timeline (lighter background) */}
                    <div 
                      className="absolute h-4 rounded bg-gray-300 opacity-60 top-0"
                      style={{
                        left: `${plannedPosition.left}%`,
                        width: `${plannedPosition.width}%`,
                      }}
                      title={`Plan: ${project.plannedStartQuarter} - ${project.plannedEndQuarter}`}
                    />
                    
                    {/* Actual timeline */}
                    <div 
                      className={`absolute h-4 rounded ${getStatusColor(project.status, project.completionPercentage)} opacity-80 flex items-center justify-center top-6`}
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
                        className="absolute h-4 rounded bg-green-500 opacity-60 top-6"
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
