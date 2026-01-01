import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentPage from './components/AssessmentPage';
import ResultsPage from './components/ResultsPage';
import { Answers, Score, AssessmentResult, FactorResult } from './types';
import { QUESTIONS, FACTORS, TOTAL_QUESTIONS } from './constants';

// Storage Key
const STORAGE_KEY = 'scl90_progress';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'landing' | 'assessment' | 'results'>('landing');
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // New flag to ensure hydration matches

  // 1. Load progress on mount - Improved Logic
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers && Object.keys(parsed.answers).length > 0) {
          const loadedAnswers = parsed.answers;
          setAnswers(loadedAnswers);
          
          // Find the first missing Question ID (1-based)
          // This is safer than max() because it fills gaps if any exist
          let nextQuestionId = 1;
          while (loadedAnswers[nextQuestionId] && nextQuestionId <= TOTAL_QUESTIONS) {
            nextQuestionId++;
          }
          
          // Convert ID (1-based) to Index (0-based)
          // Ensure we don't exceed bounds (e.g., if all 90 answered, stay at 89 or handled by submit)
          const nextIndex = Math.min(nextQuestionId - 1, TOTAL_QUESTIONS - 1);
          setCurrentQIndex(nextIndex);
        }
      } catch (e) {
        console.error("Failed to load progress", e);
        // Do not clear storage immediately on error, to prevent data loss. 
        // Only overwrite on new saves.
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Auto-save logic
  useEffect(() => {
    // Only save if we are actually in assessment mode and have data
    if (screen === 'assessment' && isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, timestamp: Date.now() }));
    }
  }, [answers, screen, isLoaded]);

  const handleStart = () => {
    setAnswers({});
    setCurrentQIndex(0);
    setScreen('assessment');
    // Explicitly clear storage for a fresh start
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleContinue = () => {
    setScreen('assessment');
  };

  const handleAnswer = (questionId: number, score: Score) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (currentQIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const calculateResults = useCallback(() => {
    const factorResults: FactorResult[] = FACTORS.map(factor => {
      let sum = 0;
      let count = 0;
      factor.questionIds.forEach(qId => {
        if (answers[qId]) {
          sum += answers[qId];
          count++;
        }
      });
      const rawScore = sum;
      const averageScore = count > 0 ? sum / count : 1; 
      
      return {
        factorKey: factor.key,
        factorName: factor.name,
        rawScore,
        averageScore,
        isPositive: averageScore >= 2
      };
    });

    const values = Object.values(answers) as number[];
    const totalScore = values.reduce((a, b) => a + b, 0);
    const positiveItemCount = values.filter(v => v >= 2).length;
    const globalSeverityIndex = totalScore / TOTAL_QUESTIONS;

    const finalResult: AssessmentResult = {
      totalScore,
      totalItems: TOTAL_QUESTIONS,
      globalSeverityIndex,
      positiveItemCount,
      factorResults,
      timestamp: Date.now()
    };

    setResult(finalResult);
    setScreen('results');
    
    // Clear storage after successful submission
    localStorage.removeItem(STORAGE_KEY);
  }, [answers]);

  const handleReset = () => {
    setResult(null);
    setAnswers({});
    setCurrentQIndex(0);
    setScreen('landing');
    localStorage.removeItem(STORAGE_KEY);
  };

  // Safe Question Retrieval Strategy
  // 1. Try to get the question at current index
  // 2. If undefined (index out of bounds), fallback to the FIRST question
  // 3. This ensures 'currentQuestion' is NEVER null in the render phase
  const safeQuestion = QUESTIONS[currentQIndex] || QUESTIONS[0];

  // If QUESTIONS array is completely empty (fatal error), show message
  if (!QUESTIONS || QUESTIONS.length === 0) {
    return <div className="p-10 text-center text-red-500">System Error: Question bank not loaded.</div>;
  }

  if (!isLoaded) {
    return <div className="min-h-screen bg-morandi-bg"></div>; // Loading state
  }

  return (
    <div className="antialiased text-gray-700 font-sans">
      {screen === 'landing' && (
        <LandingPage 
          onStart={handleStart} 
          hasSavedData={Object.keys(answers).length > 0} 
          onContinue={handleContinue}
        />
      )}
      
      {screen === 'assessment' && (
        <AssessmentPage
          question={safeQuestion}
          currentQuestionIndex={currentQIndex}
          totalQuestions={TOTAL_QUESTIONS}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={calculateResults}
        />
      )}

      {screen === 'results' && result && (
        <ResultsPage result={result} onReset={handleReset} />
      )}
    </div>
  );
};

export default App;