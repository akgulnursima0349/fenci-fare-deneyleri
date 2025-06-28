
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Beaker, FlaskConical, Microscope, Trophy, Clock, Star, LogOut, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  type: string;
  name: string;
  surname: string;
  grade: string;
  teacherCode: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.type === 'student') {
        setUser(userData);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Demo experiments based on grade
  const experiments = {
    "5": [
      { id: 1, title: "Suda Çözünürlük", description: "Farklı maddelerin suda çözünme özelliklerini keşfedelim", duration: "15 dk", difficulty: "Kolay", completed: false, locked: false },
      { id: 2, title: "Mıknatısın Özellikleri", description: "Mıknatısın çekim gücünü ve kutuplarını inceleyelim", duration: "20 dk", difficulty: "Kolay", completed: false, locked: false },
      { id: 3, title: "Işığın Yayılması", description: "Işığın düz çizgide yayıldığını gözlemleyelim", duration: "25 dk", difficulty: "Orta", completed: false, locked: true }
    ],
    "6": [
      { id: 4, title: "Asit-Baz İndikatörleri", description: "Doğal indikatörlerle asit ve bazları ayırt edelim", duration: "30 dk", difficulty: "Orta", completed: false, locked: false },
      { id: 5, title: "Karışımları Ayırma", description: "Filtreleme ve buharlaştırma yöntemlerini öğrenelim", duration: "35 dk", difficulty: "Orta", completed: false, locked: false },
      { id: 6, title: "Elektrik Devresi", description: "Basit elektrik devresi kurup ampul yakalım", duration: "25 dk", difficulty: "Orta", completed: false, locked: true }
    ],
    "7": [
      { id: 7, title: "Fotosentez Deneyi", description: "Bitkilerin oksijen üretimini gözlemleyelim", duration: "40 dk", difficulty: "Orta", completed: false, locked: false },
      { id: 8, title: "Yoğunluk Kulesi", description: "Farklı sıvıların yoğunluklarını karşılaştıralım", duration: "30 dk", difficulty: "Orta", completed: false, locked: false },
      { id: 9, title: "Kimyasal Reaksiyonlar", description: "Ekzotermik ve endotermik reaksiyonları inceleyelim", duration: "45 dk", difficulty: "Zor", completed: false, locked: true }
    ],
    "8": [
      { id: 10, title: "DNA Modeli", description: "DNA'nın yapısını anlayıp model oluşturalım", duration: "50 dk", difficulty: "Zor", completed: false, locked: false },
      { id: 11, title: "Atomun Yapısı", description: "Proton, nötron ve elektronları keşfedelim", duration: "35 dk", difficulty: "Zor", completed: false, locked: false },
      { id: 12, title: "Periyodik Tablo", description: "Elementlerin özelliklerini karşılaştıralım", duration: "40 dk", difficulty: "Zor", completed: false, locked: true }
    ]
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success("Başarıyla çıkış yapıldı!");
    navigate('/');
  };

  const startExperiment = (experimentId: number) => {
    navigate(`/experiment/${experimentId}`);
  };

  if (!user) return null;

  const userExperiments = experiments[user.grade as keyof typeof experiments] || [];
  const completedCount = userExperiments.filter(exp => exp.completed).length;
  const progressPercentage = (completedCount / userExperiments.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Beaker className="h-8 w-8 text-cyan-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Sanal Laboratuvar</h1>
                <p className="text-blue-300 text-sm">Öğrenci Paneli</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user.name} {user.surname}</p>
                <p className="text-blue-300 text-sm">{user.grade}. Sınıf</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Hoş geldin, {user.name}! 🧪
          </h2>
          <p className="text-blue-200">
            {user.grade}. sınıf deneylerinde bugün hangi keşifleri yapacaksın?
          </p>
        </div>

        {/* Progress Section */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
              İlerleme Durumun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Tamamlanan Deneyler</span>
                <span className="text-cyan-400 font-semibold">{completedCount}/{userExperiments.length}</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-300">%{Math.round(progressPercentage)} tamamlandı</span>
                <div className="flex items-center text-yellow-400">
                  <Star className="h-4 w-4 mr-1" />
                  <span>{completedCount * 10} puan</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experiments Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            {user.grade}. Sınıf Deneyleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userExperiments.map((experiment) => (
              <Card 
                key={experiment.id}
                className={`bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 ${
                  experiment.locked ? 'opacity-60' : 'hover:scale-105'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <FlaskConical className="h-6 w-6 text-green-400" />
                      {experiment.completed && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Tamamlandı
                        </Badge>
                      )}
                      {experiment.locked && (
                        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                          Kilitli
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">{experiment.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-200 text-sm">{experiment.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-blue-300">
                        <Clock className="h-4 w-4 mr-1" />
                        {experiment.duration}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${experiment.difficulty === 'Kolay' ? 'border-green-500/30 text-green-400' : ''}
                          ${experiment.difficulty === 'Orta' ? 'border-yellow-500/30 text-yellow-400' : ''}
                          ${experiment.difficulty === 'Zor' ? 'border-red-500/30 text-red-400' : ''}
                        `}
                      >
                        {experiment.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startExperiment(experiment.id)}
                    disabled={experiment.locked}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {experiment.completed ? 'Tekrar Yap' : 'Deneyi Başlat'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Microscope className="h-5 w-5 text-purple-400 mr-2" />
              Son Aktiviteler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white">Sisteme giriş yapıldı</span>
                </div>
                <span className="text-blue-300 text-sm">Şimdi</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white">Profil oluşturuldu</span>
                </div>
                <span className="text-blue-300 text-sm">Az önce</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;
