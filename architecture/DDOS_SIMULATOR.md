# DDoS Simulator & Telemetry Engine

This document explains the mathematical modeling, rendering loops, and telemetry subsystems powering the Interactive DDoS Sandbox game.

---

## 🛡️ Simulator Architecture

```
                  ┌─────────────────┐
                  │   Client Node   │
                  └────────┬────────┘
                           │
                  ┌────────▼────────┐
                  │  Gateway Node   ├────────┐
                  └────────┬────────┘        │ (Blocked Spam)
                           │                 ▼
            ┌──────────────┴──────────────┐ [Drop]
            ▼                             ▼
   ┌─────────────────┐           ┌─────────────────┐
   │   Cache Node    │           │   Server Node   │
   └────────┬────────┘           └────────┬────────┘
            │                             │
   ┌────────▼────────┐                    │
   │  Client Node    │           ┌────────▼────────┐
   │ (Success Cache) │           │  Database Node  │
   └─────────────────┘           └────────┬────────┘
                                          │
                                 ┌────────▼────────┐
                                 │   Server Node   │
                                 └────────┬────────┘
                                          │
                                 ┌────────▼────────┐
                                 │  Client Node    │
                                 │ (Success DB)    │
                                 └─────────────────┘
```

---

## ⚙️ Mathematical & Logical Engine

### 1. Particle Simulation Loop
* **Location:** [components/features/SystemSandbox.tsx](file:///c:/GitHub/anirudha-basu-thakur-portfolio/components/features/SystemSandbox.tsx)
* **Frequency:** Standard 60FPS update cycle powered by React `requestAnimationFrame` tracking delta time (`dt`) in milliseconds to maintain speed consistency.
* **Routing Formula:** Spawns particles (requests) at a frequency determined by the current DDoS phase:
  * **Phase 1 (Timer > 30s):** 12 Requests/s, 25% spam.
  * **Phase 2 (Timer > 15s):** 24 Requests/s, 50% spam.
  * **Phase 3 (Timer <= 15s):** 42 Requests/s, 80% spam.
* **Segment Interpolation:**
  * Sibling positions (coordinates) are calculated using a desktop vs. mobile viewport layout dictionary.
  * Sibling transit progress is linear interpolation (`0.0` to `1.0`) over time.

### 2. Infrastructure Upgrades
* **Rate Limiter:** When enabled, filters **70% of red spam particles** at the Gateway node, altering their route straight back to the Client as "blocked" (orange particles).
* **Caching Layer:** Redirects normal requests to the Cache node (purple particles) and immediately bypasses the database connection pool. Caching rate spikes from **15% to 75%** on purchase.
* **Auto-Scale Pods:** Multiplies server-segment particle traversal speed by **2.0x**, clearing the server queue twice as fast.
* **Read Replicas:** Boosts parallel database threshold capacity (`dbCapacity`) from **4 to 10 parallel queries** before load starts draining database health.

### 3. Database Health Formula
Database health drains dynamically on each loop tick when the parallel query load exceeds capacity:
$$\text{Drain Rate} = 0.008 \times (\text{Active DB Queries} - \text{DB Capacity}) \times \text{dt}$$
* Throttling occurs when too many particles are concurrently traveling between the `Server ➔ DB` or `DB ➔ Server` segments.
* When not overloaded, health recovers slowly: $+0.002 \times \text{dt}$.

---

## 📊 Telemetry Sparklines & Logging

### 1. Real-time CSS Sparklines
Every 1 second, a timer interval samples current status metrics and appends them to historical tracking arrays (capped at length 15):
* **QPS Sparkline:** Displays spawned traffic volume $+ \text{random variance}$.
* **Latency Sparkline:** Displays calculated latency:
  $$\text{Latency (ms)} = 15 + (\text{Active DB Queries} \times \text{Multiplier}) + \text{noise}$$
  * Multiplier is **22** when scaled, and **48** under standard setup.
  * Bars turn **red** when latency spikes past 200ms.
* **Cache Sparkline:** Displays current percentage of cached requests.

### 2. Live Syslog Aggregator
* Implements a custom ring buffer capping logs to the latest 7 lines.
* Throttles normal packet logs by sampling (35% chance per second) to display readable aggregate connections (e.g. *"Cache hit: served static files in 2ms"*).
* Logs upgrade events and critical overload alarms immediately on trigger.

### 3. Critical Alarm Siren
* Triggers when database health drops below **35%**.
* Flashes a red strobe ambient glow layer across the simulator panel.
* Activates an blinking `CRITICAL` telemetry header.
