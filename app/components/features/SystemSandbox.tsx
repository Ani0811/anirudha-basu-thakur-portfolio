'use client';

import { useState, useEffect, useRef } from 'react';

type Node = 'client' | 'gateway' | 'cache' | 'server' | 'db';
type GameState = 'idle' | 'defending' | 'won' | 'lost';

interface Particle {
  id: number;
  route: Node[];
  progress: number; // 0 to 1 along current segment
  segmentIndex: number;
  speed: number;
  status: 'normal' | 'spam' | 'blocked' | 'success';
}

const desktopPositions: Record<Node, { x: number; y: number }> = {
  client: { x: 60, y: 150 },
  gateway: { x: 260, y: 150 },
  cache: { x: 470, y: 60 },
  server: { x: 470, y: 240 },
  db: { x: 710, y: 240 },
};

const mobilePositions: Record<Node, { x: number; y: number }> = {
  client: { x: 160, y: 40 },
  gateway: { x: 160, y: 140 },
  cache: { x: 60, y: 250 },
  server: { x: 260, y: 250 },
  db: { x: 260, y: 395 },
};

export default function SystemSandbox() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [isMobileFlow, setIsMobileFlow] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileFlow(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const positions = isMobileFlow ? mobilePositions : desktopPositions;
  const [credits, setCredits] = useState(0);
  const [dbHealth, setDbHealth] = useState(100);
  const [timer, setTimer] = useState(45); // Defense duration: 45s
  
  // Upgrades states
  const [upgrades, setUpgrades] = useState({
    rateLimiter: false,
    cache: false,
    serverScale: false,
    dbReplica: false,
  });

  // Game stats
  const [stats, setStats] = useState({
    handled: 0,
    blocked: 0,
    crashedAt: 0,
  });

  const [particles, setParticles] = useState<Particle[]>([]);
  const requestAnimationFrameRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(performance.now());
  const particleIdCounter = useRef<number>(0);

  // SVG dimensions
  const width = 800;
  const height = 300;

  // Database capacity calculations
  const activeDbRequests = particles.filter(
    p => p.status !== 'blocked' && 
         ((p.route[p.segmentIndex] === 'server' && p.route[p.segmentIndex + 1] === 'db') ||
          (p.route[p.segmentIndex] === 'db' && p.route[p.segmentIndex + 1] === 'server'))
  ).length;

  const dbCapacity = upgrades.dbReplica ? 10 : 4;
  const isDbOverloaded = activeDbRequests > dbCapacity;

  // Handle Game Timer
  useEffect(() => {
    if (gameState !== 'defending') return;

    const gameInterval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(gameInterval);
          setGameState('won');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameInterval);
  }, [gameState]);

  // Main animation / simulation loop
  useEffect(() => {
    let prevTime = performance.now();

    const animate = (time: number) => {
      const dt = time - prevTime;
      prevTime = time;

      // 1. Spawning Traffic
      let trafficRate = 2; // base rate when idle
      let spamChance = 0; // chance of malicious red traffic
      let cacheHitRate = upgrades.cache ? 75 : 15;

      if (gameState === 'defending') {
        // Ramp up difficulty based on timer
        if (timer > 30) {
          // Phase 1: 15 req/s, 25% spam
          trafficRate = 12;
          spamChance = 0.25;
        } else if (timer > 15) {
          // Phase 2: 25 req/s, 50% spam
          trafficRate = 24;
          spamChance = 0.50;
        } else {
          // Phase 3: 45 req/s, 80% spam
          trafficRate = 42;
          spamChance = 0.80;
        }
      }

      const spawnInterval = 1000 / trafficRate;
      if (time - lastSpawnTimeRef.current > spawnInterval) {
        lastSpawnTimeRef.current = time;

        const isSpam = Math.random() < spamChance;
        let route: Node[] = [];
        let status: Particle['status'] = isSpam ? 'spam' : 'normal';

        if (isSpam) {
          // Spam goes straight to server/DB to cause overload
          route = ['client', 'gateway', 'server', 'db', 'server', 'gateway', 'client'];
        } else {
          const isCacheHit = Math.random() * 100 < cacheHitRate;
          route = isCacheHit
            ? ['client', 'gateway', 'cache', 'gateway', 'client']
            : ['client', 'gateway', 'server', 'db', 'server', 'gateway', 'client'];
        }

        const newParticle: Particle = {
          id: particleIdCounter.current++,
          route,
          progress: 0,
          segmentIndex: 0,
          speed: 0.0012, // slightly faster travel
          status,
        };

        // Edge Rate Limiting Filter logic
        if (upgrades.rateLimiter && isSpam && Math.random() < 0.70) {
          // Intercepted and blocked at Gateway (70% filter rate)
          newParticle.status = 'blocked';
          newParticle.route = ['client', 'gateway', 'client'];
        }

        setParticles(prev => [...prev, newParticle]);
      }

      // 2. Database Health load impact
      if (gameState === 'defending') {
        if (isDbOverloaded) {
          const overloadDegree = activeDbRequests - dbCapacity;
          // Drain rate increases with size of overload
          const drainRate = 0.008 * overloadDegree; 
          setDbHealth(prev => {
            const next = prev - (drainRate * dt);
            if (next <= 0) {
              setGameState('lost');
              return 0;
            }
            return next;
          });
        } else {
          // Slow passive healing when not overloaded
          setDbHealth(prev => Math.min(100, prev + (0.002 * dt)));
        }
      }

      // 3. Update active particles position and state transitions
      setParticles(prevParticles => {
        const nextParticles = prevParticles.map(p => {
          let speedMultiplier = 1;
          const currentTarget = p.route[p.segmentIndex + 1];
          const currentSource = p.route[p.segmentIndex];

          // Server speed scaling factor
          if (currentTarget === 'server' || currentSource === 'server') {
            speedMultiplier = upgrades.serverScale ? 2.0 : 1.0;
          }

          // DB Latency slow-down if DB is overloaded
          if (currentTarget === 'db' || currentSource === 'db') {
            const loadRatio = activeDbRequests / dbCapacity;
            speedMultiplier = Math.max(0.15, 1.2 - (loadRatio * 0.25));
          }

          let nextProgress = p.progress + (p.speed * speedMultiplier * dt);
          let nextSegment = p.segmentIndex;
          let nextStatus = p.status;

          // Arrived at next node boundary
          if (nextProgress >= 1.0) {
            nextProgress = 0;
            nextSegment++;

            // Reached final client destination
            if (nextSegment === p.route.length - 1) {
              if (p.status === 'blocked') {
                setStats(s => ({ ...s, blocked: s.blocked + 1 }));
                // Blocked malicious queries don't earn money, but protect DB
              } else {
                nextStatus = 'success';
                setStats(s => ({ ...s, handled: s.handled + 1 }));
                // Successfully completed queries earn credits
                setCredits(c => c + 5);
              }
            }
          }

          return {
            ...p,
            progress: nextProgress,
            segmentIndex: nextSegment,
            status: nextStatus,
          };
        });

        // Filter out completed particles
        return nextParticles.filter(p => p.segmentIndex < p.route.length - 1);
      });

      requestAnimationFrameRef.current = requestAnimationFrame(animate);
    };

    requestAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);
    };
  }, [gameState, timer, upgrades, activeDbRequests, dbCapacity, isDbOverloaded]);

  // Handle game start/restart
  const startDefense = () => {
    setGameState('defending');
    setDbHealth(100);
    setCredits(0);
    setTimer(45);
    setParticles([]);
    setUpgrades({
      rateLimiter: false,
      cache: false,
      serverScale: false,
      dbReplica: false,
    });
    setStats({
      handled: 0,
      blocked: 0,
      crashedAt: 0,
    });
  };

  const resetGame = () => {
    setGameState('idle');
    setDbHealth(100);
    setCredits(0);
    setParticles([]);
    setUpgrades({
      rateLimiter: false,
      cache: false,
      serverScale: false,
      dbReplica: false,
    });
  };

  // Upgrade handlers
  const purchaseUpgrade = (type: keyof typeof upgrades, cost: number) => {
    if (credits >= cost && !upgrades[type]) {
      setCredits(prev => prev - cost);
      setUpgrades(prev => ({ ...prev, [type]: true }));
    }
  };

  const getParticlePos = (p: Particle) => {
    const from = positions[p.route[p.segmentIndex]];
    const to = positions[p.route[p.segmentIndex + 1]];
    if (!from || !to) return { x: 0, y: 0 };

    return {
      x: from.x + (to.x - from.x) * p.progress,
      y: from.y + (to.y - from.y) * p.progress,
    };
  };

  return (
    <div className="w-full flex flex-col gap-6 font-mono">
      {/* Game State Panels */}
      <div className={`relative overflow-hidden border p-5 rounded-2xl transition-all duration-300 ${
        gameState === 'defending' && isDbOverloaded 
          ? 'bg-red-950/20 border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse'
          : gameState === 'defending'
          ? 'bg-cyan-950/10 border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
          : gameState === 'won'
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
          : gameState === 'lost'
          ? 'bg-slate-950 border-red-500/50 text-red-500 shadow-[0_0_35px_rgba(220,38,38,0.25)]'
          : 'bg-black/40 border-cyan-500/10 text-slate-400'
      }`}>
        
        {gameState === 'idle' && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">&gt; SECURITY FIREWALL: STANDBY</h4>
              <p className="text-xs text-slate-400 max-w-lg">Click start to launch simulated traffic and defend the database from an escalating DDoS flood.</p>
            </div>
            <button 
              onClick={startDefense}
              className="px-6 py-2.5 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 transition-all font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer active:scale-95"
            >
              START DEFENSE SIMULATION
            </button>
          </div>
        )}

        {gameState === 'defending' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
            {/* Health Bar */}
            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isDbOverloaded ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                  DATABASE HEALTH
                </span>
                <span className={dbHealth < 40 ? 'text-red-400 font-black' : 'text-cyan-400'}>
                  {Math.ceil(dbHealth)}%
                </span>
              </div>
              <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-100 rounded-full ${
                    dbHealth < 35 
                      ? 'bg-linear-to-r from-red-600 to-red-500 animate-pulse' 
                      : dbHealth < 70 
                      ? 'bg-linear-to-r from-yellow-500 to-yellow-400' 
                      : 'bg-linear-to-r from-emerald-500 to-cyan-400'
                  }`}
                  style={{ width: `${dbHealth}%` }}
                />
              </div>
            </div>

            {/* Time Remaining */}
            <div className="flex flex-col items-center sm:items-start pl-0 sm:pl-4 border-l border-white/5">
              <span className="text-[10px] text-slate-500 tracking-wider">DEFENSE TIME</span>
              <span className="text-xl sm:text-2xl font-black text-white">{timer}s</span>
            </div>

            {/* Credits Counter */}
            <div className="flex flex-col items-center sm:items-start pl-0 sm:pl-4 border-l border-white/5">
              <span className="text-[10px] text-slate-500 tracking-wider">COMPUTE CREDITS</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-300">🪙 {credits}</span>
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="flex flex-col items-center text-center py-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl">✓</div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-emerald-400">DDoS ATTACK DEFLECTED!</h4>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">Your configuration successfully filtered spam queries and absorbed the load. Database health stabilized at {Math.ceil(dbHealth)}%. Handled {stats.handled} secure transactions.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={startDefense}
                className="px-5 py-2 rounded-full bg-emerald-500 text-black font-bold text-xs transition-colors hover:bg-emerald-400 cursor-pointer"
              >
                PLAY AGAIN
              </button>
              <button 
                onClick={resetGame}
                className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 font-bold text-xs transition-colors hover:text-white cursor-pointer"
              >
                CLOSE GAME
              </button>
            </div>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="flex flex-col items-center text-center py-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-xl">☠</div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-red-500">SYSTEM DOWN: DATABASE CRASHED</h4>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">Un-cached queries saturated the database connection pool, pushing latency past limits. Handled {stats.handled} requests, but failed under load.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={startDefense}
                className="px-5 py-2 rounded-full bg-red-500 text-black font-bold text-xs transition-colors hover:bg-red-400 cursor-pointer animate-pulse"
              >
                REBOOT & RETRY
              </button>
              <button 
                onClick={resetGame}
                className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 font-bold text-xs transition-colors hover:text-white cursor-pointer"
              >
                RESET ARCHITECTURE
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Shop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Rate Limiter */}
        <button
          disabled={credits < 120 || upgrades.rateLimiter || gameState !== 'defending'}
          onClick={() => purchaseUpgrade('rateLimiter', 120)}
          className={`flex flex-col items-start text-left p-4 rounded-xl border text-xs gap-1.5 transition-all select-none duration-300 relative ${
            upgrades.rateLimiter 
              ? 'bg-orange-950/20 border-orange-500/40 text-orange-300' 
              : credits >= 120 && gameState === 'defending'
              ? 'bg-slate-900/40 border-cyan-500/30 hover:border-cyan-400 text-slate-200 cursor-pointer hover:scale-[1.03] active:scale-95'
              : 'bg-black/10 border-white/5 text-slate-600 cursor-not-allowed'
          }`}
        >
          <div className="flex justify-between w-full font-bold">
            <span>🛡 RATE LIMITER</span>
            {!upgrades.rateLimiter && <span className="text-cyan-400/90 font-mono">120 Cr</span>}
          </div>
          <p className="text-[10px] leading-relaxed text-slate-400">
            Filters and drops 70% of malicious requests (red dots) at the Gateway node.
          </p>
          {upgrades.rateLimiter && <span className="absolute bottom-2 right-3 font-bold text-[9px] px-1 bg-orange-500 text-black rounded uppercase">ACTIVE</span>}
        </button>

        {/* Cache Expansion */}
        <button
          disabled={credits < 100 || upgrades.cache || gameState !== 'defending'}
          onClick={() => purchaseUpgrade('cache', 100)}
          className={`flex flex-col items-start text-left p-4 rounded-xl border text-xs gap-1.5 transition-all select-none duration-300 relative ${
            upgrades.cache 
              ? 'bg-purple-950/20 border-purple-500/40 text-purple-300' 
              : credits >= 100 && gameState === 'defending'
              ? 'bg-slate-900/40 border-cyan-500/30 hover:border-cyan-400 text-slate-200 cursor-pointer hover:scale-[1.03] active:scale-95'
              : 'bg-black/10 border-white/5 text-slate-600 cursor-not-allowed'
          }`}
        >
          <div className="flex justify-between w-full font-bold">
            <span>💾 CACHE UPGRADE</span>
            {!upgrades.cache && <span className="text-cyan-400/90 font-mono">100 Cr</span>}
          </div>
          <p className="text-[10px] leading-relaxed text-slate-400">
            Bumps caching rate from 15% to 75%, diverting queries (purple dots) from DB.
          </p>
          {upgrades.cache && <span className="absolute bottom-2 right-3 font-bold text-[9px] px-1 bg-purple-500 text-black rounded uppercase">ACTIVE</span>}
        </button>

        {/* Server Pod Scaling */}
        <button
          disabled={credits < 150 || upgrades.serverScale || gameState !== 'defending'}
          onClick={() => purchaseUpgrade('serverScale', 150)}
          className={`flex flex-col items-start text-left p-4 rounded-xl border text-xs gap-1.5 transition-all select-none duration-300 relative ${
            upgrades.serverScale 
              ? 'bg-blue-950/20 border-blue-500/40 text-blue-300' 
              : credits >= 150 && gameState === 'defending'
              ? 'bg-slate-900/40 border-cyan-500/30 hover:border-cyan-400 text-slate-200 cursor-pointer hover:scale-[1.03] active:scale-95'
              : 'bg-black/10 border-white/5 text-slate-600 cursor-not-allowed'
          }`}
        >
          <div className="flex justify-between w-full font-bold">
            <span>🚀 AUTO-SCALE PODS</span>
            {!upgrades.serverScale && <span className="text-cyan-400/90 font-mono">150 Cr</span>}
          </div>
          <p className="text-[10px] leading-relaxed text-slate-400">
            Scales server pods to process transactions twice as fast, reducing latency bottleneck.
          </p>
          {upgrades.serverScale && <span className="absolute bottom-2 right-3 font-bold text-[9px] px-1 bg-blue-500 text-black rounded uppercase">ACTIVE</span>}
        </button>

        {/* Database Read Replica */}
        <button
          disabled={credits < 200 || upgrades.dbReplica || gameState !== 'defending'}
          onClick={() => purchaseUpgrade('dbReplica', 200)}
          className={`flex flex-col items-start text-left p-4 rounded-xl border text-xs gap-1.5 transition-all select-none duration-300 relative ${
            upgrades.dbReplica 
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
              : credits >= 200 && gameState === 'defending'
              ? 'bg-slate-900/40 border-cyan-500/30 hover:border-cyan-400 text-slate-200 cursor-pointer hover:scale-[1.03] active:scale-95'
              : 'bg-black/10 border-white/5 text-slate-600 cursor-not-allowed'
          }`}
        >
          <div className="flex justify-between w-full font-bold">
            <span>🗄 READ REPLICAS</span>
            {!upgrades.dbReplica && <span className="text-cyan-400/90 font-mono">200 Cr</span>}
          </div>
          <p className="text-[10px] leading-relaxed text-slate-400">
            Doubles DB parallel query threshold before load starts draining database health.
          </p>
          {upgrades.dbReplica && <span className="absolute bottom-2 right-3 font-bold text-[9px] px-1 bg-emerald-500 text-black rounded uppercase">ACTIVE</span>}
        </button>
      </div>

      {/* SVG Animation Canvas */}
      <div className="w-full overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#060c14] shadow-[inset_0_0_60px_rgba(34,211,238,0.06)] flex items-center justify-center p-4 relative">
        {/* Background Alert Ambient Pulse */}
        {gameState === 'defending' && isDbOverloaded && (
          <div className="absolute inset-0 bg-red-500/3 animate-pulse pointer-events-none z-0" />
        )}

        <svg viewBox={isMobileFlow ? "0 0 320 440" : "0 0 800 300"} className="w-full max-w-4xl h-auto relative z-10" style={{ minHeight: isMobileFlow ? '440px' : '300px' }}>
          {/* Connection Lines */}
          <line x1={positions.client.x} y1={positions.client.y} x2={positions.gateway.x} y2={positions.gateway.y} stroke="rgba(34,211,238,0.2)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1={positions.gateway.x} y1={positions.gateway.y} x2={positions.cache.x} y2={positions.cache.y} stroke="rgba(34,211,238,0.2)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1={positions.gateway.x} y1={positions.gateway.y} x2={positions.server.x} y2={positions.server.y} stroke="rgba(34,211,238,0.2)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1={positions.server.x} y1={positions.server.y} x2={positions.db.x} y2={positions.db.y} stroke="rgba(34,211,238,0.2)" strokeWidth="2" strokeDasharray="5,5" />

          {/* Crossover line from cache back to gateway */}
          <path d={isMobileFlow
            ? `M ${positions.cache.x} ${positions.cache.y} Q ${(positions.cache.x + positions.gateway.x)/2 - 20} ${(positions.cache.y + positions.gateway.y)/2} ${positions.gateway.x} ${positions.gateway.y}`
            : `M ${positions.cache.x} ${positions.cache.y} Q ${(positions.cache.x + positions.gateway.x)/2} ${(positions.cache.y + positions.gateway.y)/2 - 20} ${positions.gateway.x} ${positions.gateway.y}`
          } fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth="1.5" strokeDasharray="3,3" />

          {/* Traffic Particles */}
          {particles.map(p => {
            const pos = getParticlePos(p);
            
            // Color mapping based on status
            let color = '#22d3ee'; // standard (cyan)
            if (p.status === 'spam') color = '#ef4444'; // spam/attack (red)
            else if (p.status === 'blocked') color = '#f97316'; // blocked/diverted (orange)
            else if (p.route.includes('cache')) color = '#a855f7'; // cached query (purple)

            return (
              <circle 
                key={p.id} 
                cx={pos.x} 
                cy={pos.y} 
                r={p.status === 'spam' ? '4.5' : '3.5'} 
                fill={color} 
                style={{ filter: `drop-shadow(0 0 6px ${color})` }}
              />
            );
          })}

          {/* Client Node */}
          <g transform={`translate(${positions.client.x}, ${positions.client.y})`}>
            <circle r="26" fill="#040813" stroke="#22d3ee" strokeWidth="2" />
            <path d="M -10 -7 L 10 -7 L 10 5 L -10 5 Z" fill="none" stroke="#22d3ee" strokeWidth="1.8" />
            <path d="M -4 5 L -6 10 L 6 10 L 4 5" fill="none" stroke="#22d3ee" strokeWidth="1.8" />
            <text x="0" y="-38" textAnchor="middle" fill="#22d3ee" fontSize="9" className="font-bold tracking-widest font-mono select-none" opacity="0.8">CLIENT</text>
          </g>

          {/* Gateway Node with glowing shield if rate limiter active */}
          <g transform={`translate(${positions.gateway.x}, ${positions.gateway.y})`}>
            {upgrades.rateLimiter && (
              <circle r="34" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,4" className="animate-spin" style={{ animationDuration: '8s' }} />
            )}
            <circle r="26" fill="#040813" stroke={upgrades.rateLimiter ? '#f97316' : '#22d3ee'} strokeWidth="2" />
            <path d="M -8 -8 L 8 -8 L 8 -3 C 8 3 0 9 -8 3 L -8 -8 Z" fill="none" stroke={upgrades.rateLimiter ? '#f97316' : '#22d3ee'} strokeWidth="1.8" />
            <text x="0" y="38" textAnchor="middle" fill={upgrades.rateLimiter ? '#f97316' : '#22d3ee'} fontSize="9" className="font-bold tracking-widest font-mono select-none" opacity="0.8">GATEWAY</text>
            {upgrades.rateLimiter && (
              <path d="M-6,-15 L6,-15 L6,-11 C6,-5 0,-1 -6,-11 Z" fill="none" stroke="#f97316" strokeWidth="1" transform="scale(0.6)" />
            )}
          </g>

          {/* Cache Node */}
          <g transform={`translate(${positions.cache.x}, ${positions.cache.y})`}>
            {upgrades.cache && (
              <circle r="32" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.6" className="animate-pulse" />
            )}
            <circle r="26" fill="#040813" stroke={upgrades.cache ? '#a855f7' : '#22d3ee'} strokeWidth="2" />
            <path d="M 2 -9 L -8 0 L -1 0 L -3 9 L 7 0 L 0 0 Z" fill="none" stroke={upgrades.cache ? '#a855f7' : '#22d3ee'} strokeWidth="1.8" />
            <text x="0" y="-38" textAnchor="middle" fill={upgrades.cache ? '#a855f7' : '#22d3ee'} fontSize="9" className="font-bold tracking-widest font-mono select-none" opacity="0.8">CACHE</text>
          </g>

          {/* Server Node (stacked pod visuals if scaled) */}
          <g transform={`translate(${positions.server.x}, ${positions.server.y})`}>
            {upgrades.serverScale && (
              <>
                <circle cx="-8" cy="8" r="23" fill="#030712" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
                <circle cx="8" cy="-8" r="23" fill="#030712" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
              </>
            )}
            <circle r="26" fill="#040813" stroke={upgrades.serverScale ? '#3b82f6' : '#22d3ee'} strokeWidth="2" />
            <g transform="translate(0, -1)">
              <rect x="-10" y="-8" width="20" height="5" rx="1" fill="none" stroke={upgrades.serverScale ? '#3b82f6' : '#22d3ee'} strokeWidth="1.5" />
              <circle cx="-5" cy="-5.5" r="0.8" fill={upgrades.serverScale ? '#3b82f6' : '#22d3ee'} />
              <rect x="-10" y="-2.5" width="20" height="5" rx="1" fill="none" stroke={upgrades.serverScale ? '#3b82f6' : '#22d3ee'} strokeWidth="1.5" />
              <circle cx="-5" cy="0" r="0.8" fill={upgrades.serverScale ? '#3b82f6' : '#22d3ee'} />
              <rect x="-10" y="3" width="20" height="5" rx="1" fill="none" stroke={upgrades.serverScale ? '#3b82f6' : '#22d3ee'} strokeWidth="1.5" />
              <circle cx="-5" cy="5.5" r="0.8" fill={upgrades.serverScale ? '#3b82f6' : '#22d3ee'} />
            </g>
            <text x="0" y="38" textAnchor="middle" fill={upgrades.serverScale ? '#3b82f6' : '#22d3ee'} fontSize="9" className="font-bold tracking-widest font-mono select-none" opacity="0.8">SERVERS</text>
          </g>

          {/* DB Node (cylinder stacked visuals if replica active) */}
          <g transform={`translate(${positions.db.x}, ${positions.db.y})`}>
            {upgrades.dbReplica && (
              <g transform="translate(14, -14)" opacity="0.6">
                <ellipse cx="0" cy="-14" rx="20" ry="6" fill="#0b1329" stroke="#10b981" strokeWidth="1.5" />
                <path d="M -20 -14 L -20 14 A 20 6 0 0 0 20 14 L 20 -14" fill="#0b1329" stroke="#10b981" strokeWidth="1.5" />
                <ellipse cx="0" cy="0" rx="20" ry="6" fill="none" stroke="#10b981" strokeWidth="1.5" />
                <ellipse cx="0" cy="14" rx="20" ry="6" fill="none" stroke="#10b981" strokeWidth="1.5" />
              </g>
            )}
            
            {/* Primary DB Cylinder */}
            <g>
              <ellipse cx="0" cy="-14" rx="22" ry="6" fill="#040813" stroke={isDbOverloaded ? '#ef4444' : '#22d3ee'} strokeWidth="2" />
              <path d="M -22 -14 L -22 14 A 22 6 0 0 0 22 14 L 22 -14" fill="#040813" stroke={isDbOverloaded ? '#ef4444' : '#22d3ee'} strokeWidth="2" />
              <ellipse cx="0" cy="0" rx="22" ry="6" fill="none" stroke={isDbOverloaded ? '#ef4444' : '#22d3ee'} strokeWidth="1.5" />
              <ellipse cx="0" cy="14" rx="22" ry="6" fill="none" stroke={isDbOverloaded ? '#ef4444' : '#22d3ee'} strokeWidth="2" />
            </g>
            <text x="0" y="38" textAnchor="middle" fill={isDbOverloaded ? '#ef4444' : '#22d3ee'} fontSize="9" className="font-bold tracking-widest font-mono select-none" opacity="0.8">DATABASE</text>

            {/* Overload Alert overlay indicator */}
            {isDbOverloaded && gameState === 'defending' && (
              <g transform="translate(0, -32)">
                <rect x="-35" y="-10" width="70" height="14" rx="3" fill="#dc2626" />
                <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="8" className="font-bold tracking-widest animate-pulse">OVERLOAD</text>
              </g>
            )}
          </g>
        </svg>
        
        {/* Connection Counts Overlay */}
        {gameState === 'defending' && (
          <div className="absolute top-4 right-4 bg-slate-950/80 border border-white/5 p-2 px-3 rounded-lg text-[9px] text-slate-400 space-y-0.5">
            <div className="flex justify-between gap-6">
              <span>DB ACTIVE LOAD:</span>
              <span className={`font-bold ${isDbOverloaded ? 'text-red-400' : 'text-cyan-400'}`}>{activeDbRequests} / {dbCapacity} QPS</span>
            </div>
            <div className="flex justify-between gap-6">
              <span>RATE LIMIT SHIELD:</span>
              <span className="font-bold text-orange-400">{upgrades.rateLimiter ? 'ON (70%)' : 'OFF'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
