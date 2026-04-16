"use client"

const STEPS = ["Initialising…", "Fetching assets…", "Syncing data…", "Building UI…", "Almost there…", "Ready."]

const particles = [
  { r: 52,  speed: 3.2,  size: 5, color: "#38bdf8", delay: 0   },
  { r: 52,  speed: 3.2,  size: 3, color: "#7dd3fc", delay: 0.5 },
  { r: 76,  speed: 5.1,  size: 6, color: "#0ea5e9", delay: 0   },
  { r: 76,  speed: 5.1,  size: 3, color: "#bae6fd", delay: 0.7 },
  { r: 100, speed: 7.8,  size: 7, color: "#0284c7", delay: 0   },
  { r: 100, speed: 7.8,  size: 4, color: "#38bdf8", delay: 1.1 },
  { r: 124, speed: 11.0, size: 5, color: "#0369a1", delay: 0   },
  { r: 124, speed: 11.0, size: 3, color: "#7dd3fc", delay: 1.6 },
]

export default function LoadingProject({ progress = 0, preview = false }) {
    const clamped = Math.min(100, Math.max(0, progress))
    const msgIdx  = Math.min(Math.floor((clamped / 100) * STEPS.length), STEPS.length - 1)
    const scale   = preview ? "scale-[0.55]" : "scale-100"

    return (
        <div
            className={`flex flex-col items-center justify-center w-full h-full bg-[#060b14] ${preview ? "" : "min-h-screen"}`}
            role="status"
            aria-live="polite"
            aria-label={`Loading ${clamped}%: ${STEPS[msgIdx]}`}
        >
        <div className={`flex flex-col items-center gap-10 origin-center ${scale}`}>

            {/* Orbital system */}
            <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
                {/* Orbit rings */}
                {[52, 76, 100, 124].map((r) => (
                    <div
                        key={r}
                        className="absolute rounded-full border border-white/5"
                        style={{ width: r * 2, height: r * 2 }}
                        aria-hidden="true"
                    />
                ))}

            {/* Core glow */}
            <div
                className="absolute rounded-full z-10"
                style={{
                    width: 52,
                    height: 52,
                    background: "radial-gradient(circle at 35% 35%, #7dd3fc, #0369a1)",
                    boxShadow: "0 0 24px rgba(56,189,248,0.7), 0 0 60px rgba(56,189,248,0.25)",
                }}
                aria-hidden="true"
            />

                {/* Orbiting particles */}
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            width: p.r * 2,
                            height: p.r * 2,
                            animation: `spotteq-orbit-${i} ${p.speed}s linear infinite`,
                            animationDelay: `-${p.delay}s`,
                        }}
                        aria-hidden="true"
                    >
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: p.size,
                            height: p.size,
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: p.color,
                            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                        }}
                    />
                    </div>
                ))}
            </div>

            {/* Brand */}
            <div className="text-center -mt-4">
                <p className="text-2xl font-bold tracking-[0.2em] text-white">SPOTTEQ</p>
                <p className="text-[11px] font-mono text-sky-400/60 tracking-[0.3em] uppercase mt-1">Loading</p>
            </div>

            {/* Progress bar + status */}
            <div className="flex flex-col items-center gap-3 w-64">
                <div className="w-full h-px bg-white/10 relative overflow-hidden">
                    <div
                    className="absolute left-0 top-0 h-full transition-all duration-500"
                    style={{
                        width: `${clamped}%`,
                        background: "linear-gradient(90deg, #0284c7, #38bdf8)",
                        boxShadow: "0 0 8px #38bdf8",
                    }}
                    />
                </div>
                <div className="flex w-full justify-between items-center">
                    <span className="text-xs font-mono text-white/30">{STEPS[msgIdx]}</span>
                    <span className="text-xs font-mono text-sky-400 tabular-nums">{Math.floor(clamped)}%</span>
                </div>
            </div>
        </div>

        <style>{`
            ${particles.map((_, i) => `
            @keyframes spotteq-orbit-${i} {
                from { transform: rotate(${i * 45}deg); }
                to   { transform: rotate(${i * 45 + 360}deg); }
            }
            `).join("")}
        `}</style>
        </div>
    )
}
