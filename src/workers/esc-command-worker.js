// Enhanced Command Worker - Multi-command support
console.log('Enhanced Command Worker initialized - Multi-command support');

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

// ESC command variables
let escTimerId = null;
let escRunning = false;
let escRate = 10; // Default rate in Hz

// Safety command variables
let safetyTimerId = null;
let safetyRunning = false;

// Arming command variables
let armingTimerId = null;
let armingRunning = false;

self.onmessage = function(e) {
  const type = e.data.type || 'esc'; // Default to ESC commands
  const command = e.data.command;
  
  console.log(`Worker received ${type} ${command} command`);
  
  switch (type) {
    case 'esc':
      handleEscCommand(command, e.data);
      break;
      
    case 'safety':
      handleSafetyCommand(command);
      break;
      
    case 'arming':
      handleArmingCommand(command);
      break;
  }
};

// Handle ESC commands with high precision
function handleEscCommand(command, data) {
  switch (command) {
    case 'start':
      const newStartRate = data.rate || 10;
      
      // Stop any existing timer
      if (escTimerId !== null) {
        clearTimeout(escTimerId);
        escTimerId = null;
      }
      
      // Start new timer with requested rate
      console.log(`Starting ESC commands with rate: ${newStartRate}Hz`);
      escRate = newStartRate;
      escRunning = true;
      
      startEscPreciseLoop();
      break;
    
    case 'stop':
      console.log('Stopping ESC commands');
      escRunning = false;
      if (escTimerId !== null) {
        clearTimeout(escTimerId);
        escTimerId = null;
      }
      break;
  }
}

// Handle safety commands with fixed 2Hz
function handleSafetyCommand(command) {
  switch (command) {
    case 'start':
      if (safetyTimerId !== null) {
        clearInterval(safetyTimerId);
        safetyTimerId = null;
      }
      
      console.log('Starting safety commands at 2Hz');
      safetyRunning = true;
      
      // Use setInterval for fixed-rate safety commands
      safetyTimerId = setInterval(() => {
        if (safetyRunning) {
          self.postMessage({
            type: 'requestSafetyCommand',
            timestamp: performance.now()
          });
        }
      }, 500); // Fixed 2Hz rate
      break;
    
    case 'stop':
      console.log('Stopping safety commands');
      safetyRunning = false;
      if (safetyTimerId !== null) {
        clearInterval(safetyTimerId);
        safetyTimerId = null;
      }
      break;
  }
}

// Handle arming commands with fixed 2Hz
function handleArmingCommand(command) {
  switch (command) {
    case 'start':
      if (armingTimerId !== null) {
        clearInterval(armingTimerId);
        armingTimerId = null;
      }
      
      console.log('Starting arming commands at 2Hz');
      armingRunning = true;
      
      // Use setInterval for fixed-rate arming commands
      armingTimerId = setInterval(() => {
        if (armingRunning) {
          self.postMessage({
            type: 'requestArmingCommand',
            timestamp: performance.now()
          });
        }
      }, 500); // Fixed 2Hz rate
      break;
    
    case 'stop':
      console.log('Stopping arming commands');
      armingRunning = false;
      if (armingTimerId !== null) {
        clearInterval(armingTimerId);
        armingTimerId = null;
      }
      break;
  }
}

// Improve the startEscPreciseLoop function for more stable high-frequency operation

function startEscPreciseLoop() {
  // Special optimization for ultra-high frequencies
  const isUltraHighRate = escRate >= 300; // Special handling for rates >= 300Hz
  const isHighRate = escRate > 200;
  
  // Optimized batch sizing for different rate ranges
  let batchSize = 1;
  if (isUltraHighRate) {
    batchSize = Math.ceil(escRate / 180); // More aggressive batching for ultra-high rates
  } else if (isHighRate) {
    batchSize = Math.ceil(escRate / 200);
  }
  
  const targetInterval = 1000 / escRate;
  const adjustedInterval = isHighRate ? targetInterval * batchSize : targetInterval;
  
//   console.log(`Starting ultra-precise loop with ${isUltraHighRate ? 'ULTRA HIGH' : isHighRate ? 'HIGH' : 'standard'} mode`);
//   console.log(`Target rate: ${escRate}Hz, using batch size: ${batchSize}, adjusted interval: ${adjustedInterval.toFixed(2)}ms`);
  
  // Performance tracking
  let nextTime = performance.now();
  let cycleCount = 0;
  let lastPerformanceReport = performance.now();
  const PERFORMANCE_REPORT_INTERVAL = 5000; // Report performance every 5 seconds
  
  // Pre-allocate the message object to reduce GC pressure
  const messageTemplate = {
    type: 'requestEscCommand',
    timestamp: 0
  };
  
  function sendCommand() {
    if (!escRunning) return;
    
    const now = performance.now();
    cycleCount++;
    
    // Send multiple commands in a batch for high frequencies
    for (let i = 0; i < batchSize; i++) {
      if (!escRunning) break;
      
      // Update timestamp rather than creating new objects each time
      messageTemplate.timestamp = now + (i * (targetInterval / batchSize));
      self.postMessage(messageTemplate);
    }
    
    // Performance monitoring
    if (now - lastPerformanceReport > PERFORMANCE_REPORT_INTERVAL) {
      const actualRate = (cycleCount * batchSize) / ((now - lastPerformanceReport) / 1000);
    //   console.log(`Performance report: Achieved rate ${actualRate.toFixed(2)}Hz (target: ${escRate}Hz)`);
      cycleCount = 0;
      lastPerformanceReport = now;
    }
    
    // Calculate next execution time with improved drift correction
    nextTime += adjustedInterval;
    
    // If we're behind schedule, use a more sophisticated catch-up strategy
    if (nextTime < now) {
      const driftMS = now - nextTime;
      const driftCycles = driftMS / adjustedInterval;
      
      if (driftCycles > 1) {
        // More nuanced drift correction for stability
        if (driftCycles > 10) {
          // We're way behind, reset completely to avoid CPU overload
          console.warn(`Severe timing drift: ${driftMS.toFixed(1)}ms (${driftCycles.toFixed(1)} cycles behind) - resetting`);
          nextTime = now;
        } else {
          // We're moderately behind, gradual catch-up
          console.warn(`Moderate timing drift: ${driftMS.toFixed(1)}ms (${driftCycles.toFixed(1)} cycles behind) - gradual catchup`);
          // The larger the drift, the more aggressive the correction
          const catchupFactor = Math.min(0.8, driftCycles / 20);
          nextTime = now - (adjustedInterval * catchupFactor);
        }
      }
    }
    
    // Optimized scheduling strategy for high-frequency stability
    const totalWaitTime = Math.max(0.5, nextTime - now); // Minimum 0.5ms wait to avoid tight loops
    
    // For ultra-high rates, use more precise timing
    if (isUltraHighRate && totalWaitTime < 4) {
      // For very short waits, just use optimized sleep
      optimizedSleep(totalWaitTime, () => {
        sendCommand();
      });
    } else {
      // For longer waits or standard rates, use the hybrid approach
      const timeoutPortion = Math.max(0, totalWaitTime - (isUltraHighRate ? 1.5 : 2));
      
      escTimerId = originalSetTimeout(() => {
        const remainingTime = nextTime - performance.now();
        if (remainingTime > 0) {
          preciseSleep(remainingTime);
        }
        sendCommand();
      }, timeoutPortion);
    }
  }
  
  // Start the loop
  sendCommand();
}

// Optimized sleep function that avoids excessive CPU usage
// while still providing precise timing
function optimizedSleep(ms, callback) {
  const targetTime = performance.now() + ms;
  
  // For very short sleeps (<1ms), use busy waiting
  if (ms < 1) {
    preciseSleep(ms);
    callback();
    return;
  }
  
  // For moderate sleeps, use a combination approach
  // First sleep most of the time using setTimeout
  const timeoutMs = ms - 1; // Leave 1ms for precise waiting
  
  escTimerId = originalSetTimeout(() => {
    // Then precisely wait the remaining time
    const remaining = Math.max(0, targetTime - performance.now());
    if (remaining > 0) {
      preciseSleep(remaining);
    }
    callback();
  }, timeoutMs);
}