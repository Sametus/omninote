
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onStart: (mode: 'tablet' | 'pc', roomId: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [code, setCode] = useState('ODA-1');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("Bu uygulamayı APK gibi yüklemek için:\n\n1. Tarayıcı menüsüne (üç nokta) basın.\n2. 'Uygulamayı Yükle' veya 'Ana Ekrana Ekle'yi seçin.\n\nBu sayede S-Pen tam performanslı çalışacaktır.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 overflow-y-auto relative text-white">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="z-10 w-full max-w-4xl text-center space-y-10 py-10">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
            Omni<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 text-glow">Note</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
            Android Tablet ve Windows 11 için S-Pen optimize edilmiş profesyonel çalışma alanı.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={handleInstallClick}
            className="group relative flex items-center gap-4 px-10 py-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.5)] transition-all active:scale-95 border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.523 15.3414C17.0261 15.3414 16.6231 14.9384 16.6231 14.4414C16.6231 13.9445 17.0261 13.5414 17.523 13.5414C18.02 13.5414 18.423 13.9445 18.423 14.4414C18.423 14.9384 18.02 15.3414 17.523 15.3414ZM6.47696 15.3414C5.98004 15.3414 5.57703 14.9384 5.57703 14.4414C5.57703 13.9445 5.98004 13.5414 6.47696 13.5414C6.97388 13.5414 7.37689 13.9445 7.37689 14.4414C7.37689 14.9384 6.97388 15.3414 6.47696 15.3414ZM17.915 11.2365L19.742 8.07185C19.839 7.90382 19.782 7.68981 19.614 7.59283C19.446 7.49585 19.232 7.55283 19.135 7.72087L17.284 10.9264C15.792 10.2454 13.987 9.85535 12 9.85535C10.013 9.85535 8.208 10.2454 6.716 10.9264L4.865 7.72087C4.768 7.55283 4.554 7.49585 4.386 7.59283C4.218 7.68981 4.161 7.90382 4.258 8.07185L6.085 11.2365C3.064 12.8795 1 15.9525 1 19.5445H23C23 15.9525 20.936 12.8795 17.915 11.2365Z" />
            </svg>
            <span className="text-xl">TABLETE UYGULAMA OLARAK KUR</span>
          </button>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">PWA Teknolojisi: APK'dan Daha Akıcı ve Güvenli</p>
        </div>

        <div className="max-w-sm mx-auto space-y-4 pt-6">
          <input 
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full bg-slate-900 border-2 border-slate-800 text-white text-center text-4xl font-black py-6 rounded-[2.5rem] focus:border-blue-500 outline-none transition-all shadow-2xl"
            placeholder="ODA KODU"
          />
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => onStart('tablet', code)} className="bg-white/5 border border-white/10 py-6 rounded-3xl font-bold hover:bg-white/10 transition-all">TABLET MODU</button>
            <button onClick={() => onStart('pc', code)} className="bg-white/5 border border-white/10 py-6 rounded-3xl font-bold hover:bg-white/10 transition-all">PC MODU</button>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6 text-left max-w-2xl mx-auto">
          <h4 className="font-bold text-blue-400 mb-2">💡 S-Pen İpucu:</h4>
          <p className="text-sm text-slate-400">
            Kalemin yanındaki düğmeye basılı tutarak çizim yaparsanız otomatik olarak **SİLGİ** aktifleşir. Düğmeyi bıraktığınızda tekrar kaleme döner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
