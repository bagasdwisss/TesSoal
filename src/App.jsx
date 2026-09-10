import React, { useState, useEffect } from 'react';
import {
  Brain,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Clock,
  Award,
  Eye
} from 'lucide-react';
import { QUIZ_DATA } from './quizData';

const CATEGORIES_LIST = [
  "Analogi Verbal",
  "Deret Angka",
  "Kemampuan Berhitung (Matematika Dasar)",
  "Personality Factor",
  "Preference Inventory",
  "Tes Intelegensi / Penalaran Umum",
  "Abstract Reasoning (Penalaran Gambar/Simbol)"
];

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [filterCategory, setFilterCategory] = useState('All');
  const [timeLeft, setTimeLeft] = useState(7200);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const categories = ['All', ...CATEGORIES_LIST];

  const filteredQuestions = filterCategory === 'All'
    ? QUIZ_DATA
    : QUIZ_DATA.filter(q => q.category === filterCategory);

  const currentQ = filteredQuestions[currentIdx] || filteredQuestions[0];

  const getCategoryProgress = (cat) => {
    const catQuestions = cat === 'All'
      ? QUIZ_DATA
      : QUIZ_DATA.filter(q => q.category === cat);

    if (catQuestions.length === 0) return 0;
    const answeredCount = catQuestions.filter(q => userAnswers[q.id] !== undefined).length;
    return Math.round((answeredCount / catQuestions.length) * 100);
  };

  // TOGGLE LEPAS JAWABAN (Klik ulang opsi untuk unselect)
  const handleSelectOption = (optIdx) => {
    if (userAnswers[currentQ.id] === optIdx) {
      const newAns = { ...userAnswers };
      delete newAns[currentQ.id];
      setUserAnswers(newAns);
    } else {
      setUserAnswers({
        ...userAnswers,
        [currentQ.id]: optIdx
      });
    }
  };

  const toggleExplanation = (qId) => {
    setShowExplanations({
      ...showExplanations,
      [qId]: !showExplanations[qId]
    });
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_DATA.forEach(q => {
      if (userAnswers[q.id] === q.correct) correct++;
    });
    return Math.round((correct / QUIZ_DATA.length) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <header className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
              <Brain className="w-8 h-8" /> Simulasi Psikotes PAMA (350 Soal Unik)
            </h1>
            <p className="text-slate-400 text-sm mt-1">Tepat 50 Soal Berbeda per Kategori • Klik Ulang Opsi untuk Batal Memilih</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="font-mono text-xl font-bold text-slate-200">{formatTime(timeLeft)}</span>
          </div>
        </header>

        {/* CONTAINER TAB KATEGORI (UTUH TANPA KEPOTONG + PROGRESS BAR) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 w-full scrollbar-thin">
          {categories.map((cat, idx) => {
            const progress = getCategoryProgress(cat);
            const isActive = filterCategory === cat;

            return (
              <button
                key={idx}
                onClick={() => {
                  setFilterCategory(cat);
                  setCurrentIdx(0);
                }}
                className={`relative shrink-0 overflow-hidden px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${isActive
                    ? 'border-amber-400 text-amber-300 bg-slate-800 shadow-lg shadow-amber-500/10'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
                  }`}
                style={{ width: 'max-content' }}
              >
                {/* Progress Bar di Dalam Container */}
                <div
                  className="absolute left-0 bottom-0 top-0 bg-amber-500/20 transition-all duration-300 pointer-events-none"
                  style={{ width: `${progress}%` }}
                />

                <div className="relative z-10 flex items-center gap-2.5 whitespace-nowrap">
                  <span>{cat}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${progress === 100
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900/80 text-amber-400 border border-slate-700'
                    }`}>
                    {progress}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-700 pb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {currentQ.category}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              Soal {currentIdx + 1} dari {filteredQuestions.length}
            </span>
          </div>

          <div className="text-lg font-medium text-slate-100 leading-relaxed">
            {currentQ.question}
          </div>

          {/* Option List */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = userAnswers[currentQ.id] === idx;

              let btnStyle = "border-slate-700 bg-slate-900/50 hover:bg-slate-700/50 text-slate-300";
              if (isSelected) {
                btnStyle = "border-amber-500 bg-amber-500/20 text-amber-300 font-semibold shadow-md shadow-amber-500/10";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0 mt-0.5 ${isSelected ? 'border-amber-400 bg-amber-400 text-slate-950 font-bold' : 'border-slate-600 text-slate-400'
                    }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Kunci Jawaban & Pembahasan */}
          {userAnswers[currentQ.id] !== undefined && (
            <div className="pt-4 border-t border-slate-700/60 space-y-4">
              <button
                onClick={() => toggleExplanation(currentQ.id)}
                className="flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {showExplanations[currentQ.id] ? "Sembunyikan Pembahasan" : "Lihat Kunci Jawaban & Cara Penyelesaian"}
              </button>

              {showExplanations[currentQ.id] && (
                <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {userAnswers[currentQ.id] === currentQ.correct ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Jawaban Anda Benar!
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Jawaban Anda Kurang Tepat
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-200">Kunci Jawaban:</strong> Opsi {String.fromCharCode(65 + currentQ.correct)}
                  </p>
                  <div className="text-sm text-slate-300 bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 leading-relaxed whitespace-pre-line">
                    <strong className="text-amber-400 block mb-1">Cara & Langkah Penyelesaian:</strong>
                    {currentQ.explanation}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-xl text-sm font-semibold text-slate-200 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </button>

            <button
              onClick={() => setCurrentIdx((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
              disabled={currentIdx === filteredQuestions.length - 1}
              className="flex items-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-40 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10"
            >
              Berikutnya <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Progress */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-200">Status Total Penyelesaian</h3>
            <p className="text-xs text-slate-400">
              Terjawab: {Object.keys(userAnswers).length} / {QUIZ_DATA.length} Soal
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <span className="text-2xl font-black text-amber-400">{calculateScore()} / 100</span>
          </div>
        </div>

      </div>
    </div>
  );
}