
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
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
    if (planned === actual) return 0;
    
    const plannedNum = quarterToNumber(planned);
    const actualNum = quarterToNumber(actual);
    
    if (plannedNum === 0 || actualNum === 0) return 0;
    
    return actualNum - plannedNum;
  };

  const mainProjects = projects.filter(project => !project.isSubProject);

  // Bar chart data - tüm projeler için
  const chartData = mainProjects.map(project => {
    const startDelay = calculateDelay(project.plannedStartQuarter, project.actualStartQuarter);
    const endDelay = calculateDelay(project.plannedEndQuarter, project.actualEndQuarter);
    
    return {
      name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
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
  });

  // Pie chart data - proje durumları için
  const statusData = [
    { name: 'Gecikmeli', value: mainProjects.filter(p => calculateDelay(p.plannedEndQuarter, p.actualEndQuarter) > 0).length, color: '#ef4444' },
    { name: 'Zamanında', value: mainProjects.filter(p => calculateDelay(p.plannedEndQuarter, p.actualEndQuarter) === 0).length, color: '#22c55e' },
    { name: 'Erken', value: mainProjects.filter(p => calculateDelay(p.plannedEndQuarter, p.actualEndQuarter) < 0).length, color: '#3b82f6' }
  ].filter(item => item.value > 0);

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

  return (
    <div className="space-y-6">
      {/* Proje Durumu Dağılımı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Proje Durumu Dağılımı</h3>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Proje Listesi */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Proje Durumları</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {mainProjects.map((project, index) => {
              const endDelay = calculateDelay(project.plannedEndQuarter, project.actualEndQuarter);
              let statusColor = 'text-green-600';
              let statusText = 'Zamanında';
              
              if (endDelay > 0) {
                statusColor = 'text-red-600';
                statusText = `${endDelay} çeyrek gecikmeli`;
              } else if (endDelay < 0) {
                statusColor = 'text-blue-600';
                statusText = `${Math.abs(endDelay)} çeyrek erken`;
              }

              return (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-gray-500">%{project.completionPercentage} tamamlandı</p>
                  </div>
                  <span className={`text-sm font-medium ${statusColor}`}>
                    {statusText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detaylı Sarkma Analizi */}
      {chartData.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Detaylı Sarkma Analizi</h3>
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
        </div>
      )}
    </div>
  );
};

export default ProjectDelayChart;
