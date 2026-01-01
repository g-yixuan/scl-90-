import React, { useEffect, useRef, useState } from 'react';
import { OPTIONS } from '../constants';
import { Answers, Score, Question } from '../types';
import ProgressBar from './ProgressBar';

interface AssessmentPageProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: Answers;
  onAnswer: (questionId: number, score: Score) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

const AssessmentPage: React.FC<AssessmentPageProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  answers,
  onAnswer,
  onNext,
  onPrev,
  onSubmit
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const currentAnswer = answers[question.id];

  // Scroll to top when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsTransitioning(false);
  }, [currentQuestionIndex]);

  const handleOptionClick = (value: number) => {
    if (isTransitioning) return; // Prevent double clicks
    
    onAnswer(question.id, value as Score);
    
    // Smooth auto-advance delay
    if (!isLastQuestion) {
      setIsTransitioning(true);
      setTimeout(() => {
        onNext();
      }, 250); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-morandi-bg">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full animate-fade-in" ref={containerRef}>
        
        {/* Question Card */}
        <div className="w-full mb-8">
          <span className="inline-block px-3 py-1 bg-morandi-primary/10 text-morandi-primary text-xs font-bold rounded-full mb-4">
            问题 {currentQuestionIndex + 1}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-morandi-text leading-tight min-h-[4rem]">
            {question.text}
          </h2>
          <p className="text-morandi-muted mt-2 text-sm">
            过去一周内，您是否感到...
          </p>
        </div>

        {/* Options */}
        <div className="w-full space-y-3">
          {OPTIONS.map((option) => {
            const isSelected = currentAnswer === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                disabled={isTransitioning && !isLastQuestion}
                className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden
                  ${isSelected 
                    ? 'border-morandi-primary bg-morandi-primary/5 shadow-md scale-[1.01]' 
                    : 'border-white bg-white hover:border-morandi-secondary hover:shadow-sm'
                  }
                  ${isTransitioning ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <span className={`block text-lg font-medium mb-1 ${isSelected ? 'text-morandi-primary' : 'text-morandi-text'}`}>
                      {option.label}
                    </span>
                    <span className="text-xs text-morandi-muted">
                      {option.desc}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${isSelected ? 'border-morandi-primary bg-morandi-primary' : 'border-gray-200'}
                  `}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between w-full mt-10 pt-6 border-t border-gray-200/50">
          <button
            onClick={onPrev}
            disabled={currentQuestionIndex === 0 || isTransitioning}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors
              ${currentQuestionIndex === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-morandi-text hover:bg-white hover:shadow-sm'}
            `}
          >
            上一题
          </button>

          {isLastQuestion && currentAnswer ? (
             <button
             onClick={onSubmit}
             className="px-8 py-3 bg-morandi-primary hover:bg-[#7d9389] text-white rounded-xl shadow-lg shadow-morandi-primary/30 font-bold tracking-wide transition-all transform hover:-translate-y-1"
           >
             提交测评
           </button>
          ) : (
             <button
              onClick={onNext}
              disabled={isTransitioning}
              className="px-6 py-2 rounded-lg text-sm font-medium text-morandi-primary hover:bg-morandi-primary/10 transition-colors"
            >
              下一题 →
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssessmentPage;