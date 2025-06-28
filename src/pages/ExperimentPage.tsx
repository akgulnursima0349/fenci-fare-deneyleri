
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Beaker, Send, MessageCircle, X, CheckCircle, Play, Pause } from "lucide-react";
import { toast } from "sonner";

const ExperimentPage = () => {
  const { experimentId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isExperimentRunning, setIsExperimentRunning] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      message: "Merhaba! Ben Laboratuvar Faresi 🐭 Birlikte bu deneyi yapmaya başlayalım. Aklına takılan her şeyi bana sorabilirsin!",
      timestamp: new Date()
    }
  ]);

  // Demo experiment data
  const experimentData = {
    "1": {
      title: "Suda Çözünürlük Deneyi",
      description: "Farklı maddelerin suda çözünme özelliklerini keşfedelim",
      materials: ["Su", "Tuz", "Şeker", "Kum", "Yağ", "Beher", "Karıştırıcı"],
      steps: [
        {
          title: "Malzemeleri Hazırla",
          description: "Masanın üzerindeki malzemeleri inceleyelim. Su, tuz, şeker, kum, yağ ve beherlerimiz hazır.",
          action: "Malzemeleri gözlemle ve beher al",
          question: "Bu malzemelerden hangilerinin suda çözüneceğini tahmin ediyorsun?"
        },
        {
          title: "Suyu Beherlere Koy",
          description: "Her beherin içine eşit miktarda su koyalım.",
          action: "4 adet beherin her birine 100ml su ekle",
          question: "Neden her behre eşit miktarda su koyuyoruz?"
        },
        {
          title: "Maddeleri Ekle",
          description: "Her beherin içine farklı bir madde ekleyelim.",
          action: "1. behre tuz, 2. behre şeker, 3. behre kum, 4. behre yağ ekle",
          question: "Maddeleri eklerken neleri gözlemliyorsun?"
        },
        {
          title: "Karıştır ve Gözlemle",
          description: "Her beher için karıştırıcıyı kullanarak maddeleri suyla karıştıralım.",
          action: "Her behri ayrı ayrı karıştır ve sonuçları gözlemle",
          question: "Hangi maddeler çözündü, hangiler çözünmedi? Neden böyle oldu?"
        }
      ]
    },
    "4": {
      title: "Asit-Baz İndikatörleri Deneyi",
      description: "Doğal indikatörlerle asit ve bazları ayırt edelim",
      materials: ["Lahana suyu", "Limon suyu", "Sabun suyu", "Su", "Test tüpleri"],
      steps: [
        {
          title: "Lahana Suyunu Hazırla",
          description: "Mor lahanadan elde ettiğimiz doğal indikatör suyumuzu hazırlayalım.",
          action: "Lahana suyunu test tüplerine eşit olarak böl",
          question: "Lahana suyu neden mor renkte? Bu renk nasıl değişebilir?"
        },
        {
          title: "Test Maddelerini Ekle",
          description: "Farklı test tüplerine asit ve baz örneklerini ekleyelim.",
          action: "1. tüpe limon suyu, 2. tüpe sabun suyu ekle",
          question: "Bu maddelerin asit mi baz mı olduğunu nasıl anlayabiliriz?"
        }
      ]
    }
  };

  const currentExperiment = experimentData[experimentId as keyof typeof experimentData];

  useEffect(() => {
    if (!currentExperiment) {
      toast.error("Deney bulunamadı!");
      navigate('/student-dashboard');
    }
  }, [currentExperiment, navigate]);

  const handleStartExperiment = () => {
    setIsExperimentRunning(true);
    toast.success("Deney başlatıldı! Laboratuvar Faresi size eşlik edecek.");
    setChatOpen(true);
    
    // Add first step question to chat
    setChatHistory(prev => [...prev, {
      sender: "bot",
      message: `İlk adımımız: ${currentExperiment.steps[0].title}. ${currentExperiment.steps[0].question}`,
      timestamp: new Date()
    }]);
  };

  const handleNextStep = () => {
    if (currentStep < currentExperiment.steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Add next step to chat
      setChatHistory(prev => [...prev, {
        sender: "bot",
        message: `Harika! Şimdi ${currentExperiment.steps[nextStep].title} adımına geçelim. ${currentExperiment.steps[nextStep].question}`,
        timestamp: new Date()
      }]);
    } else {
      // Experiment completed
      setIsExperimentRunning(false);
      toast.success("Tebrikler! Deneyi başarıyla tamamladınız! 🎉");
      setChatHistory(prev => [...prev, {
        sender: "bot",
        message: "Tebrikler! Deneyi başarıyla tamamladın! Bu deneyde öğrendiklerini özetler misin? Hangi maddelerin çözündüğünü ve bunun nedenini açıklayabilir misin?",
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      sender: "user",
      message: chatMessage,
      timestamp: new Date()
    };
    
    // Simulate bot response
    const botResponses = [
      "Çok güzel bir soru! Bu durumda moleküllerin hareketini düşünmemiz gerekiyor.",
      "Harika gözlem! Evet, tam olarak böyle oluyor. Peki bunun sebebi ne olabilir?",
      "Doğru düşünüyorsun! Bu olay çözünürlük kavramıyla ilgili.",
      "İyi bir tahmin! Şimdi bunu deneyde test edelim.",
      "Evet, exactly! Bu durum polar ve apolar moleküller arasındaki farktan kaynaklanıyor."
    ];
    
    const botMessage = {
      sender: "bot",
      message: botResponses[Math.floor(Math.random() * botResponses.length)],
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage, botMessage]);
    setChatMessage("");
  };

  if (!currentExperiment) return null;

  const progressPercentage = ((currentStep + (isExperimentRunning ? 1 : 0)) / currentExperiment.steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/student-dashboard')}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
            
            <div className="flex items-center space-x-4">
              <Beaker className="h-6 w-6 text-cyan-400" />
              <div className="text-white">
                <h1 className="font-bold">{currentExperiment.title}</h1>
                <p className="text-sm text-blue-300">Sanal Laboratuvar</p>
              </div>
            </div>
            
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {isExperimentRunning ? "Aktif" : "Hazır"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Experiment Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{currentExperiment.title}</CardTitle>
                  <Button
                    onClick={isExperimentRunning ? () => setIsExperimentRunning(false) : handleStartExperiment}
                    className={`${
                      isExperimentRunning 
                        ? "bg-red-500 hover:bg-red-600" 
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {isExperimentRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Duraklat
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {currentStep === 0 ? "Deneyi Başlat" : "Devam Et"}
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-blue-200">{currentExperiment.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">İlerleme</span>
                      <span className="text-cyan-400">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  {/* Current Step */}
                  <div className="bg-white/5 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {currentStep + 1}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {currentExperiment.steps[currentStep]?.title || "Deney Tamamlandı"}
                      </h3>
                    </div>
                    
                    {currentExperiment.steps[currentStep] && (
                      <>
                        <p className="text-blue-200 mb-4">
                          {currentExperiment.steps[currentStep].description}
                        </p>
                        
                        <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg p-4 mb-4">
                          <h4 className="text-white font-semibold mb-2">Yapılacak İşlem:</h4>
                          <p className="text-purple-200">{currentExperiment.steps[currentStep].action}</p>
                        </div>
                        
                        {isExperimentRunning && (
                          <Button
                            onClick={handleNextStep}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {currentStep === currentExperiment.steps.length - 1 ? "Deneyi Tamamla" : "Sonraki Adım"}
                          </Button>
                        )}
                      </>
                    )}
                    
                    {currentStep >= currentExperiment.steps.length && (
                      <div className="text-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Tebrikler!</h3>
                        <p className="text-green-400">Deneyi başarıyla tamamladınız! 🎉</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materials */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Deney Malzemeleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {currentExperiment.materials.map((material, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mx-auto mb-2"></div>
                      <span className="text-white text-sm">{material}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-purple-400" />
                  Laboratuvar Faresi 🐭
                </CardTitle>
                <Button
                  onClick={() => setChatOpen(!chatOpen)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  {chatOpen ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                </Button>
              </CardHeader>
              
              {chatOpen && (
                <>
                  <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
                    {chatHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-purple-500/20 text-purple-100 border border-purple-500/30'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  
                  <div className="p-4 border-t border-white/10">
                    <div className="flex space-x-2">
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Laboratuvar Faresi'ne sor..."
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentPage;
