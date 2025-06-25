
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Project } from '@/pages/Roadmap';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onEdit, onDelete }) => {
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
      default: return 'Başlanmadı';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeler ({projects.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Henüz proje eklenmedi. Yeni proje eklemek için yukarıdaki butonu kullanın.
          </p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium">{project.name}</h4>
                  {project.category && (
                    <p className="text-sm text-muted-foreground">{project.category}</p>
                  )}
                </div>
                <div className="flex gap-1">
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
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
                <span className="text-sm font-medium">
                  %{project.completionPercentage}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {project.startDate.toLocaleDateString('tr-TR')} - {project.endDate.toLocaleDateString('tr-TR')}
              </div>
              
              {project.responsible && (
                <div className="text-xs text-muted-foreground">
                  Sorumlu: {project.responsible}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectList;
