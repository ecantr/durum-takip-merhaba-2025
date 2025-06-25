
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PROJECT_PHASES } from '@/utils/projectPhases';

const ProjectPhaseInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Proje Süreç Aralıkları</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {PROJECT_PHASES.map((phase) => (
            <div key={phase.id} className="flex items-center gap-2 text-xs">
              <Badge className={`${phase.bgColor} text-white`}>
                %{phase.minPercentage}-{phase.maxPercentage}
              </Badge>
              <span className="text-muted-foreground">{phase.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectPhaseInfo;
