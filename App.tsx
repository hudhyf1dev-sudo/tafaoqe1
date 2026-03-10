
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AdminPanel } from './components/AdminPanel';
import { QuestionScreen } from './components/QuestionScreen';
import { AppData, Section, SectionType } from './types';
import { INITIAL_DATA, ADMIN_PASSWORD, LOGO_URL, DOC_LINK, DATA_VERSION } from './constants';

type Screen = 'HOME' | 'UNIT_MENU' | 'SECTION' | 'RESULT';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    const savedVersion = localStorage.getItem('tafaoqe_version');
    const savedData = localStorage.getItem('tafaoqe_data');
    
    if (savedVersion !== DATA_VERSION) {
      localStorage.setItem('tafaoqe_version', DATA_VERSION);
      localStorage.removeItem('tafaoqe_data');
      return INITIAL_DATA;
    }

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return parsed;
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });
  const [screen, setScreen] = useState<Screen>('HOME');
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [showMotivation, setShowMotivation] = useState(false);

  useEffect(() => {
    localStorage.setItem('tafaoqe_data', JSON.stringify(data));
  }, [data]);

  const handleUnitSelect = (id: number) => {
    setSelectedUnitId(id);
    setScreen('UNIT_MENU');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startSection = (section: Section) => {
    setSelectedSection(section);
    setShowMotivation(true);
  };

  const handleFinishSection = (score: number) => {
    setLastScore(score);
    setScreen('RESULT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAuth = () => {
    const pass = prompt('ادخل رمز الدخول السري للإدارة:');
    if (pass === ADMIN_PASSWORD) {
      setShowAdmin(true);
    } else {
      alert('الرمز خاطئ! الدخول للإدارة مصرح به للمطورين فقط.');
    }
  };

  const renderHome = () => (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="relative bg-[#0F172A] rounded-[3rem] p-10 md:p-16 overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-blue-900/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <a 
            href={DOC_LINK} 
            target="_blank" 
            rel="noreferrer" 
            className="w-32 h-32 md:w-40 md:h-40 bg-white border-2 border-white/20 rounded-[2.5rem] flex items-center justify-center shadow-2xl group transition-all duration-500 hover:rotate-3 hover:scale-105 overflow-hidden"
          >
            <img 
              src={LOGO_URL} 
              alt="Tafaoqe Logo" 
              className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Tafaoqe&background=0056b3&color=fff&size=512';
              }}
            />
          </a>
          <div className="text-center md:text-right space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              تفوقك يبدأ <br /><span className="text-indigo-400">من هنا.</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-sm">
              التطبيق التفاعلي الأول لطلبة السادس العلمي في العراق لمادة اللغة الإنجليزية.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => alert('سيُتوفر قريباً جداً في التحديث القادم!')}
          className="md:col-span-2 group bg-white border border-indigo-50 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all flex items-center justify-between overflow-hidden relative"
        >
          <div className="absolute left-0 top-0 h-full w-2 bg-indigo-500 rounded-full my-4 scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📄</div>
            <div className="text-right">
              <h4 className="font-black text-slate-800 text-xl">اختبار القطعة الخارجية</h4>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">جميع الأدوار الوزارية</p>
            </div>
          </div>
          <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase">COMING SOON</div>
        </button>

        <a 
          href={DOC_LINK}
          target="_blank"
          rel="noreferrer"
          className="bg-[#0056b3] text-white p-6 rounded-[2.5rem] flex flex-col justify-center items-center text-center shadow-lg shadow-indigo-100 hover:bg-[#004494] hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
           <div className="w-16 h-16 bg-white rounded-2xl p-1 mb-3 group-hover:scale-110 transition-transform shadow-lg overflow-hidden border-2 border-white/20">
             <img 
               src={LOGO_URL} 
               alt="Doc Link" 
               className="w-full h-full object-contain" 
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Doc&background=0056b3&color=fff';
               }}
             />
           </div>
           <h4 className="font-black text-lg">دليل الاستخدام</h4>
           <p className="text-indigo-100 text-xs mt-1">تصفح وثائق ومصادر التطبيق</p>
        </a>
      </div>

      {/* Units Collection */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 px-2">
          <div className="h-8 w-1.5 bg-[#0056b3] rounded-full"></div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">وحدات المنهج المقرر</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {data.units.map(unit => (
            <button
              key={unit.id}
              onClick={() => handleUnitSelect(unit.id)}
              className="group relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-200 transition-all duration-300 flex flex-col items-center gap-4 text-center overflow-hidden"
            >
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-2xl font-black group-hover:bg-[#0056b3] group-hover:text-white transition-all transform group-hover:scale-110 group-hover:rotate-3 shadow-inner overflow-hidden border border-slate-100">
                <img 
                  src={LOGO_URL} 
                  alt={`Unit ${unit.id}`} 
                  className="w-full h-full object-contain opacity-20 group-hover:opacity-100 transition-opacity p-2" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${unit.id}&background=0056b3&color=fff`;
                  }}
                />
              </div>
              <div>
                <span className="block font-black text-lg text-slate-800 group-hover:text-[#0056b3] transition-colors">
                  {unit.title}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 block">
                  Interactive Unit
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features Showcase */}
      <div className="bg-indigo-50 rounded-[3rem] p-10 md:p-12 border border-indigo-100 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">🎯</div>
          <h5 className="font-black text-slate-800 text-lg">محاكاة وزارية</h5>
          <p className="text-slate-500 text-sm leading-relaxed">الأسئلة مصممة تماماً لتشبه أسئلة الامتحان الوزاري النهائي.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">🧠</div>
          <h5 className="font-black text-slate-800 text-lg">تصحيح ذكي</h5>
          <p className="text-slate-500 text-sm leading-relaxed">يتعرف التطبيق على الإجابات القريبة والأخطاء الإملائية البسيطة.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">✨</div>
          <h5 className="font-black text-slate-800 text-lg">تحفيز مستمر</h5>
          <p className="text-slate-500 text-sm leading-relaxed">آيات قرآنية واقتباسات لرفع المعنويات قبل كل تحدي جديد.</p>
        </div>
      </div>
    </div>
  );

  const renderUnitMenu = () => {
    const selectedUnit = data.units.find(u => u.id === selectedUnitId);
    const unitSections = selectedUnit?.sections || [];
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{selectedUnit?.title}</h2>
            <p className="text-slate-400 font-medium text-lg mt-1">اختر المهارة التي تود البدء بها</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl font-bold text-sm border border-indigo-100 flex items-center gap-2">
               <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
               {unitSections.length} أقسام متاحة
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {unitSections.map(section => (
            <button
              key={section.id}
              onClick={() => startSection(section)}
              className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-50 hover:border-indigo-400 flex items-center justify-between transition-all group relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 h-full w-2 bg-[#0056b3] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-[#0056b3] group-hover:text-white transition-all transform group-hover:-rotate-6 shadow-inner">
                  {section.type === SectionType.GRAMMAR_TRANSFORM || section.type === SectionType.GRAMMAR_MCQ ? 'G' : 
                   section.type === SectionType.MATCHING ? 'M' : 
                   section.type === SectionType.READING ? 'R' : 
                   section.type === SectionType.FILL_GAPS ? 'F' : 'S'}
                </div>
                <div className="text-right">
                  <h4 className="font-black text-xl text-slate-800 group-hover:text-[#0056b3] transition-colors">
                    {section.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    {section.questions.length > 0 ? (
                      <>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-black uppercase tracking-wider">
                           {section.questions.length} أسئلة
                        </span>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">وزاري</span>
                      </>
                    ) : (
                      <span className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1 rounded-lg font-black uppercase tracking-wider border border-amber-100">
                         قريباً
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 group-hover:bg-[#0056b3] group-hover:text-white p-4 rounded-2xl transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="translate-x-1 group-hover:translate-x-0 transition-all"><path d="m15 18-6-6 6-6"/></svg>
              </div>
            </button>
          ))}
          {unitSections.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-400 space-y-4">
               <div className="text-7xl opacity-20">🧗‍♂️</div>
               <p className="font-black text-xl">نحن نجهز الأسئلة لهذا اليونت!</p>
               <p className="text-sm max-w-xs mx-auto">ترقب التحديث القادم لإضافة جميع التدريبات الوزارية الشاملة.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const maxScore = (selectedSection?.questions.length || 0) * 2;
    const percentage = maxScore > 0 ? (lastScore / maxScore) * 100 : 0;
    
    let message = "";
    let emoji = "";
    let colorClass = "";
    
    if (percentage === 100) { 
      message = "العلامة الكاملة! 🔥 أنت بطل حقيقي ومستواك يؤهلك للدرجة النهائية في الوزاري."; 
      emoji = "🤴"; 
      colorClass = "text-emerald-500";
    }
    else if (percentage >= 90) { 
      message = "أداء استثنائي 👏 استمر هكذا وستكون من الأوائل بكل تأكيد."; 
      emoji = "🥇"; 
      colorClass = "text-indigo-600";
    }
    else { 
      message = "بطل، لكنك تستطيع الأفضل! حاول مرة أخرى بتركيز أكبر لتصل للـ 100."; 
      emoji = "🏹"; 
      colorClass = "text-amber-600";
    }

    return (
      <div className="max-w-md mx-auto text-center space-y-10 animate-in zoom-in duration-700">
        <div className="relative inline-flex items-center justify-center">
          <div className="text-[10rem] animate-bounce-slow drop-shadow-2xl">{emoji}</div>
          <div className="absolute inset-0 border-[10px] border-dashed border-indigo-100 rounded-full scale-150 opacity-50 animate-spin-slow"></div>
        </div>
        
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-50 space-y-6">
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Your Final Result</p>
          <div className="flex justify-center items-baseline gap-2">
            <h2 className="text-7xl font-black text-slate-900 tracking-tighter">{lastScore}</h2>
            <span className="text-3xl text-slate-300 font-light">/ {maxScore}</span>
          </div>
          
          <div className="space-y-3">
             <div className={`text-3xl font-black ${colorClass}`}>
                %{percentage.toFixed(0)}
             </div>
             <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1 shadow-inner">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ${percentage >= 90 ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-amber-500'}`} 
                 style={{ width: `${percentage}%` }}
               ></div>
             </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
          <p className="text-lg text-indigo-900 font-bold leading-relaxed">{message}</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setScreen('UNIT_MENU')}
            className="bg-[#0056b3] text-white p-6 rounded-[2rem] font-black text-xl shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all hover:bg-[#004494]"
          >
            العودة لاختيار قسم آخر ➔
          </button>
          <button 
            onClick={() => { setShowMotivation(true); setScreen('SECTION'); }}
            className="bg-white text-slate-600 border border-slate-200 p-6 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            إعادة التدريب لرفع الدرجة
          </button>
        </div>
      </div>
    );
  };

  if (showMotivation && selectedSection) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0F172A] text-white flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1E1B4B_0%,_#0F172A_100%)] opacity-80"></div>
        <div className="relative z-10 flex flex-col items-center gap-14 max-w-2xl">
          <div className="w-24 h-24 bg-indigo-500/20 rounded-[2rem] backdrop-blur-3xl border border-white/10 flex items-center justify-center text-5xl shadow-2xl animate-pulse">
            ✨
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-[1.3] tracking-tight">
            {selectedSection.motivation}
          </h2>
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-1 bg-indigo-500/30 rounded-full"></div>
            <button 
              onClick={() => { setShowMotivation(false); setScreen('SECTION'); }}
              className="bg-white text-slate-900 px-16 py-6 rounded-[2.5rem] font-black text-2xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all"
            >
              يا الله، نبدأ!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      title={screen === 'HOME' ? 'تفوقي - السادس العلمي' : screen === 'UNIT_MENU' ? `${data.units.find(u => u.id === selectedUnitId)?.title}` : selectedSection?.title || ''}
      onBack={screen !== 'HOME' ? () => {
        if (screen === 'SECTION') setScreen('UNIT_MENU');
        else if (screen === 'UNIT_MENU') setScreen('HOME');
        else if (screen === 'RESULT') setScreen('UNIT_MENU');
      } : undefined}
      onAdminClick={handleAdminAuth}
    >
      {screen === 'HOME' && renderHome()}
      {screen === 'UNIT_MENU' && renderUnitMenu()}
      {screen === 'SECTION' && selectedSection && (
        <QuestionScreen section={selectedSection} onFinish={handleFinishSection} />
      )}
      {screen === 'RESULT' && renderResult()}

      {showAdmin && (
        <AdminPanel 
          data={data} 
          setData={setData} 
          onClose={() => setShowAdmin(false)} 
        />
      )}
    </Layout>
  );
};

export default App;
