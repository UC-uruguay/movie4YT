
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, VideoFile, ProcessingResult } from './types';
import VideoUploader from './components/VideoUploader';
import ProcessingStage from './components/ProcessingStage';
import ResultDashboard from './components/ResultDashboard';
import { analyzeVideoContent } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleVideosSelected = (newVideos: VideoFile[]) => {
    setVideos(prev => [...prev, ...newVideos]);
  };

  const startProcessing = async () => {
    if (videos.length === 0) return;
    
    setState(AppState.PROCESSING);
    setProgress(10);

    try {
      // Aggregate info for analysis
      const totalDuration = videos.reduce((acc, v) => acc + v.duration, 0);
      const videoMeta = {
        name: videos[0].file.name,
        size: videos[0].file.size,
        type: videos[0].file.type,
        duration: totalDuration
      };

      // Simulated progress
      const timer = setInterval(() => {
        setProgress(p => (p < 90 ? p + 5 : p));
      }, 800);

      const aiResult = await analyzeVideoContent(videoMeta);
      
      clearInterval(timer);
      setProgress(100);
      setResult(aiResult);
      
      setTimeout(() => {
        setState(AppState.RESULT);
      }, 500);
    } catch (error) {
      console.error("Processing failed", error);
      alert("AI分析に失敗しました。APIキーまたはネットワークを確認してください。");
      setState(AppState.UPLOAD);
    }
  };

  const reset = () => {
    setVideos([]);
    setResult(null);
    setProgress(0);
    setState(AppState.UPLOAD);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full -z-10"></div>

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center glass sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-outfit font-black tracking-tight">ClipGenius <span className="gradient-text">AI</span></span>
        </div>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">How it works</a>
          <a href="#" className="hover:text-white transition-colors">Templates</a>
        </nav>

        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all border border-slate-700">
          Sign In
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col">
        {state === AppState.UPLOAD && (
          <VideoUploader 
            videos={videos} 
            onVideosSelected={handleVideosSelected} 
            onStart={startProcessing}
            setVideos={setVideos}
          />
        )}
        
        {state === AppState.PROCESSING && (
          <ProcessingStage progress={progress} />
        )}

        {state === AppState.RESULT && result && (
          <ResultDashboard result={result} onReset={reset} />
        )}
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-slate-500 text-sm">
        <p>&copy; 2024 ClipGenius AI. Built with Gemini 3 for ultimate viral reach.</p>
      </footer>
    </div>
  );
};

export default App;
