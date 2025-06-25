
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
    startQuarter: 'Q1',
    endQuarter: 'Q1',
    year: 2025,
    completionPercentage: 0,
    category: '',
    responsible: '',
    status: 'not-started' as 'not-started' | 'in-progress' | 'completed' | 'delayed',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        startQuarter: project.startQuarter,
        endQuarter: project.endQuarter,
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
    onSubmit({
      name: formData.name,
      startQuarter: formData.startQuarter,
      endQuarter: formData.endQuarter,
      year: formData.year,
      completionPercentage: formData.completionPercentage,
      category: formData.category,
      responsible: formData.responsible,
      status: formData.status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <Label htmlFor="year">Yıl</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2025 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="startQuarter">Başlangıç Çeyreği</Label>
          <Select value={formData.startQuarter} onValueChange={(value) => setFormData({ ...formData, startQuarter: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q1">Q1</SelectItem>
              <SelectItem value="Q2">Q2</SelectItem>
              <SelectItem value="Q3">Q3</SelectItem>
              <SelectItem value="Q4">Q4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="endQuarter">Bitiş Çeyreği</Label>
          <Select value={formData.endQuarter} onValueChange={(value) => setFormData({ ...formData, endQuarter: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q1">Q1</SelectItem>
              <SelectItem value="Q2">Q2</SelectItem>
              <SelectItem value="Q3">Q3</SelectItem>
              <SelectItem value="Q4">Q4</SelectItem>
            </SelectContent>
          </Select>
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
