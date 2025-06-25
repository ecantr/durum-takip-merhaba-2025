
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart3, Users, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Proje Roadmap Yöneticisi
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            2025 projelerinizi takip edin, planlayın ve Gantt chart ile görselleştirin
          </p>
          <Link to="/roadmap">
            <Button size="lg" className="text-lg px-8 py-3">
              Roadmap'e Başla
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="w-12 h-12 mx-auto text-blue-600" />
              <CardTitle className="text-lg">Proje Planlama</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Projelerinizi tarih aralıkları ile planlayın
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 mx-auto text-green-600" />
              <CardTitle className="text-lg">Gantt Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Projelerinizi görsel Gantt chart ile takip edin
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="w-12 h-12 mx-auto text-purple-600" />
              <CardTitle className="text-lg">İlerleme Takibi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tamamlanma yüzdelerini güncelleyin
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-orange-600" />
              <CardTitle className="text-lg">Ekip Yönetimi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sorumluluk alanlarını belirleyin
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Özellikler
          </h2>
          <div className="max-w-3xl mx-auto text-gray-600 space-y-2">
            <p>✅ Sürükle-bırak ile kolay proje yönetimi</p>
            <p>✅ Türkçe tarih formatları ve arayüz</p>
            <p>✅ Responsive tasarım - her cihazda çalışır</p>
            <p>✅ Renk kodlu proje durumları</p>
            <p>✅ Tamamlanma yüzdesi takibi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
