
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, BookOpen, BarChart3, LogOut, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  type: string;
  name: string;
  surname: string;
  email: string;
  teacherCode: string;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.type === 'teacher') {
        setUser(userData);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success("Başarıyla çıkış yapıldı!");
    navigate('/');
  };

  const copyTeacherCode = () => {
    if (user?.teacherCode) {
      navigator.clipboard.writeText(user.teacherCode);
      setCopied(true);
      toast.success("Öğretmen kodu kopyalandı!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Demo data for students and analytics
  const demoStudents = [
    { id: 1, name: "Ahmet Yılmaz", grade: "6", experimentsCompleted: 3, totalExperiments: 6, lastActivity: "2 saat önce" },
    { id: 2, name: "Zeynep Kaya", grade: "6", experimentsCompleted: 5, totalExperiments: 6, lastActivity: "1 gün önce" },
    { id: 3, name: "Mehmet Demir", grade: "6", experimentsCompleted: 2, totalExperiments: 6, lastActivity: "3 gün önce" },
    { id: 4, name: "Ayşe Şahin", grade: "6", experimentsCompleted: 4, totalExperiments: 6, lastActivity: "1 saat önce" },
  ];

  const classStats = {
    totalStudents: demoStudents.length,
    avgCompletion: Math.round((demoStudents.reduce((acc, student) => acc + (student.experimentsCompleted / student.totalExperiments * 100), 0) / demoStudents.length)),
    activeToday: 2,
    totalExperiments: 24
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Users className="h-8 w-8 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Sanal Laboratuvar</h1>
                <p className="text-purple-300 text-sm">Öğretmen Paneli</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user.name} {user.surname}</p>
                <p className="text-purple-300 text-sm">Öğretmen</p>
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
            Hoş geldiniz, {user.name}! 👨‍🏫
          </h2>
          <p className="text-purple-200">
            Sınıfınızın fen bilimleri performansını takip edin ve öğrencilerinizin gelişimini izleyin.
          </p>
        </div>

        {/* Teacher Code Section */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Öğretmen Kodunuz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg">
              <div>
                <p className="text-white text-2xl font-mono font-bold">{user.teacherCode}</p>
                <p className="text-purple-200 text-sm mt-1">
                  Öğrencileriniz bu kodu kayıt sırasında girmelidir
                </p>
              </div>
              <Button 
                onClick={copyTeacherCode}
                className="bg-white/10 hover:bg-white/20 border border-white/20"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Toplam Öğrenci</p>
                  <p className="text-3xl font-bold text-white">{classStats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Ortalama Başarı</p>
                  <p className="text-3xl font-bold text-white">%{classStats.avgCompletion}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Bugün Aktif</p>
                  <p className="text-3xl font-bold text-white">{classStats.activeToday}</p>
                </div>
                <BookOpen className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Toplam Deney</p>
                  <p className="text-3xl font-bold text-white">{classStats.totalExperiments}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
            <TabsTrigger 
              value="students"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Öğrenci Listesi
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analitik Raporlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Sınıfımdaki Öğrenciler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{student.name}</h3>
                          <p className="text-purple-200 text-sm">{student.grade}. Sınıf</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-white font-semibold">{student.experimentsCompleted}/{student.totalExperiments}</p>
                          <p className="text-purple-200 text-xs">Deney Tamamlandı</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-white font-semibold">%{Math.round((student.experimentsCompleted / student.totalExperiments) * 100)}</p>
                          <p className="text-purple-200 text-xs">Başarı Oranı</p>
                        </div>
                        
                        <Badge 
                          variant="outline" 
                          className="border-purple-500/30 text-purple-300"
                        >
                          {student.lastActivity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Sınıf Performansı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Suda Çözünürlük</span>
                      <span className="text-green-400 font-semibold">%85</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Asit-Baz İndikatörleri</span>
                      <span className="text-yellow-400 font-semibold">%72</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Karışımları Ayırma</span>
                      <span className="text-red-400 font-semibold">%58</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Elektrik Devresi</span>
                      <span className="text-gray-400 font-semibold">Henüz yok</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Haftalık Aktivite</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Pazartesi</span>
                      <span className="text-white font-semibold">12 deney</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Salı</span>
                      <span className="text-white font-semibold">8 deney</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Çarşamba</span>
                      <span className="text-white font-semibold">15 deney</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Perşembe</span>
                      <span className="text-white font-semibold">6 deney</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Cuma</span>
                      <span className="text-white font-semibold">10 deney</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;
