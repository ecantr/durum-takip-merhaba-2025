
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/pages/Roadmap';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (project: Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    plannedStartQuarter: '2024',
    plannedEndQuarter: 'Q1-2025',
    actualStartQuarter: '2024',
    actualEndQuarter: 'Q1-2025',
    year: 2025, // Sabit değer olarak tutuyoruz
    completionPercentage: 0,
    category: '',
    responsible: '',
    status: 'not-started' as 'not-started' | 'in-progress' | 'completed' | 'delayed',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        plannedStartQuarter: project.plannedStartQuarter,
        plannedEndQuarter: project.plannedEndQuarter,
        actualStartQuarter: project.actualStartQuarter,
        actualEndQuarter: project.actualEndQuarter,
        year: project.year,
        completionPercentage: project.completionPercentage,
        category: project.category,
        responsible: project.responsible,
        status: project.status,
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const dateOptions = [
    { value: '2024', label: '2024' },
    { value: 'Q1-2025', label: '2025 Q1 (Ocak-Mart)' },
    { value: 'Q2-2025', label: '2025 Q2 (Nisan-Haziran)' },
    { value: 'Q3-2025', label: '2025 Q3 (Temmuz-Eylül)' },
    { value: 'Q4-2025', label: '2025 Q4 (Ekim-Aralık)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Proje Adı</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="ör: IT, Pazarlama, İK"
          />
        </div>
        <div>
          <Label htmlFor="responsible">Sorumlu</Label>
          <Input
            id="responsible"
            value={formData.responsible}
            onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
            placeholder="Sorumlu kişi/ekip"
          />
        </div>
        <div>
          <Label htmlFor="completion">Tamamlanma Oranı (%)</Label>
          <Input
            id="completion"
            type="number"
            min="0"
            max="100"
            value={formData.completionPercentage}
            onChange={(e) => setFormData({ ...formData, completionPercentage: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Tarih Seçimleri */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Tarih Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="plannedStartQuarter">Planlanan Başlangıç Tarihi</Label>
            <Select 
              value={formData.plannedStartQuarter} 
              onValueChange={(value) => setFormData({ ...formData, plannedStartQuarter: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="plannedEndQuarter">Planlanan Bitiş Tarihi</Label>
            <Select 
              value={formData.plannedEndQuarter} 
              onValueChange={(value) => setFormData({ ...formData, plannedEndQuarter: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="actualStartQuarter">Gerçekleşen Başlangıç Tarihi</Label>
            <Select 
              value={formData.actualStartQuarter} 
              onValueChange={(value) => setFormData({ ...formData, actualStartQuarter: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="actualEndQuarter">Gerçekleşen Bitiş Tarihi</Label>
            <Select 
              value={formData.actualEndQuarter} 
              onValueChange={(value) => setFormData({ ...formData, actualEndQuarter: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="status">Durum</Label>
        <Select value={formData.status} onValueChange={(value: 'not-started' | 'in-progress' | 'completed' | 'delayed') => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-started">Başlanmadı</SelectItem>
            <SelectItem value="in-progress">Devam Ediyor</SelectItem>
            <SelectItem value="completed">Tamamlandı</SelectItem>
            <SelectItem value="delayed">Gecikmiş</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit">
          {project ? 'Güncelle' : 'Ekle'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
