
import React from 'react';

interface Props {
  progress: number;
}

const ProcessingStage: React.FC<Props> = ({ progress }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20">
      <div className="relative mb-12">
        <div className="w-48 h-48 rounded-full border-4 border-slate-800 flex items-center justify-center relative overflow-hidden">
          {/* Wave animation */}
          <div 
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-500/40 to-pink-500/40 transition-all duration-700 ease-out"
            style={{ height: `${progress}%` }}
          />
          <span className="text-4xl font-black font-outfit relative z-10">{progress}%</span>
        </div>
        {/* Orbiting particles */}
        <div className="absolute top-0 left-0 w-full h-full animate-[spin_4s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full blur-sm"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full animate-[spin_6s_linear_infinite_reverse]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-500 rounded-full blur-sm"></div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">AIが動画を分析中...</h2>
        <div className="space-y-2 max-w-md mx-auto">
          <div className="flex items-center gap-3 text-slate-400">
            <div className={`w-4 h-4 rounded-full flex-shrink-0 ${progress > 10 ? 'bg-green-500' : 'bg-slate-700'}`}></div>
            <p className={progress > 10 ? 'text-white' : ''}>ハイライトシーンの抽出</p>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <div className={`w-4 h-4 rounded-full flex-shrink-0 ${progress > 40 ? 'bg-green-500' : 'bg-slate-700'}`}></div>
            <p className={progress > 40 ? 'text-white' : ''}>音声とキャプションの最適化</p>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <div className={`w-4 h-4 rounded-full flex-shrink-0 ${progress > 70 ? 'bg-green-500' : 'bg-slate-700'}`}></div>
            <p className={progress > 70 ? 'text-white' : ''}>メタデータの自動生成 (YouTube / TikTok)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStage;
