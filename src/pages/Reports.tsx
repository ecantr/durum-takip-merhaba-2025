
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { projectService, type Project } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import ProjectDelayChart from '@/components/reports/ProjectDelayChart';
import ProjectSummaryStats from '@/components/reports/ProjectSummaryStats';

const Reports = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      console.log('Projeler raporlama için yükleniyor...');
      const loadedProjects = await projectService.getAllProjects();
      console.log('Yüklenen projeler:', loadedProjects.length);
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Projeler yüklenirken hata:', error);
      toast({
        title: "Hata",
        description: "Projeler yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Raporlar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Proje Raporları</h1>
          <p className="text-muted-foreground">
            Proje performansı ve sarkma analizleri
            {projects.length > 0 && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {projects.length} proje analiz ediliyor
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <ProjectSummaryStats projects={projects} />
        
        <Card>
          <CardHeader>
            <CardTitle>Proje Sarkma Analizi</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectDelayChart projects={projects} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
