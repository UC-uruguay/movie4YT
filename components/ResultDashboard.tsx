
import React, { useState } from 'react';
import { ProcessingResult } from '../types';

interface Props {
  result: ProcessingResult;
  onReset: () => void;
}

const ResultDashboard: React.FC<Props> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'youtube' | 'tiktok'>('youtube');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('クリップボードにコピーしました！');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit">編集完了！🎉</h2>
          <p className="text-slate-400">AIが最適な1/4の長さに短縮しました。</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onReset}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all border border-slate-700"
          >
            新しく作り直す
          </button>
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all">
            HD動画をダウンロード
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Preview */}
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl overflow-hidden aspect-[9/16] relative shadow-2xl border-indigo-500/20 border-2">
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-bold">生成されたショート動画</p>
                <p className="text-xs text-slate-500 mt-2">{Math.round(result.targetDuration)}秒 / {Math.round(result.originalDuration)}秒</p>
              </div>
            </div>
            {/* Mock TikTok Interface overlay */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="font-bold text-white">@ClipGenius_User</p>
              <p className="text-sm text-slate-200 mt-1 line-clamp-2">{result.title}</p>
              <div className="flex gap-2 mt-2">
                {result.hashtags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs font-bold text-white/80">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Details and Metadata */}
        <div className="lg:col-span-2 space-y-8">
          {/* Viral Score Card */}
          <div className="glass p-6 rounded-2xl flex items-center gap-6">
            <div className="flex-1">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">推定バズりスコア</p>
              <h3 className="text-5xl font-black font-outfit mt-1">{result.viralScore}<span className="text-2xl text-slate-600">/100</span></h3>
            </div>
            <div className="w-1/2 space-y-2">
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500" style={{ width: `${result.viralScore}%` }}></div>
              </div>
              <p className="text-xs text-slate-500">この動画はトレンドキーワードとの親和性が非常に高いです。</p>
            </div>
          </div>

          {/* Platform Tab Content */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex border-b border-slate-700">
              <button 
                onClick={() => setActiveTab('youtube')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'youtube' ? 'bg-indigo-500/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                YouTube Shorts 向け
              </button>
              <button 
                onClick={() => setActiveTab('tiktok')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'tiktok' ? 'bg-pink-500/10 text-pink-400 border-b-2 border-pink-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                TikTok 向け
              </button>
            </div>

            <div className="p-6 space-y-6">
              {activeTab === 'youtube' ? (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">タイトル</label>
                      <button onClick={() => copyToClipboard(result.platforms.youtube.title)} className="text-indigo-400 text-xs hover:underline">コピー</button>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-lg font-medium">
                      {result.platforms.youtube.title}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">タグ</label>
                      <button onClick={() => copyToClipboard(result.platforms.youtube.tags.join(', '))} className="text-indigo-400 text-xs hover:underline">コピー</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.platforms.youtube.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-sm text-slate-300">{tag}</span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">キャプション</label>
                      <button onClick={() => copyToClipboard(result.platforms.tiktok.caption)} className="text-pink-400 text-xs hover:underline">コピー</button>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      {result.platforms.tiktok.caption}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">ハッシュタグ</label>
                      <button onClick={() => copyToClipboard(result.platforms.tiktok.tags.join(' '))} className="text-pink-400 text-xs hover:underline">コピー</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.platforms.tiktok.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-sm text-slate-300">{tag}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Highlight Segments List */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
              </svg>
              AIが抽出したハイライト地点
            </h3>
            <div className="space-y-3">
              {result.highlightSegments.map((seg, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{seg.description}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{Math.round(seg.start)}s 〜 {Math.round(seg.end)}s</p>
                  </div>
                  <div className="text-xs font-bold text-indigo-400">
                    High Impact
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDashboard;
