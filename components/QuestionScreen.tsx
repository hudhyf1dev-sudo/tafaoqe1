
import React, { useState, useEffect, useMemo } from 'react';
import { Section, SectionType, Question } from '../types';
import { isCloseMatch, normalizeString } from '../utils';

interface QuestionScreenProps {
  section: Section;
  onFinish: (score: number) => void;
}

interface MatchingItem {
  id: number;
  text: string;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({ section, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { type: 'correct' | 'close' | 'wrong', message?: string }>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Matching State
  const [matchingSelections, setMatchingSelections] = useState<{ left: MatchingItem | null; right: MatchingItem | null }>({ left: null, right: null });
  const [matchedPairsIds, setMatchedPairsIds] = useState<Record<number, number>>({});
  const [wrongPair, setWrongPair] = useState<{ leftId: number; rightId: number } | null>(null);

  if (section.questions.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="text-6xl mb-6 opacity-40">🏗️</div>
        <h3 className="text-3xl font-black text-slate-800 mb-2">قريباً</h3>
        <p className="text-slate-400 font-medium">نحن نعمل على إضافة الأسئلة لهذا القسم.</p>
        <button 
          onClick={() => onFinish(0)}
          className="mt-8 bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
        >
          العودة للقائمة
        </button>
      </div>
    );
  }

  const groupedQuestions = useMemo(() => {
    if (section.type !== SectionType.FILL_GAPS) return [];
    const groups: { title: string, questions: Question[] }[] = [];
    section.questions.forEach(q => {
      const groupTitle = q.group || section.title;
      let existingGroup = groups.find(g => g.title === groupTitle);
      if (!existingGroup) {
        existingGroup = { title: groupTitle, questions: [] };
        groups.push(existingGroup);
      }
      existingGroup.questions.push(q);
    });
    return groups;
  }, [section]);

  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
  const currentQuestion = section.questions[currentIdx];

  const checkAnswer = (q: Question, value: string) => {
    const normalizedInput = normalizeString(value);
    const normalizedCorrect = normalizeString(q.correctAnswer);
    const isAccepted = q.acceptedAnswers?.some(ans => normalizeString(ans) === normalizedInput);

    if (normalizedInput === normalizedCorrect || isAccepted) {
      setFeedback(prev => ({ ...prev, [q.id]: { type: 'correct' } }));
      setTotalScore(prev => prev + 2);
    } else if (isCloseMatch(normalizedInput, normalizedCorrect)) {
      setFeedback(prev => ({ ...prev, [q.id]: { type: 'close', message: '⚠️ إجابة قريبة جداً، انتبه للأخطاء الإملائية البسيطة.' } }));
      setTotalScore(prev => prev + 2);
    } else {
      setFeedback(prev => ({ ...prev, [q.id]: { type: 'wrong' } }));
      setTotalScore(prev => Math.max(0, prev - 2));
    }
  };

  const handleNext = () => {
    if (section.type === SectionType.FILL_GAPS) {
      if (currentGroupIdx < groupedQuestions.length - 1) {
        setCurrentGroupIdx(currentGroupIdx + 1);
        setIsSubmitted(false);
        setAnswers({}); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onFinish(totalScore);
      }
      return;
    }
    
    if (currentIdx < section.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setIsSubmitted(false);
      setMatchedPairsIds({});
      setMatchingSelections({ left: null, right: null });
      setWrongPair(null);
    } else {
      onFinish(totalScore);
    }
  };

  const renderMatching = () => {
    const pairs = currentQuestion.matchingPairs || [];
    const leftItems: MatchingItem[] = pairs.map((p, idx) => ({ id: idx, text: p.left }));
    const rightItems: MatchingItem[] = pairs.map((p, idx) => ({ id: idx, text: p.right }));

    const sortedLeft = [...leftItems].sort((a, b) => a.text.localeCompare(b.text));
    const sortedRight = [...rightItems].sort((a, b) => a.text.localeCompare(b.text));

    const handlePairClick = (side: 'left' | 'right', item: MatchingItem) => {
      if (isSubmitted || wrongPair) return;
      
      const newSelections = { ...matchingSelections, [side]: item };
      setMatchingSelections(newSelections);

      if (newSelections.left && newSelections.right) {
        const correctRightText = pairs[newSelections.left.id].right;
        const isCorrect = correctRightText === newSelections.right.text;
        
        if (isCorrect) {
          // إجابة صحيحة: قم بتثبيت التوصيل
          const newMatched = { ...matchedPairsIds, [newSelections.left.id]: newSelections.right.id };
          setMatchedPairsIds(newMatched);
          setTotalScore(prev => prev + 2);
          setMatchingSelections({ left: null, right: null });
          
          if (Object.keys(newMatched).length === pairs.length) {
            setIsSubmitted(true);
          }
        } else {
          // إجابة خاطئة: خصم نقاط وإظهار تنبيه مرئي ثم إعادة الضبط
          setTotalScore(prev => Math.max(0, prev - 2));
          setWrongPair({ leftId: newSelections.left.id, rightId: newSelections.right.id });
          
          setTimeout(() => {
            setWrongPair(null);
            setMatchingSelections({ left: null, right: null });
          }, 1000);
        }
      }
    };

    const isLeftMatched = (id: number) => matchedPairsIds[id] !== undefined;
    const isRightMatched = (id: number) => Object.values(matchedPairsIds).includes(id);

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-50">
        <p className="font-bold mb-6 text-center text-slate-500">{currentQuestion.text}</p>
        <div className="flex gap-4 md:gap-8 justify-between">
          <div className="flex-1 space-y-3">
            {sortedLeft.map(item => (
              <button
                key={`left-${item.id}`}
                disabled={isLeftMatched(item.id)}
                onClick={() => handlePairClick('left', item)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-xs md:text-sm font-bold text-right md:text-center shadow-sm ${
                  isLeftMatched(item.id) ? 'bg-emerald-50 text-emerald-600 border-emerald-100 opacity-60' :
                  wrongPair?.leftId === item.id ? 'bg-red-500 text-white border-red-600 animate-pulse' :
                  matchingSelections.left?.id === item.id ? 'bg-blue-600 text-white border-blue-700 ring-4 ring-blue-100' : 
                  'bg-slate-50 border-slate-100 hover:border-blue-200'
                }`}
              >
                {item.text}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-3">
            {sortedRight.map(item => (
              <button
                key={`right-${item.id}`}
                disabled={isRightMatched(item.id)}
                onClick={() => handlePairClick('right', item)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-xs md:text-sm font-bold text-right md:text-center shadow-sm ${
                  isRightMatched(item.id) ? 'bg-emerald-50 text-emerald-600 border-emerald-100 opacity-60' :
                  wrongPair?.rightId === item.id ? 'bg-red-500 text-white border-red-600 animate-pulse' :
                  matchingSelections.right?.id === item.id ? 'bg-blue-600 text-white border-blue-700 ring-4 ring-blue-100' : 
                  'bg-slate-50 border-slate-100 hover:border-blue-200'
                }`}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
        {isSubmitted && (
          <div className="mt-8 text-center animate-bounce">
            <span className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-black shadow-sm">
              🎉 أحسنت! تم إكمال التوصيل بنجاح
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderReading = () => (
    <div className="space-y-6">
      {currentQuestion.readingPassage && (
        <div className="bg-indigo-50/50 p-6 md:p-8 rounded-[2rem] border border-indigo-100 mb-6 animate-in fade-in slide-in-from-top-4">
          <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Reading Passage - نص القطعة</h4>
          <p className="text-slate-700 leading-relaxed font-medium text-lg italic">
            "{currentQuestion.readingPassage}"
          </p>
        </div>
      )}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-50">
        <p className="text-xl font-bold text-slate-800 mb-6">{currentQuestion.text}</p>
        <input 
          autoFocus
          type="text"
          className="w-full p-4 border-2 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          placeholder="اكتب إجابتك هنا..."
          value={answers[currentQuestion.id] || ''}
          onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
          disabled={isSubmitted}
          onKeyDown={(e) => e.key === 'Enter' && !isSubmitted && answers[currentQuestion.id] && handleSubmit()}
        />
        {isSubmitted && feedback[currentQuestion.id] && (
          <div className={`mt-4 p-4 rounded-xl ${feedback[currentQuestion.id].type === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} border`}>
            {feedback[currentQuestion.id].type === 'correct' ? '✅ إجابة صحيحة!' : `❌ خطأ. الإجابة هي: ${currentQuestion.correctAnswer}`}
          </div>
        )}
      </div>
    </div>
  );

  const renderGrammarTransform = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-50">
        <p className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{currentQuestion.text}</p>
        <input 
          autoFocus
          type="text"
          className="w-full p-4 border-2 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          placeholder="اكتب إجابتك هنا..."
          value={answers[currentQuestion.id] || ''}
          onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
          disabled={isSubmitted}
          onKeyDown={(e) => e.key === 'Enter' && !isSubmitted && answers[currentQuestion.id] && handleSubmit()}
        />
        {isSubmitted && feedback[currentQuestion.id] && (
          <div className={`mt-4 p-4 rounded-xl ${feedback[currentQuestion.id].type === 'correct' ? 'bg-green-100 text-green-800 border-green-200' : feedback[currentQuestion.id].type === 'close' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-red-100 text-red-800 border-red-200'} border animate-in fade-in slide-in-from-top-2`}>
            {feedback[currentQuestion.id].type === 'correct' && '✅ إجابة صحيحة! +2'}
            {feedback[currentQuestion.id].type === 'close' && (
              <div>
                <p>✨ إجابة قريبة! +2</p>
                <p className="text-sm mt-1">{feedback[currentQuestion.id].message}</p>
                <p className="text-sm font-bold mt-1">الإجابة النموذجية: {currentQuestion.correctAnswer}</p>
              </div>
            )}
            {feedback[currentQuestion.id].type === 'wrong' && (
              <div>
                <p>❌ إجابة خاطئة. -2</p>
                <p className="text-sm mt-1 font-bold">الإجابة الصحيحة هي: {currentQuestion.correctAnswer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderMCQ = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-50">
        <p className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{currentQuestion.text}</p>
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options?.map((opt, i) => (
            <button
              key={i}
              disabled={isSubmitted}
              onClick={() => {
                setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }));
                handleSubmit(opt);
              }}
              className={`p-4 text-right rounded-xl border-2 transition-all ${
                answers[currentQuestion.id] === opt 
                  ? (isSubmitted 
                      ? (opt === currentQuestion.correctAnswer ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600')
                      : 'bg-blue-600 text-white border-blue-700')
                  : 'bg-white text-slate-700 border-slate-100 hover:border-blue-200 hover:bg-blue-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {isSubmitted && answers[currentQuestion.id] !== currentQuestion.correctAnswer && (
          <div className="mt-4 p-4 rounded-xl bg-red-100 text-red-800 border border-red-200 animate-in fade-in">
            ❌ خطأ. الإجابة الصحيحة هي: <span className="font-bold">{currentQuestion.correctAnswer}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderFillGaps = () => {
    const currentGroup = groupedQuestions[currentGroupIdx];
    if (!currentGroup) return null;

    const wordBank = currentGroup.questions.flatMap(q => q.correctAnswers || [q.correctAnswer]).filter(w => w !== '').sort(() => Math.random() - 0.5);

    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="text-center">
            <h3 className="text-2xl font-black text-indigo-950 mb-2">{currentGroup.title}</h3>
            <div className="w-16 h-1 bg-indigo-200 mx-auto rounded-full"></div>
        </div>

        <div className="bg-indigo-950 text-white p-8 rounded-[2.5rem] shadow-xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50"></div>
          <div className="flex flex-col items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">Word Bank - الأجوبة</span>
            <div className="flex flex-wrap justify-center gap-3">
              {wordBank.map((word, idx) => (
                <div 
                  key={idx} 
                  className="px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-lg font-bold hover:bg-white/20 transition-all cursor-default"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {currentGroup.questions.map((q) => {
            const expectedAnswers = q.correctAnswers || [q.correctAnswer];
            return (
              <div key={q.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-lg">
                <p className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">
                  {q.text.split('.........................').map((part, i, arr) => {
                    const answerKey = `${q.id}_${i}`;
                    const correctVal = expectedAnswers[i];
                    return (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span className="inline-block mx-2 min-w-[150px] relative">
                            <input
                              disabled={isSubmitted}
                              type="text"
                              className={`w-full border-b-2 bg-transparent text-center focus:outline-none focus:border-indigo-600 transition-all font-black text-indigo-600 ${
                                isSubmitted 
                                  ? (normalizeString(answers[answerKey] || '') === normalizeString(correctVal) ? 'border-emerald-500 text-emerald-600' : 'border-rose-500 text-rose-600')
                                  : 'border-slate-200'
                              }`}
                              placeholder=".........."
                              value={answers[answerKey] || ''}
                              onChange={(e) => setAnswers(prev => ({ ...prev, [answerKey]: e.target.value }))}
                            />
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </p>
                {isSubmitted && expectedAnswers.some((val, i) => normalizeString(answers[`${q.id}_${i}`] || '') !== normalizeString(val)) && (
                  <div className="mt-3 text-sm font-black text-rose-500 flex flex-col gap-1 animate-in slide-in-from-right-2">
                     <div className="flex items-center gap-2">
                       <span>❌ الأجوبة الصحيحة:</span>
                       <span className="bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 uppercase tracking-wider">{expectedAnswers.join(' / ')}</span>
                     </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSubmit = (forcedVal?: string) => {
    if (section.type === SectionType.FILL_GAPS) {
      const currentGroup = groupedQuestions[currentGroupIdx];
      let groupScoreChange = 0;
      
      currentGroup.questions.forEach(q => {
        const expected = q.correctAnswers || [q.correctAnswer];
        let qCorrect = true;
        expected.forEach((val, i) => {
          if (normalizeString(answers[`${q.id}_${i}`] || '') !== normalizeString(val)) {
            qCorrect = false;
          }
        });
        if (qCorrect) groupScoreChange += 2;
      });
      
      setTotalScore(prev => prev + groupScoreChange);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const val = forcedVal || answers[currentQuestion.id];
    if (!val) return;
    setIsSubmitted(true);
    checkAnswer(currentQuestion, val);
  };

  const renderContent = () => {
    switch (section.type) {
      case SectionType.READING: return renderReading();
      case SectionType.GRAMMAR_TRANSFORM: return renderGrammarTransform();
      case SectionType.GRAMMAR_MCQ: return renderMCQ();
      case SectionType.MATCHING: return renderMatching();
      case SectionType.SPELLING: return renderGrammarTransform();
      case SectionType.FILL_GAPS: return renderFillGaps();
      default: return renderGrammarTransform();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-bold text-sm">
          {section.type === SectionType.FILL_GAPS 
            ? `تمرين ${currentGroupIdx + 1} من ${groupedQuestions.length}` 
            : `السؤال ${currentIdx + 1} من ${section.questions.length}`}
        </div>
        <div className="flex gap-2">
           <span className="text-slate-400 font-bold">الدرجة: </span>
           <span className={`font-bold ${totalScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>{totalScore}</span>
        </div>
      </div>

      <div className="mb-8">
        {renderContent()}
      </div>

      <div className="sticky bottom-6 flex justify-center">
        {(isSubmitted || (section.type === SectionType.MATCHING && isSubmitted)) ? (
          <button 
            onClick={handleNext}
            
