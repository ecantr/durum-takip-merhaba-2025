import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { parseCSVData, ImportResult } from '@/utils/csvImport';
import { Project } from '@/services/projectService';

interface CSVImportProps {
  onImport: (projects: Project[]) => void;
  onClose: () => void;
}

const CSVImport: React.FC<CSVImportProps> = ({ onImport, onClose }) => {
  const [csvText, setCsvText] = useState('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = () => {
    if (!csvText.trim()) {
      setImportResult({
        success: false,
        projects: [],
        errors: ['Lütfen import edilecek veriyi girin'],
        totalRows: 0,
        successfulRows: 0
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = parseCSVData(csvText);
      setImportResult(result);
      
      if (result.success && result.projects.length > 0) {
        onImport(result.projects);
      }
    } catch (error) {
      setImportResult({
        success: false,
        projects: [],
        errors: [error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'],
        totalRows: 0,
        successfulRows: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleData = `1	Tezgahüstü Ödünç Sistemi	Q1	Q3	Q1	Q4	Merve Nur Öztürk - Emre Can Tuncer	20%
16	Osmanlı Mobil						
	Osmanlı Şifre faz2		Q1-Q2-Q3-Q4	2024	Q3	Merve Nur Öztürk	80%
	Görüntülü Hesap Aç Osmanlı Mobil Entegrasyonu	2024 Devam ediyor	Q1	2024	Q3	Merve Nur Öztürk	80%
17	Zorunlu dokümanlar						
	FAZ-1 Birinci Grup			2024	Q1	Merve Nur Öztürk - Ürün Geliştirme	100%
	FAZ-1 İkinci Grup			2024	Q1	Merve Nur Öztürk - Ürün Geliştirme	100%`;

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Toplu Proje İthalat
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Proje verilerinizi tab veya virgül ile ayrılmış format halinde yapıştırın. 
          Satır başında numara olan projeler ana proje, numarasız olanlar alt proje olarak içe aktarılır.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Proje Verileri</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCsvText(sampleData)}
              className="text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Örnek Veri
            </Button>
          </div>
          <Textarea
            placeholder="Proje verilerinizi buraya yapıştırın... 
Format: [Numara] Proje Adı [TAB] Planlanan Başlangıç [TAB] Planlanan Bitiş [TAB] Gerçek Başlangıç [TAB] Gerçek Bitiş [TAB] Sorumlu [TAB] Tamamlanma %

Not: Satır başında numara olan projeler ana proje, numara olmayan projeler alt proje olarak içe aktarılır."
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            <strong>Ana Projeler:</strong> Satır başında numara ile başlayan projeler<br />
            <strong>Alt Projeler:</strong> Numarasız, ana projeyi takip eden projeler
          </p>
        </div>

        {importResult && (
          <Alert className={importResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <div className="flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <AlertDescription>
                {importResult.success ? (
                  <div>
                    <strong>İthalat Başarılı!</strong>
                    <p>{importResult.successfulRows} proje başarıyla içe aktarıldı.</p>
                  </div>
                ) : (
                  <div>
                    <strong>İthalat Hatası</strong>
                    <ul className="mt-2 list-disc list-inside">
                      {importResult.errors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button 
            onClick={handleImport}
            disabled={isLoading || !csvText.trim()}
          >
            {isLoading ? 'İçe Aktarılıyor...' : 'İçe Aktar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVImport;
