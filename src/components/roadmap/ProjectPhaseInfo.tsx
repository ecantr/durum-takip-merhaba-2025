
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PROJECT_PHASES } from '@/utils/projectPhases';

const ProjectPhaseInfo: React.FC = () => {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4 bg-gradient-to-r from-osmanli-teal to-osmanli-teal-light text-white">
        <CardTitle className="text-lg font-poppins font-semibold">Proje Süreç Aralıkları</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-3">
          {PROJECT_PHASES.map((phase) => (
            <div key={phase.id} className="flex items-center gap-2 text-sm">
              <Badge className={`${phase.bgColor} text-white font-medium px-3 py-1`}>
                %{phase.minPercentage}-{phase.maxPercentage}
              </Badge>
              <span className="text-osmanli-text-muted font-inter">{phase.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectPhaseInfo;
