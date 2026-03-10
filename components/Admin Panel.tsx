
import React, { useState } from 'react';
import { AppData, Section, SectionType, Question, Unit } from '../types';

interface AdminPanelProps {
  data: AppData;
  setData: (data: AppData) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ data, setData, onClose }) => {
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);

  const handleUpdateQuestion = (sectionId: string, qId: string, updates: Partial<Question>) => {
    const newData = {
      ...data,
      units: data.units.map(u => ({
        ...u,
        sections: u.sections.map(s => s.id === sectionId ? {
          ...s,
          questions: s.questions.map(q => q.id === qId ? { ...q, ...updates } : q)
        } : s)
      }))
    };
    setData(newData);
  };

  const addQuestion = (sectionId: string) => {
    const newData = {
      ...data,
      units: data.units.map(u => ({
        ...u,
        sections: u.sections.map(s => {
          if (s.id === sectionId) {
            const newQ: Question = {
              id: Date.now().toString(),
              text: 'اكتب نص السؤال الوزاري هنا...',
              correctAnswer: '',
              options: s.type === SectionType.GRAMMAR_MCQ ? ['', ''] : undefined,
              matchingPairs: s.type === SectionType.MATCHING ? [{ left: '', right: '' }] : undefined,
            };
            return { ...s, questions: [...s.questions, newQ] };
          }
          return s;
        })
      }))
    };
    setData(newData);
  };

  const deleteQuestion = (sectionId: string, qId: string) => {
    if (!confirm('سيتم حذف هذا السؤال نهائياً، هل أنت متأكد؟')) return;
    const newData = {
      ...data,
      units: data.units.map(u => ({
        ...u,
        sections: u.sections.map(s => s.id === sectionId ? {
          ...s,
          questions: s.questions.filter(q => q.id !== qId)
        } : s)
      }))
    };
    setData(newData);
  };

  const selectedUnit = data.units.find(u => u.id === selectedUnitId);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-2 md:p-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-white w-full max-w-5xl h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
        {/* Dashboard Header */}
        <div className="bg-indigo-950 px-8 py-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">إدارة الأسئلة والبيانات</h2>
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Administrator Mode Content Manager</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="bg-white/10 hover:bg-rose-500/20 text-white w-12 h-12 flex items-center justify-center rounded-2xl transition-all border border-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Unit Tabs */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 overflow-x-auto scrollbar-hide flex gap-2 shrink-0">
          {data.units.map(u => (
            <button 
              key={u.id} 
              onClick={() => setSelectedUnitId(u.id)}
              className={`px-6 py-2 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${selectedUnitId === u.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-y-[-2px]' : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-200 shadow-sm'}`}
            >
              الوحدة {u.id}
            </button>
          ))}
        </div>

        {/* Scrollable Editor Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
          {selectedUnit?.sections.map(section => (
            <div key={section.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    {section.title}
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-4">{section.type}</span>
                </div>
                <button 
                  onClick={() => addQuestion(section.id)}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-50 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  إضافة سؤال جديد
                </button>
              </div>

              <div className="p-6 space-y-6">
                {section.questions.map((q) => (
                  <div key={q.id} className="p-6 border border-slate-100 rounded-[2rem] bg-white group relative hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all">
                    {/* Floating Delete Button */}
                    <button 
                      onClick={() => deleteQuestion(section.id, q.id)}
                      className="absolute -left-2 -top-2 bg-rose-500 text-white w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 active:scale-95 z-20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">نص السؤال الوزاري</label>
                        <textarea 
                          className="w-full p-4 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] bg-slate-50/50 transition-all"
                          value={q.text}
                          onChange={(e) => handleUpdateQuestion(section.id, q.id, { text: e.target.value })}
                          placeholder="اكتب السؤال بوضوح..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الإجابة النموذجية الأولى</label>
                          <input 
                            type="text"
                            className="w-full p-4 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50/50"
                            value={q.correctAnswer}
                            onChange={(e) => handleUpdateQuestion(section.id, q.id, { correctAnswer: e.target.value })}
                            placeholder="الإجابة الصحيحة الرئيسية"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">إجابات بديلة (مقبولة في التصحيح)</label>
                          <input 
                            type="text"
                            className="w-full p-4 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50/50"
                            value={q.acceptedAnswers?.join(', ') || ''}
                            onChange={(e) => handleUpdateQuestion(section.id, q.id, { acceptedAnswers: e.target.value.split(',').map(s => s.trim()) })}
                            placeholder="افصل بينها بفاصلة (مثال: answer1, answer2)"
                          />
                        </div>
                      </div>

                      {section.type === SectionType.GRAMMAR_MCQ && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الخيارات المتاحة (للاختيار من متعدد)</label>
                          <input 
                            type="text"
                            className="w-full p-4 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50/50"
                            value={q.options?.join(', ') || ''}
                            onChange={(e) => handleUpdateQuestion(section.id, q.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                            placeholder="خيار 1, خيار 2, خيار 3..."
                          />
                        </div>
                      )}

                      {section.type === SectionType.MATCHING && (
                        <div className="space-y-4 bg-indigo-50/30 p-6 rounded-2xl border border-indigo-50">
                          <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-1 block mb-2">أزواج التوصيل (Matching Pairs)</label>
                          {q.matchingPairs?.map((pair, pIdx) => (
                            <div key={pIdx} className="flex gap-3 items-center animate-in fade-in duration-300">
                              <input 
                                className="flex-1 p-3 border border-indigo-100 rounded-xl text-xs font-bold"
                                value={pair.left}
                                onChange={(e) => {
                                  const newPairs = [...(q.matchingPairs || [])];
                                  newPairs[pIdx].left = e.target.value;
                                  handleUpdateQuestion(section.id, q.id, { matchingPairs: newPairs });
                                }}
                                placeholder="الكلمة (يمين)"
                              />
                              <div className="text-indigo-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                              </div>
                              <input 
                                className="flex-1 p-3 border border-indigo-100 rounded-xl text-xs font-bold"
                                value={pair.right}
                                onChange={(e) => {
                                  const newPairs = [...(q.matchingPairs || [])];
                                  newPairs[pIdx].right = e.target.value;
                                  handleUpdateQuestion(section.id, q.id, { matchingPairs: newPairs });
                                }}
                                placeholder="التوصيل (يسار)"
                              />
                              <button 
                                onClick={() => {
                                  const newPairs = q.matchingPairs?.filter((_, i) => i !== pIdx);
                                  handleUpdateQuestion(section.id, q.id, { matchingPairs: newPairs });
                                }}
                                className="text-rose-400 hover:text-rose-600 p-2 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const newPairs = [...(q.matchingPairs || []), { left: '', right: '' }];
                              handleUpdateQuestion(section.id, q.id, { matchingPairs: newPairs });
                            }}
                            className="text-[10px] text-indigo-600 font-black tracking-widest uppercase mt-2 hover:underline flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            إضافة زوج توصيل جديد
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {section.questions.length === 0 && (
                  <div className="text-center py-12 text-slate-400 italic font-medium bg-slate-50/30 rounded-[2rem] border-2 border-dashed border-slate-100">
                    لم يتم إضافة أسئلة في هذا القسم بعد.
                  </div>
                )}
              </div>
            </div>
          ))}
          {selectedUnit?.sections.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 text-slate-400">
              لا توجد أقسام في هذه الوحدة. ابدأ بإضافة قسم جديد من خلال لوحة التطوير (قريباً).
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 bg-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] shrink-0">
          <div className="flex flex-col text-center md:text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auto-Save Status</span>
            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => {
                if (confirm('تنبيه: هذا الإجراء سيقوم بمسح كافة الأسئلة المخصصة وإعادة التطبيق لحالته الأصلية. هل أنت متأكد؟')) {
                  localStorage.removeItem('tafaoqe_data');
                  window.location.reload();
                }
              }} 
              className="flex-1 md:flex-none border-2 border-rose-100 text-rose-500 px-8 py-3 rounded-2xl font-black text-sm hover:bg-rose-50 transition-all active:scale-95"
            >
              إعادة تهيئة كاملة
            </button>
            <button 
              onClick={onClose} 
              className="flex-1 md:flex-none bg-indigo-950 text-white px-12 py-3 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
            >
              حفظ وخروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
                        
