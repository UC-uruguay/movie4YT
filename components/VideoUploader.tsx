
import React, { useRef } from 'react';
import { VideoFile } from '../types';

interface Props {
  videos: VideoFile[];
  onVideosSelected: (videos: VideoFile[]) => void;
  onStart: () => void;
  setVideos: React.Dispatch<React.SetStateAction<VideoFile[]>>;
}

const VideoUploader: React.FC<Props> = ({ videos, onVideosSelected, onStart, setVideos }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Explicitly cast to File[] to resolve 'unknown' type issues in some environments
    const files = Array.from(e.target.files || []) as File[];
    const newVideos: VideoFile[] = files.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      // File is now correctly typed as Blob | MediaSource for createObjectURL
      previewUrl: URL.createObjectURL(file),
      duration: 120, // Default duration if not extracted
      status: 'pending'
    }));

    // In a real scenario, we'd use a temporary <video> element to get metadata.duration
    newVideos.forEach(v => {
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => {
        setVideos(prev => prev.map(p => p.id === v.id ? { ...p, duration: vid.duration } : p));
      };
      vid.src = v.previewUrl;
    });

    onVideosSelected(newVideos);
  };

  const removeVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 max-w-4xl mx-auto w-full py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black font-outfit mb-4">
          長尺動画を<br />
          <span className="gradient-text">1/4のショート動画に。</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          AIが動画の最も興味深いシーンを自動抽出。
          YouTube ShortsとTikTokに最適化されたタイトル・説明・ハッシュタグを即座に生成。
        </p>
      </div>

      <div 
        className="w-full aspect-[21/9] glass rounded-3xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept="video/*" 
          onChange={handleFileChange} 
        />
        
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-slate-200">動画をアップロード</p>
        <p className="text-slate-500 text-sm mt-1">またはドラッグ＆ドロップ (複数可)</p>
      </div>

      {videos.length > 0 && (
        <div className="w-full mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">アップロード済み ({videos.length})</h3>
            <button 
              onClick={onStart}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              AIでマジック編集を開始
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="glass rounded-xl overflow-hidden relative group">
                <video src={video.previewUrl} className="w-full h-32 object-cover opacity-60" />
                <div className="p-4 flex items-center justify-between">
                  <div className="truncate pr-4">
                    <p className="font-medium text-sm truncate">{video.file.name}</p>
                    <p className="text-xs text-slate-500">{Math.round(video.duration)}s</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeVideo(video.id); }}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
