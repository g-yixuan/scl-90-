import React, { useMemo } from 'react';
import { AssessmentResult } from '../types';
import { generateAssessmentReport } from '../services/localAnalysis';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ResultsPageProps {
  result: AssessmentResult;
  onReset: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result, onReset }) => {
  // Generate the report synchronously using local rules
  const report = useMemo(() => generateAssessmentReport(result), [result]);

  const chartData = report.dimensions.map(d => ({
    subject: d.displayName,
    A: Number(d.score.toFixed(2)),
    fullMark: 5,
    originalName: d.name
  }));

  // Filter dimensions to show in the detailed list
  const sortedDimensions = [...report.dimensions].sort((a, b) => b.score - a.score);
  const prominentDimensions = sortedDimensions.filter(d => d.score >= 2);
  const displayDimensions = prominentDimensions.length > 0 
    ? prominentDimensions 
    : sortedDimensions.slice(0, 3);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur shadow-xl border border-gray-100 p-4 rounded-xl text-sm z-50 min-w-[150px]">
          <p className="font-bold text-morandi-text text-base mb-1">{label}</p>
          <p className="text-xs text-gray-400 mb-2">{data.originalName}</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">得分:</span>
            <span className={`font-mono font-bold text-lg 
              ${data.A >= 3.5 ? 'text-[#E09F95]' : data.A >= 2.5 ? 'text-[#E6C6B6]' : 'text-[#8DA399]'}`}>
              {data.A.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">/ 5.00</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Dot to render color based on value
  const CustomDot = (props: any) => {
    const { cx, cy, value } = props;
    // Morandi Red for high, Accent (Orange-ish) for mid, Primary Green for low
    let fill = '#8DA399'; 
    if (value >= 2.5) fill = '#E6C6B6';
    if (value >= 3.5) fill = '#E09F95';

    return (
      <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={2} />
    );
  };

  return (
    <div className="min-h-screen bg-morandi-bg py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-morandi-text">心灵能量报告</h1>
          <button onClick={onReset} className="text-sm text-morandi-primary underline hover:text-[#7d9389]">
            退出 / 重新测试
          </button>
        </div>

        {/* Crisis Alert */}
        {report.crisisWarning && (
          <div className="bg-[#fff5f5] border-l-4 border-[#E09F95] p-5 rounded-r-xl shadow-sm animate-pulse-slow">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-[#E09F95] text-xl">⚠️</div>
              <div className="ml-4">
                <h3 className="text-base font-bold text-[#c06c5e]">专业援助建议</h3>
                <div className="mt-2 text-sm text-[#a35649] leading-relaxed">
                  <p>检测到您的心理负荷已达到预警值。正如身体生病需要看医生，心灵感冒也需要专业照顾。请不要独自承受，建议寻求专业心理咨询师或医生的帮助，或拨打心理援助热线。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Assessment Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-morandi-primary to-morandi-accent opacity-50"></div>
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h2 className="text-xs font-bold text-morandi-muted uppercase tracking-wider mb-3">总体状态评估</h2>
                <div className="text-3xl md:text-4xl font-bold text-morandi-text mb-4">
                  {report.globalAssessment.label}
                </div>
                
                {/* Enhanced Score Display */}
                <div className="bg-morandi-bg/50 rounded-xl p-3 pr-5 inline-flex items-center gap-4 border border-morandi-primary/10">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-morandi-muted font-medium">GSI 指数</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                          <span className={`text-3xl font-bold font-mono ${result.globalSeverityIndex > 2.5 ? 'text-[#E09F95]' : 'text-morandi-primary'}`}>
                              {result.globalSeverityIndex.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">/ 5.00</span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 mx-2"></div>
                    <div className="text-[10px] text-gray-400 flex flex-col justify-center gap-1">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-morandi-primary"></span> <span>&lt; 1.5 平和</span></div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E09F95]"></span> <span>&gt; 2.5 预警</span></div>
                    </div>
                </div>
              </div>
              <div className="md:max-w-md bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                <span className="absolute -top-3 -left-2 text-4xl text-morandi-primary/20">"</span>
                <p className="text-morandi-text text-sm md:text-base leading-relaxed relative z-10">
                  {report.globalAssessment.text}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart & Summary Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm h-[480px] flex flex-col relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-morandi-primary/5 rounded-bl-full pointer-events-none"></div>

            <div className="flex justify-between items-center mb-2 z-10">
                <h3 className="text-lg font-bold text-morandi-text">心灵维度分布</h3>
                <div className="flex gap-2 text-[10px] font-medium text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8DA399]"></span>舒适</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E6C6B6]"></span>关注</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E09F95]"></span>显著</span>
                </div>
            </div>
            
            <div className="flex-1 w-full min-h-0 z-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <defs>
                    <radialGradient id="radarFill" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#8DA399" stopOpacity="0.3" /> {/* Greenish Center */}
                      <stop offset="50%" stopColor="#E6C6B6" stopOpacity="0.4" /> {/* Beige Mid */}
                      <stop offset="100%" stopColor="#E09F95" stopOpacity="0.6" /> {/* Reddish Edge */}
                    </radialGradient>
                  </defs>
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#718096', fontSize: 11, fontWeight: 500 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 5]} 
                    tickCount={6} 
                    tick={{ fill: '#cbd5e0', fontSize: 10 }} 
                    axisLine={false} 
                  />
                  <Radar
                    name="当前状态"
                    dataKey="A"
                    stroke="#8DA399"
                    strokeWidth={2}
                    fill="url(#radarFill)"
                    fillOpacity={0.8}
                    dot={<CustomDot />} // Use custom dot
                    isAnimationActive={true}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-[10px] text-gray-300 mt-2">
              * 图形越向外扩张（偏红），代表该维度压力越大
            </div>
          </div>

          {/* Key Insights List */}
          <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col h-[480px]">
            <h3 className="text-lg font-bold text-morandi-text mb-6 flex items-center gap-2">
              <span className="text-xl">💡</span> 重点关注维度
            </h3>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {displayDimensions.map((dim) => {
                // Determine styling based on score
                const isHighRisk = dim.score >= 3.5;
                const isMediumRisk = dim.score >= 2.5;
                const riskColor = isHighRisk ? 'bg-[#E09F95]' : isMediumRisk ? 'bg-[#E6C6B6]' : 'bg-[#8DA399]';
                const textColor = isHighRisk ? 'text-[#c06c5e]' : isMediumRisk ? 'text-[#b88c6e]' : 'text-[#6b8278]';
                const barColor = isHighRisk ? 'bg-[#E09F95]' : isMediumRisk ? 'bg-[#E6C6B6]' : 'bg-[#8DA399]';

                return (
                  <div key={dim.key} className="relative pl-4 p-4 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-md transition-all group overflow-hidden">
                    {/* Color indicator strip on left */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${riskColor}`}></div>

                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-morandi-text text-base">{dim.displayName}</span>
                          <span className="text-xs text-gray-400">({dim.name})</span>
                        </div>
                        {/* Mini Progress Bar */}
                        <div className="flex items-center gap-2 w-32">
                          <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${(dim.score / 5) * 100}%` }}></div>
                          </div>
                          <span className={`text-xs font-mono font-bold ${textColor}`}>{dim.score.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 rounded text-xs font-medium 
                        ${dim.severityLevel >= 4 ? 'bg-[#fff5f5] text-[#E09F95]' : 
                          dim.severityLevel === 3 ? 'bg-[#fffbf0] text-[#d4a86a]' : 
                          dim.severityLevel === 2 ? 'bg-[#f7fafc] text-[#718096]' : 'bg-[#f0fdf4] text-[#8DA399]'}`}>
                        {dim.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {dim.content}
                    </p>
                    
                    <div className="bg-morandi-bg p-3 rounded-lg flex gap-3 items-start group-hover:bg-morandi-primary/5 transition-colors">
                      <span className="text-base flex-shrink-0">💊</span>
                      <p className="text-xs text-morandi-text font-medium leading-relaxed mt-0.5">
                        {dim.advice}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {displayDimensions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 text-gray-400">
                  <span className="text-4xl mb-3 opacity-50">🌿</span>
                  <p>您的心灵花园生机勃勃，<br/>没有明显的阴雨区域。</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-gray-400 pb-8 max-w-2xl mx-auto border-t border-gray-200 pt-6">
          <p>免责声明：本测试结果仅供个人心理状态参考，不能代替专业医生的临床诊断。SCL-90量表反映的是您过去一周内的心理感受。</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;