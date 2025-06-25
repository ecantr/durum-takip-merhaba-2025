
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/pages/Roadmap';

interface GanttChartProps {
  projects: Project[];
}

const GanttChart: React.FC<GanttChartProps> = ({ projects }) => {
  const chartData = useMemo(() => {
    if (projects.length === 0) return { months: [], yearRange: '' };

    // Find the earliest start date and latest end date
    const allDates = projects.flatMap(p => [p.startDate, p.endDate]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

    // Generate months between min and max date
    const months = [];
    const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);

    while (current <= end) {
      months.push({
        year: current.getFullYear(),
        month: current.getMonth(),
        name: current.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })
      });
      current.setMonth(current.getMonth() + 1);
    }

    return {
      months,
      yearRange: `${minDate.getFullYear()} - ${maxDate.getFullYear()}`
    };
  }, [projects]);

  const getProjectPosition = (project: Project) => {
    const totalMonths = chartData.months.length;
    if (totalMonths === 0) return { left: 0, width: 0 };

    const startMonth = chartData.months.findIndex(m => 
      m.year === project.startDate.getFullYear() && 
      m.month === project.startDate.getMonth()
    );
    const endMonth = chartData.months.findIndex(m => 
      m.year === project.endDate.getFullYear() && 
      m.month === project.endDate.getMonth()
    );

    const left = (startMonth * 100) / totalMonths;
    const width = ((endMonth - startMonth + 1) * 100) / totalMonths;

    return { left, width };
  };

  const getStatusColor = (status: string, completion: number) => {
    if (completion === 100) return 'bg-green-500';
    if (status === 'delayed') return 'bg-red-500';
    if (status === 'in-progress') return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gantt Chart {chartData.yearRange && `(${chartData.yearRange})`}</CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
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
                  {chartData.months.map((month, index) => (
                    <div 
                      key={`${month.year}-${month.month}`}
                      className="flex-1 text-xs text-center border-l border-gray-200 px-1"
                    >
                      {month.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project rows */}
            {projects.map((project) => {
              const position = getProjectPosition(project);
              return (
                <div key={project.id} className="flex items-center py-2 hover:bg-gray-50">
                  <div className="w-48 pr-4">
                    <div className="font-medium text-sm">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      %{project.completionPercentage}
                    </div>
                  </div>
                  <div className="flex-1 relative h-8">
                    <div 
                      className={`absolute h-6 rounded ${getStatusColor(project.status, project.completionPercentage)} opacity-80 flex items-center justify-center`}
                      style={{
                        left: `${position.left}%`,
                        width: `${position.width}%`,
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        %{project.completionPercentage}
                      </span>
                    </div>
                    {/* Progress overlay */}
                    {project.completionPercentage > 0 && project.completionPercentage < 100 && (
                      <div 
                        className="absolute h-6 rounded bg-green-500 opacity-60"
                        style={{
                          left: `${position.left}%`,
                          width: `${(position.width * project.completionPercentage) / 100}%`,
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
