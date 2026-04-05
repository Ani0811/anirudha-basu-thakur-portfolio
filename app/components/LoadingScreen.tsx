import React from "react";

interface Props {
  bootText: number;
  bootMessages: string[];
}

export default function LoadingScreen({ bootText, bootMessages }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030305] text-cyan-400 font-mono overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 pointer-events-none" />
      <div className="w-full max-w-md px-8 text-center relative z-10">
        <h1 className="text-4xl font-bold tracking-widest text-white mb-12 animate-pulse glow-text">
          ANI.DEV
        </h1>
        <div className="h-32 text-left mb-8 text-sm">
          {bootMessages.slice(0, bootText).map((msg, i) => (
            <p key={i} className="mb-2 opacity-80 animate-fade-in-up flex items-center">
              <span className="text-green-500 mr-3">✓</span> {msg}
            </p>
          ))}
          {bootText < bootMessages.length && (
            <p className="animate-pulse pl-5 opacity-70">_</p>
          )}
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-cyan-500 transition-all duration-500 ease-out shadow-[0_0_10px_#06b6d4]"
            style={{ width: `${(bootText / bootMessages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

