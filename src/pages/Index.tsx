
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Beaker, Microscope, Atom, FlaskConical, BookOpen, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [studentForm, setStudentForm] = useState({
    name: "",
    surname: "",
    grade: "",
    teacherCode: ""
  });
  
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: ""
  });

  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.surname || !studentForm.grade || !studentForm.teacherCode) {
      toast.error("Lütfen tüm alanları doldurun!");
      return;
    }
    
    // Store student data in localStorage for demo
    localStorage.setItem('user', JSON.stringify({
      type: 'student',
      name: studentForm.name,
      surname: studentForm.surname,
      grade: studentForm.grade,
      teacherCode: studentForm.teacherCode
    }));
    
    toast.success("Kayıt başarılı! Hoş geldiniz " + studentForm.name + "!");
    navigate('/student-dashboard');
  };

  const handleTeacherRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.surname || !teacherForm.email || !teacherForm.password) {
      toast.error("Lütfen tüm alanları doldurun!");
      return;
    }
    
    // Generate teacher code
    const teacherCode = "OGR" + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Store teacher data in localStorage for demo
    localStorage.setItem('user', JSON.stringify({
      type: 'teacher',
      name: teacherForm.name,
      surname: teacherForm.surname,
      email: teacherForm.email,
      teacherCode: teacherCode
    }));
    
    toast.success(`Kayıt başarılı! Öğretmen kodunuz: ${teacherCode}`);
    navigate('/teacher-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-400/20 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Beaker className="h-10 w-10 text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Sanal Laboratuvar</h1>
              <p className="text-blue-300 text-sm">Fen Bilimleri Keşif Merkezi</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <Microscope className="h-5 w-5" />
            <span className="text-sm">v1.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Atom className="h-16 w-16 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <FlaskConical className="h-12 w-12 text-green-400 animate-bounce" />
            <Microscope className="h-14 w-14 text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Hoş Geldiniz!
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Fen bilimlerini keşfetmeye hazır mısınız? Sanal laboratuvarımızda güvenli ve eğlenceli deneyler sizi bekliyor!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
              <TabsTrigger 
                value="student" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Öğrenci Girişi
              </TabsTrigger>
              <TabsTrigger 
                value="teacher"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                Öğretmen Girişi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="mt-8">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white flex items-center justify-center space-x-2">
                    <BookOpen className="h-6 w-6 text-cyan-400" />
                    <span>Öğrenci Kayıt</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStudentRegister} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="student-name" className="text-white">Ad</Label>
                        <Input
                          id="student-name"
                          value={studentForm.name}
                          onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="Adınızı girin"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student-surname" className="text-white">Soyad</Label>
                        <Input
                          id="student-surname"
                          value={studentForm.surname}
                          onChange={(e) => setStudentForm({...studentForm, surname: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="Soyadınızı girin"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="grade" className="text-white">Sınıf Seviyesi</Label>
                      <Select onValueChange={(value) => setStudentForm({...studentForm, grade: value})}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Sınıfınızı seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5. Sınıf</SelectItem>
                          <SelectItem value="6">6. Sınıf</SelectItem>
                          <SelectItem value="7">7. Sınıf</SelectItem>
                          <SelectItem value="8">8. Sınıf</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="teacher-code" className="text-white">Öğretmen Kodu</Label>
                      <Input
                        id="teacher-code"
                        value={studentForm.teacherCode}
                        onChange={(e) => setStudentForm({...studentForm, teacherCode: e.target.value.toUpperCase()})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Öğretmeninizin verdiği kodu girin"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Kayıt Ol ve Deneylere Başla!
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teacher" className="mt-8">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white flex items-center justify-center space-x-2">
                    <Users className="h-6 w-6 text-purple-400" />
                    <span>Öğretmen Kayıt</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTeacherRegister} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teacher-name" className="text-white">Ad</Label>
                        <Input
                          id="teacher-name"
                          value={teacherForm.name}
                          onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="Adınızı girin"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacher-surname" className="text-white">Soyad</Label>
                        <Input
                          id="teacher-surname"
                          value={teacherForm.surname}
                          onChange={(e) => setTeacherForm({...teacherForm, surname: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="Soyadınızı girin"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="teacher-email" className="text-white">E-posta</Label>
                      <Input
                        id="teacher-email"
                        type="email"
                        value={teacherForm.email}
                        onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="E-posta adresinizi girin"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="teacher-password" className="text-white">Şifre</Label>
                      <Input
                        id="teacher-password"
                        type="password"
                        value={teacherForm.password}
                        onChange={(e) => setTeacherForm({...teacherForm, password: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Şifrenizi belirleyin"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Kayıt Ol ve Sınıfımı Yönet!
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <FlaskConical className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Güvenli Deneyler</h3>
              <p className="text-blue-200 text-sm">Sanal ortamda güvenle deney yapın, hiçbir risk olmadan öğrenin!</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Beaker className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Laboratuvar Faresi</h3>
              <p className="text-blue-200 text-sm">Yapay zeka asistanınız her adımda size eşlik eder!</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Microscope className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Detaylı Raporlar</h3>
              <p className="text-blue-200 text-sm">Öğrenci performansını takip edin ve gelişimi izleyin!</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
