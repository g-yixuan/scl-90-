import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  hasSavedData: boolean;
  onContinue: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, hasSavedData, onContinue }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="max-w-2xl bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-xl border border-white">
        
        {/* Logo / Header Area */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-morandi-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🌿
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-morandi-text tracking-tight mb-3">
            心灵小憩补给站
          </h1>
          <p className="text-morandi-muted text-lg font-light">
            SCL-90 专业心理健康自评
          </p>
        </div>

        {/* Introduction */}
        <div className="space-y-6 mb-10 text-left md:text-center text-morandi-text/80 leading-relaxed">
          <p>
            累了吗？来这里歇歇脚。在快节奏的生活中，我们往往容易忽略内心的声音。
          </p>
          <p>
            这不仅仅是一份测试，更是一次与自我对话的机会。大约需要 <strong>5-10 分钟</strong>，
            通过 90 道题目，我们将为您生成一份专属的心灵能量报告。
          </p>
          
          <div className="bg-morandi-bg p-4 rounded-xl text-sm text-morandi-muted mt-6">
            <h3 className="font-bold mb-2 text-morandi-text">📝 郑重承诺</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>本测试完全匿名，数据仅在本地处理（除AI分析外）。</li>
              <li>结果仅供参考，不作为医疗诊断依据。</li>
              <li>如果您感到极度痛苦，请务必寻求专业医生帮助。</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          {hasSavedData ? (
            <button
              onClick={onContinue}
              className="w-full py-4 bg-morandi-primary hover:bg-[#7d9389] text-white rounded-xl font-medium shadow-lg shadow-morandi-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              继续上次的探索
            </button>
          ) : (
            <button
              onClick={onStart}
              className="w-full py-4 bg-morandi-primary hover:bg-[#7d9389] text-white rounded-xl font-medium shadow-lg shadow-morandi-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              开启心灵探索
            </button>
          )}
          
          {hasSavedData && (
             <button
             onClick={onStart}
             className="w-full py-3 text-morandi-muted hover:text-morandi-text text-sm transition-colors"
           >
             重新开始
           </button>
          )}
        </div>
      </div>
      
      <footer className="mt-8 text-morandi-muted/60 text-xs">
        © 2024 Soul Rest Station. Based on SCL-90.
      </footer>
    </div>
  );
};

export default LandingPage;