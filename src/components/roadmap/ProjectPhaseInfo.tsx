
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PROJECT_PHASES } from '@/utils/projectPhases';

const ProjectPhaseInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proje Süreç Aralıkları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {PROJECT_PHASES.map((phase) => (
          <div key={phase.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <Badge className={`${phase.bgColor} text-white min-w-fit`}>
              %{phase.minPercentage}-{phase.maxPercentage}
            </Badge>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{phase.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {phase.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectPhaseInfo;
