'use client';

import { useState, useEffect, useRef } from 'react';

type Node = 'client' | 'gateway' | 'cache' | 'server' | 'db';

interface Particle {
  id: number;
  route: Node[];
  progress: number; // 0 to 1 along current segment
  segmentIndex: number;
  speed: number;
  status: 'normal' | 'error' | 'success';
}

const nodePositions: Record<Node, { x: number; y: number }> = {
  client: { x: 50, y: 150 },
  gateway: { x: 250, y: 150 },
  cache: { x: 450, y: 50 },
  server: { x: 450, y: 250 },
  db: { x: 700, y: 250 },
};

export default function SystemSandbox() {
  const [traffic, setTraffic] = useState(5); // Requests per second
  const [cacheHitRate, setCacheHitRate] = useState(60); // Percentage
  const [dbLatency, setDbLatency] = useState(20); // Relative latency ms multiplier

  const [particles, setParticles] = useState<Particle[]>([]);
  const requestAnimationFrameRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(performance.now());
  const particleIdCounter = useRef<number>(0);

  // SVG dimensions
  const width = 800;
  const height = 300;

  useEffect(() => {
    let prevTime = performance.now();

    const animate = (time: number) => {
      const dt = time - prevTime;
      prevTime = time;

      // Spawn new particles based on traffic
      const spawnInterval = 1000 / Math.max(1, traffic); // Avoid div by 0
      if (time - lastSpawnTimeRef.current > spawnInterval) {
        lastSpawnTimeRef.current = time;
        
        // Determine route based on cache hit rate
        const isCacheHit = Math.random() * 100 < cacheHitRate;
        const route: Node[] = isCacheHit 
          ? ['client', 'gateway', 'cache', 'gateway', 'client']
          : ['client', 'gateway', 'server', 'db', 'server', 'gateway', 'client'];

        const newParticle: Particle = {
          id: particleIdCounter.current++,
          route,
          progress: 0,
          segmentIndex: 0,
          speed: 0.001, // base speed
          status: 'normal',
        };

        setParticles(prev => [...prev, newParticle]);
      }

      // Update existing particles
      setParticles(prevParticles => {
        const nextParticles = prevParticles.map(p => {
          let speedMultiplier = 1;
          const currentTarget = p.route[p.segmentIndex + 1];
          const currentSource = p.route[p.segmentIndex];

          // Simulate DB latency bottle-neck
          if (currentTarget === 'db' || currentSource === 'db') {
            speedMultiplier = Math.max(0.05, 1 - (dbLatency / 100));
          }

          let nextProgress = p.progress + (p.speed * speedMultiplier * dt);
          let nextSegment = p.segmentIndex;
          let nextStatus = p.status;

          // Segment complete
          if (nextProgress >= 1.0) {
            nextProgress = 0;
            nextSegment++;
            
            // Reached destination logic (color change etc)
            if (nextSegment === p.route.length - 1) {
              nextStatus = 'success';
            }
          }

          return {
            ...p,
            progress: nextProgress,
            segmentIndex: nextSegment,
            status: nextStatus
          };
        });

        // Remove particles that have completed their entire route
        return nextParticles.filter(p => p.segmentIndex < p.route.length - 1);
      });

      requestAnimationFrameRef.current = requestAnimationFrame(animate);
    };

    requestAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);
    };
  }, [traffic, cacheHitRate, dbLatency]);

  // Helper to calculate position between two nodes
  const getParticlePos = (p: Particle) => {
    const from = nodePositions[p.route[p.segmentIndex]];
    const to = nodePositions[p.route[p.segmentIndex + 1]];
    if (!from || !to) return { x: 0, y: 0 };
    
    return {
      x: from.x + (to.x - from.x) * p.progress,
      y: from.y + (to.y - from.y) * p.progress
    };
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/40 border border-cyan-500/20 p-6 rounded-2xl">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono text-cyan-400">
            <span>Traffic Volume</span>
            <span>{traffic} req/s</span>
          </div>
          <input 
            type="range" min="1" max="20" value={traffic} 
            onChange={(e) => setTraffic(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono text-cyan-400">
            <span>Cache Hit Rate</span>
            <span>{cacheHitRate}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={cacheHitRate} 
            onChange={(e) => setCacheHitRate(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono text-cyan-400">
            <span>DB Latency</span>
            <span>{dbLatency} ms</span>
          </div>
          <input 
            type="range" min="0" max="100" value={dbLatency} 
            onChange={(e) => setDbLatency(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#060c14] shadow-[inset_0_0_50px_rgba(34,211,238,0.05)] flex items-center justify-center p-4">
        <svg viewBox="0 0 800 300" className="w-full max-w-4xl h-auto" style={{ minHeight: '300px' }}>
          {/* Connections */}
          <line x1={nodePositions.client.x} y1={nodePositions.client.y} x2={nodePositions.gateway.x} y2={nodePositions.gateway.y} stroke="rgba(34,211,238,0.2)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1={nodePositions.gateway.x} y1={nodePositions.gateway.y} x2={nodePositions.cache.x} y2={nodePositions.cache.y} stroke="rgba(34,211,238,0.2)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1={nodePositions.gateway.x} y1={nodePositions.gateway.y} x2={nodePositions.server.x} y2={nodePositions.server.y} stroke="rgba(34,211,238,0.2)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1={nodePositions.server.x} y1={nodePositions.server.y} x2={nodePositions.db.x} y2={nodePositions.db.y} stroke="rgba(34,211,238,0.2)" strokeWidth="2" strokeDasharray="5,5" />

          {/* Particles */}
          {particles.map(p => {
            const pos = getParticlePos(p);
            const isCacheHit = p.route.includes('cache');
            return (
              <circle 
                key={p.id} 
                cx={pos.x} 
                cy={pos.y} 
                r="4" 
                fill={isCacheHit ? '#a855f7' : '#22d3ee'} 
                className="animate-pulse"
                style={{ filter: `drop-shadow(0 0 6px ${isCacheHit ? '#a855f7' : '#22d3ee'})` }}
              />
            );
          })}

          {/* Nodes */}
          {Object.entries(nodePositions).map(([name, pos]) => (
            <g key={name} transform={`translate(${pos.x}, ${pos.y})`}>
              <circle r="30" fill="#0b1426" stroke="#22d3ee" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily="monospace" className="uppercase tracking-wider">
                {name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
