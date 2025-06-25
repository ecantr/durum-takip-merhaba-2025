
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
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {PROJECT_PHASES.map((phase) => (
            <div key={phase.id} className="flex items-center gap-2 text-sm">
              <Badge className={`${phase.bgColor} text-white`}>
                %{phase.minPercentage}-{phase.maxPercentage}
              </Badge>
              <span className="text-gray-600">{phase.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectPhaseInfo;
