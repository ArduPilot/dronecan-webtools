// Actuator Command Worker with fixed rate calculation
console.log('Actuator Command Worker initialized - Rate-corrected version');

// High-resolution timing helpers
const originalSetTimeout = setTimeout;
const hrSetTimeout = (callback, delay) => {
  const start = performance.now();
  
  return originalSetTimeout(() => {
    const drift = performance.now() - start - delay;
    callback(drift);
  }, delay);
};

// Busy-wait loop for ultra-precise timing
function preciseSleep(ms) {
  const start = performance.now();
  while (performance.now() - start < ms) {
    // Busy wait for ultra-precise timing (use carefully - consumes CPU)
  }
}

// Command variables
let timerId = null;
let running = false;
let rate = 10; // Default rate in Hz
let commandCounter = 0;
let lastPerformanceReport = 0;
const PERFORMANCE_REPORT_INTERVAL = 5000; // ms

// Performance monitoring
let cycleCount = 0;
let cycleStartTime = 0;

self.onmessage = function(e) {
  const command = e.data.command;
  
  console.log(`Worker received ${command} command`);
  
  switch (command) {
    case 'start':
      const newStartRate = e.data.rate || 10;
      
      // Stop any existing timer
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
      
      // Start new timer with requested rate
      console.log(`Starting actuator commands with rate: ${newStartRate}Hz`);
      rate = newStartRate;
      running = true;
      commandCounter = 0;
      lastPerformanceReport = performance.now();
      cycleCount = 0;
      cycleStartTime = performance.now();
      
      startPreciseLoop();
      break;
    
    case 'stop':
      console.log('Stopping actuator commands');
      running = false;
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
      
      // Report final stats
      const elapsedSec = (performance.now() - cycleStartTime) / 1000;
      if (elapsedSec > 0.5 && cycleCount > 0) {
        const actualRate = cycleCount / elapsedSec;
        console.log(`Final actuator command rate: ${actualRate.toFixed(2)}Hz (target: ${rate}Hz)`);
      }
      break;
  }
};

function startPreciseLoop() {
  // FIX: Calculate the target interval correctly - ensure we're getting exactly the requested rate
  const targetInterval = 1000 / rate; 
  let nextTime = performance.now();
  
  console.log(`Starting actuator command loop with interval: ${targetInterval.toFixed(2)}ms (${rate}Hz)`);
  
  function sendCommand() {
    if (!running) return;
    
    const now = performance.now();
    cycleCount++;
    
    // Request actuator command from main thread
    self.postMessage({
      type: 'requestActuatorCommand',
      timestamp: now
    });
    
    // Performance monitoring
    if (now - lastPerformanceReport > PERFORMANCE_REPORT_INTERVAL) {
      const elapsedSec = (now - cycleStartTime) / 1000;
      const actualRate = cycleCount / elapsedSec;
      console.log(`Actuator command rate: ${actualRate.toFixed(2)}Hz (target: ${rate}Hz)`);
      cycleCount = 0;
      cycleStartTime = now;
      lastPerformanceReport = now;
    }
    
    // Calculate next execution time with drift correction
    nextTime += targetInterval;
    
    // If we're behind schedule, catch up with improved handling
    if (nextTime < now) {
      const driftMS = now - nextTime;
      const driftCycles = driftMS / targetInterval;
      
      if (driftCycles > 1) {
        console.warn(`Actuator timing drift: ${driftMS.toFixed(1)}ms (${driftCycles.toFixed(1)} cycles behind)`);
        // Reset more completely to avoid compounding issues
        nextTime = now;
      }
    }
    
    // Schedule next execution with precise timing
    const totalWaitTime = Math.max(1, nextTime - now);
    
    // FIX: Use a more direct approach for timers instead of the hybrid approach
    // that might be causing doubled commands
    timerId = setTimeout(sendCommand, totalWaitTime);
  }
  
  // Start the loop
  sendCommand();
}