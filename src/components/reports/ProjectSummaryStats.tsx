
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '@/services/projectService';

interface ProjectSummaryStatsProps {
  projects: Project[];
}

const ProjectSummaryStats: React.FC<ProjectSummaryStatsProps> = ({ projects }) => {
  const quarterToNumber = (quarter: string): number => {
    const match = quarter.match(/Q(\d)/i);
    return match ? parseInt(match[1]) : 0;
  };

  const calculateDelay = (planned: string, actual: string): number => {
    const plannedNum = quarterToNumber(planned);
    const actualNum = quarterToNumber(actual);
    return actualNum - plannedNum;
  };

  const mainProjects = projects.filter(project => !project.isSubProject);
  
  const delayedProjects = mainProjects.filter(project => {
    const endDelay = calculateDelay(project.plannedEndQuarter, project.actualEndQuarter);
    return endDelay > 0;
  });

  const onTimeProjects = mainProjects.filter(project => {
    const endDelay = calculateDelay(project.plannedEndQuarter, project.actualEndQuarter);
    return endDelay === 0;
  });

  const earlyProjects = mainProjects.filter(project => {
    const endDelay = calculateDelay(project.plannedEndQuarter, project.actualEndQuarter);
    return endDelay < 0;
  });

  const averageCompletion = mainProjects.length > 0 
    ? Math.round(mainProjects.reduce((sum, project) => sum + project.completionPercentage, 0) / mainProjects.length)
    : 0;

  const maxDelay = mainProjects.length > 0 
    ? Math.max(...mainProjects.map(project => calculateDelay(project.plannedEndQuarter, project.actualEndQuarter)))
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Proje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{mainProjects.length}</div>
          <p className="text-xs text-muted-foreground">Ana projeler</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gecikmeli Projeler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{delayedProjects.length}</div>
          <p className="text-xs text-muted-foreground">
            %{mainProjects.length > 0 ? Math.round((delayedProjects.length / mainProjects.length) * 100) : 0} oranında
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Zamanında Projeler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{onTimeProjects.length + earlyProjects.length}</div>
          <p className="text-xs text-muted-foreground">
            %{mainProjects.length > 0 ? Math.round(((onTimeProjects.length + earlyProjects.length) / mainProjects.length) * 100) : 0} oranında
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ortalama Tamamlanma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">%{averageCompletion}</div>
          <p className="text-xs text-muted-foreground">
            Maks gecikme: {maxDelay} çeyrek
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSummaryStats;
