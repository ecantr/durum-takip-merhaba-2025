
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { Project } from '@/services/projectService';

interface ProjectDelayChartProps {
  projects: Project[];
}

const ProjectDelayChart: React.FC<ProjectDelayChartProps> = ({ projects }) => {
  const quarterToNumber = (quarter: string): number => {
    const match = quarter.match(/Q(\d)/i);
    return match ? parseInt(match[1]) : 0;
  };

  const calculateDelay = (planned: string, actual: string): number => {
    // Eğer planlanmış ve gerçekleşen aynıysa gecikme yok
    if (planned === actual) return 0;
    
    const plannedNum = quarterToNumber(planned);
    const actualNum = quarterToNumber(actual);
    
    // Eğer değerler geçersizse gecikme hesaplanamaz
    if (plannedNum === 0 || actualNum === 0) return 0;
    
    return actualNum - plannedNum;
  };

  const chartData = projects
    .filter(project => !project.isSubProject) // Sadece ana projeler
    .map(project => {
      const startDelay = calculateDelay(project.plannedStartQuarter, project.actualStartQuarter);
      const endDelay = calculateDelay(project.plannedEndQuarter, project.actualEndQuarter);
      
      return {
        name: project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name,
        fullName: project.name,
        'Başlangıç Sarkması': startDelay,
        'Bitiş Sarkması': endDelay,
        plannedStart: project.plannedStartQuarter,
        actualStart: project.actualStartQuarter,
        plannedEnd: project.plannedEndQuarter,
        actualEnd: project.actualEndQuarter,
        status: project.status,
        completion: project.completionPercentage
      };
    })
    .filter(item => item['Başlangıç Sarkması'] !== 0 || item['Bitiş Sarkması'] !== 0) // Sadece gecikme/erken bitirme olan projeleri göster
    .sort((a, b) => Math.abs(b['Bitiş Sarkması']) - Math.abs(a['Bitiş Sarkması'])); // En çok sarkan projeler önce

  const chartConfig = {
    'Başlangıç Sarkması': {
      label: 'Başlangıç Sarkması',
      color: '#3b82f6',
    },
    'Bitiş Sarkması': {
      label: 'Bitiş Sarkması',
      color: '#ef4444',
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-sm text-gray-600 mb-2">Durum: {data.status}</p>
          <p className="text-sm text-gray-600 mb-2">Tamamlanma: %{data.completion}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Planlanan Başlangıç:</span> {data.plannedStart}
            </p>
            <p className="text-sm">
              <span className="font-medium">Gerçekleşen Başlangıç:</span> {data.actualStart}
            </p>
            <p className="text-sm">
              <span className="font-medium">Planlanan Bitiş:</span> {data.plannedEnd}
            </p>
            <p className="text-sm">
              <span className="font-medium">Gerçekleşen Bitiş:</span> {data.actualEnd}
            </p>
          </div>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                <span className="font-medium">{entry.dataKey}:</span> {entry.value} çeyrek
                {entry.value > 0 && ' (gecikmeli)'}
                {entry.value < 0 && ' (erken)'}
                {entry.value === 0 && ' (zamanında)'}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Henüz analiz edilecek proje bulunmuyor.
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Gecikme veya erken bitirme olan proje bulunmuyor. Tüm projeler zamanında tamamlanmış.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis 
            label={{ value: 'Çeyrek Sarkması', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="Başlangıç Sarkması" 
            fill="#3b82f6" 
            name="Başlangıç Sarkması"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="Bitiş Sarkması" 
            fill="#ef4444" 
            name="Bitiş Sarkması"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ProjectDelayChart;
