
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, BarChart3, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Proje Roadmap Sistemi</h1>
            <nav className="flex gap-4">
              <Link to="/roadmap">
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Roadmap
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Raporlar
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            2025 Proje Roadmap Yönetimi
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Projelerinizi planlayın, takip edin ve görselleştirin. Gantt chart ile projelerinizi kolayca yönetin.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/roadmap">
              <Button size="lg" className="flex items-center gap-2">
                Roadmap'e Git
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/reports">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                Raporları Görüntüle
                <BarChart3 className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Proje Planlama
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Projelerinizi çeyrek bazında planlayın. Başlangıç ve bitiş tarihlerini belirleyin.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Görsel Takip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Gantt chart ile projelerinizi görsel olarak takip edin. İlerleme durumunu kolayca görün.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Esnek Yönetim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sürükle-bırak ile proje sıralaması, alt projeler ve detaylı raporlama özellikleri.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 Proje Roadmap Sistemi. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
