'use client';

export default function UnderConstructionPage() {
  return (
    <>
      <style jsx>{`
        @keyframes elixirAnimation {
          0% { transform: rotate(0deg) scale(1); }
          10% { transform: rotate(-15deg) scale(1.1); }
          20% { transform: rotate(15deg) scale(1.1); }
          30% { transform: rotate(-10deg) scale(1.05); }
          40% { transform: rotate(10deg) scale(1.05); }
          50% { transform: rotate(0deg) scale(1); }
          60% { transform: rotate(0deg) scale(1); }
          70% { transform: rotate(90deg) scale(1); }
          80% { transform: rotate(180deg) scale(1); }
          90% { transform: rotate(270deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        .elixir-flask {
          animation: elixirAnimation 4s ease-in-out infinite;
          transform-origin: center;
        }
        .cls-1{
          fill:#5233ff;
        }
        .cls-2{
          fill:#ff64c8;
        }
      `}</style>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-green-500">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            {/* Animated elixir flask */}
            <div className="w-32 h-32 mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <svg className="w-16 h-16 text-white elixir-flask" fill="currentColor" viewBox="0 0 32 32">
                {/* Elixir flask SVG */}
                <g data-name="Layer 6" id="Layer_6">
                  <path className="cls-1" d="M26,19.72a10,10,0,0,0-6-8.88V8h1a1,1,0,0,0,0-2H11a1,1,0,0,0,0,2h1v2.84a10,10,0,0,0-5.84,7.44A9,9,0,0,0,6,20a2.62,2.62,0,0,0,0,.28,10,10,0,0,0,19.84,1.44A9.74,9.74,0,0,0,26,20,2.62,2.62,0,0,0,26,19.72Zm-2.16,1.93A8,8,0,0,1,8,20.36c0-.12,0-.24,0-.36a7.43,7.43,0,0,1,.18-1.64,8,8,0,0,1,5.15-5.89,1,1,0,0,0,.67-1V8h4v3.52a1,1,0,0,0,.67,1A8,8,0,0,1,24,19.64,2.17,2.17,0,0,1,24,20,8.17,8.17,0,0,1,23.83,21.65Z"/>
                  <path className="cls-2" d="M22,20a6,6,0,0,1-12,0,5.29,5.29,0,0,1,.1-1.06l.33.16a5.12,5.12,0,0,0,2.57.62,5.12,5.12,0,0,0,2.57-.62A6.84,6.84,0,0,1,19,18.28a6.75,6.75,0,0,1,2.89.57A6.23,6.23,0,0,1,22,20Z"/>
                  <path className="cls-2" d="M8,8a.76.76,0,0,1-.75.75,1.51,1.51,0,0,0-1.5,1.5.75.75,0,0,1-1.5,0,1.5,1.5,0,0,0-1.5-1.5.75.75,0,0,1,0-1.5,1.5,1.5,0,0,0,1.5-1.5.75.75,0,0,1,1.5,0,1.51,1.51,0,0,0,1.5,1.5A.76.76,0,0,1,8,8Z"/>
                  <path className="cls-2" d="M30,5a.76.76,0,0,1-.75.75,1.51,1.51,0,0,0-1.5,1.5.75.75,0,0,1-1.5,0,1.5,1.5,0,0,0-1.5-1.5.75.75,0,0,1,0-1.5,1.5,1.5,0,0,0,1.5-1.5.75.75,0,0,1,1.5,0,1.51,1.51,0,0,0,1.5,1.5A.76.76,0,0,1,30,5Z"/>
                </g>
              </svg>
            </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            USKORO!
          </h1>
          
          <p className="text-2xl md:text-3xl text-white/90 mb-8 font-light drop-shadow-lg">
            Naši alhemičari kuvaju nešto <span className="font-bold text-yellow-300">potpuno novo i uzbudljivo!</span>
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
              U staroj laboratoriji se spremaju zabavne stvari! 
              Naši alhemičari su rade naporno sa mističnim knjigama i uzbudljivim sastojcima
              kuvajući nešto samo za vas. Vidimo se ubrzo!
            </p>
          </div>
        </div>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-yellow-300/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-pink-300/30 rounded-full animate-bounce delay-500"></div>
        </div>
      </div>
    </>
  );
}