/**
 * PURRISTA — Full-Screen Interactive Kinematic Hero System
 * Pure Vanilla JavaScript (Zero External Dependencies)
 */

(function () {
  'use strict';

  // --- Constants & Specifications ---
  const TOTAL_FRAMES = 96;
  const FRAME_WIDTH = 640;
  const FRAME_HEIGHT = 360;
  const SPRITESHEET_SRC = 'assets/spritesheet.jpg';

  // Keyframes
  const IDLE_FRAME = 48;        // Center forward idle pose
  const PEAK_LEFT_FRAME = 24;   // Looking toward left headline
  const PEAK_RIGHT_FRAME = 72;  // Looking toward right coffee cards

  // State
  let trackingMode = 'natural'; // 'natural' | 'scrub' | 'patrol'
  let dampingFactor = 0.16;     // Responsive, fluid, zero sluggish lag
  let isHovering = false;
  let isDraggingScreen = false;
  let isDraggingBottomScrubber = false;
  let audioEnabled = true;

  let pointerX = 0.5; // Normalized screen position (0 to 1)
  let pointerY = 0.5;

  let currentFrame = IDLE_FRAME;
  let targetFrame = IDLE_FRAME;
  let lastDrawnFrame = -1;

  let activeDrink = 'Cappuccino';
  let activePrice = '$4.50';
  let cartCount = 1;

  // DOM Elements
  const canvas = document.getElementById('purrista-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const catBaseImg = document.getElementById('cat-base');
  const spotlight = document.getElementById('cursor-spotlight');

  // Interactive UI Elements
  const priceDisplay = document.getElementById('active-price');
  const orderBtn = document.getElementById('order-btn');
  const menuBtn = document.getElementById('menu-btn');
  const searchBtn = document.getElementById('search-btn');
  const cartBtn = document.getElementById('cart-btn');
  const cartBadge = document.getElementById('cart-count');

  // Drink Cards
  const cupEspresso = document.getElementById('cup-espresso');
  const cupCappuccino = document.getElementById('cup-cappuccino');
  const allCupCards = [cupEspresso, cupCappuccino].filter(Boolean);

  // Rotating Stamp Button
  const stampTrigger = document.getElementById('stamp-trigger');
  const stampCenterBtn = document.getElementById('stamp-center-btn');

  // Bottom Scrubber Dock
  const bottomDock = document.getElementById('bottom-dock');
  const scrubCapsule = document.getElementById('scrub-capsule');
  const scrubFill = document.getElementById('scrub-fill');
  const scrubHandle = document.getElementById('scrub-handle');
  const frameCounter = document.getElementById('frame-counter');
  const timeCounter = document.getElementById('time-counter');
  const modeBadge = document.getElementById('mode-badge');

  // Toast Notification
  const toast = document.getElementById('order-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastSub = document.getElementById('toast-sub');
  let toastTimeout = null;

  // --- Web Audio Tactile Micro-Feedback ---
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTactileTick() {
    if (!audioEnabled) return;
    try {
      const actx = getAudioContext();
      if (!actx) return;

      const osc = actx.createOscillator();
      const gain = actx.createGain();

      const freq = 420 + (currentFrame / TOTAL_FRAMES) * 220;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, actx.currentTime);

      gain.gain.setValueAtTime(0.02, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(actx.destination);

      osc.start();
      osc.stop(actx.currentTime + 0.035);
    } catch (e) {
      // Audio fallback silent
    }
  }

  // --- Sprite Sheet Loading ---
  const spritesheet = new Image();
  spritesheet.src = SPRITESHEET_SRC;

  spritesheet.onload = () => {
    setupCanvas();
    canvas.classList.add('is-active');
    // Hide fallback static image once canvas is drawing
    catBaseImg.style.opacity = '0';
    requestAnimationFrame(renderLoop);
  };

  spritesheet.onerror = () => {
    console.error('Spritesheet could not be loaded; base image retained.');
  };

  // --- Canvas Setup with High-DPI Clarity & Full Cover Scaling ---
  function setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    drawFrame(currentFrame);
  }

  window.addEventListener('resize', setupCanvas);

  // --- Draw Specified Frame Index to Canvas Covering Full Screen ---
  function drawFrame(idx) {
    const frameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(idx)));
    const sx = frameIndex * FRAME_WIDTH;
    const sy = 0;

    const canvasW = canvas.width;
    const canvasH = canvas.height;

    // Calculate aspect-ratio cover dimensions to fill 100% of viewport
    const scale = Math.max(canvasW / FRAME_WIDTH, canvasH / FRAME_HEIGHT);
    const drawW = FRAME_WIDTH * scale;
    const drawH = FRAME_HEIGHT * scale;
    const drawX = (canvasW - drawW) / 2;
    const drawY = (canvasH - drawH) / 2;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(
      spritesheet,
      sx, sy, FRAME_WIDTH, FRAME_HEIGHT,
      drawX, drawY, drawW, drawH
    );

    if (frameIndex !== lastDrawnFrame) {
      if (Math.abs(frameIndex - lastDrawnFrame) >= 1) {
        playTactileTick();
      }
      lastDrawnFrame = frameIndex;
    }
  }

  // --- Calculate Target Frame According to Mode & Cursor ---
  function calculateTargetFrame() {
    if (trackingMode === 'patrol') {
      // Autonomous gentle ambient sweep
      const elapsed = performance.now() * 0.001;
      const wave = (Math.sin(elapsed) + 1) * 0.5; // 0 to 1
      return wave * (TOTAL_FRAMES - 1);
    }

    if (!isHovering && !isDraggingBottomScrubber && !isDraggingScreen) {
      // Graceful return to idle center pose
      return IDLE_FRAME;
    }

    if (trackingMode === 'scrub') {
      // Full screen linear scrubbing (0 to 1 across all 96 frames)
      return pointerX * (TOTAL_FRAMES - 1);
    }

    // Default 'natural' mode:
    // Left edge (pointerX = 0) -> Frame 24 (looking left at headline)
    // Center (pointerX = 0.5) -> Frame 48 (looking forward at viewer)
    // Right edge (pointerX = 1) -> Frame 72 (looking right at 3D cups)
    // 100% continuous, monotonic sweep with zero jumps or reverse flips
    return PEAK_LEFT_FRAME + pointerX * (PEAK_RIGHT_FRAME - PEAK_LEFT_FRAME);
  }

  // --- Main Animation & Interpolation Loop ---
  function renderLoop() {
    targetFrame = calculateTargetFrame();

    // Physics interpolation (Smooth lerp with dampening)
    const delta = targetFrame - currentFrame;
    if (Math.abs(delta) > 0.001) {
      currentFrame += delta * dampingFactor;
    } else {
      currentFrame = targetFrame;
    }

    drawFrame(currentFrame);
    updateBottomScrubber();

    requestAnimationFrame(renderLoop);
  }

  // --- Update Scrubber Capsule UI ---
  function updateBottomScrubber() {
    const dispFrame = Math.round(currentFrame);
    const progress = (dispFrame / (TOTAL_FRAMES - 1)) * 100;
    const timeSec = (dispFrame / 24).toFixed(2);

    scrubFill.style.width = `${progress}%`;
    scrubHandle.style.left = `${progress}%`;

    frameCounter.textContent = `Frame: ${dispFrame} / ${TOTAL_FRAMES - 1}`;
    timeCounter.textContent = `${timeSec}s`;

    if (trackingMode === 'natural') {
      modeBadge.textContent = 'Tracking: Natural Look';
    } else if (trackingMode === 'scrub') {
      modeBadge.textContent = 'Tracking: Full Timeline Scrub';
    } else if (trackingMode === 'patrol') {
      modeBadge.textContent = 'Tracking: Ambient Auto-Patrol';
    }
  }

  // --- Full-Screen Pointer Tracking & Drag Scrubbing ---
  function updatePointer(e) {
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth * 0.5);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight * 0.5);

    // Position cursor spotlight
    spotlight.style.left = `${clientX}px`;
    spotlight.style.top = `${clientY}px`;
    spotlight.style.opacity = '1';

    // Normalize coordinates across entire viewport (0 to 1)
    pointerX = Math.max(0, Math.min(1, clientX / window.innerWidth));
    pointerY = Math.max(0, Math.min(1, clientY / window.innerHeight));
    isHovering = true;
  }

  window.addEventListener('pointerdown', (e) => {
    // Enable direct drag scrubbing unless interacting with buttons/inputs
    if (e.target.closest('button, a, input, .cup-card-item')) return;
    isDraggingScreen = true;
    updatePointer(e);
  });

  window.addEventListener('pointermove', (e) => {
    updatePointer(e);
  });

  window.addEventListener('pointerup', () => {
    isDraggingScreen = false;
  });

  window.addEventListener('pointercancel', () => {
    isDraggingScreen = false;
  });

  document.addEventListener('mouseleave', () => {
    if (isDraggingBottomScrubber || isDraggingScreen) return;
    isHovering = false;
    pointerX = 0.5;
    pointerY = 0.5;
    spotlight.style.opacity = '0';
  });

  // --- Bottom Scrubber Interaction ---
  function handleScrubDrag(e) {
    const rect = scrubCapsule.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const norm = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    
    trackingMode = 'scrub';
    pointerX = norm;
    targetFrame = norm * (TOTAL_FRAMES - 1);
  }

  scrubCapsule.addEventListener('mousedown', (e) => {
    isDraggingBottomScrubber = true;
    handleScrubDrag(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDraggingBottomScrubber) handleScrubDrag(e);
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingBottomScrubber) {
      isDraggingBottomScrubber = false;
    }
  });

  scrubCapsule.addEventListener('touchstart', (e) => {
    isDraggingBottomScrubber = true;
    handleScrubDrag(e);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDraggingBottomScrubber) handleScrubDrag(e);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDraggingBottomScrubber = false;
  });

  // --- Interactive Coffee Product Selection ---
  function selectDrink(item) {
    allCupCards.forEach(c => c && c.classList.remove('active'));
    item.classList.add('active');

    activeDrink = item.dataset.name;
    activePrice = item.dataset.price;
    priceDisplay.textContent = activePrice;

    // Show instant toast feedback
    showToast(`Selected ${activeDrink}`, `${activePrice} • Tasting notes: ${item.querySelector('.cup-style')?.textContent || 'Crafted Fresh'}`);
  }

  allCupCards.forEach(card => {
    if (!card) return;
    card.addEventListener('click', () => selectDrink(card));
  });

  // --- Interactive Buttons ---
  orderBtn.addEventListener('click', () => {
    cartCount++;
    cartBadge.textContent = cartCount;
    cartBadge.style.transform = 'scale(1.35)';
    setTimeout(() => { cartBadge.style.transform = 'scale(1)'; }, 250);

    showToast(`Order Placed! (${activeDrink})`, `Fluffball quality-control officer taste-tested your order twice.`);
  });

  menuBtn.addEventListener('click', () => {
    // Switch to auto-patrol preview sweep
    trackingMode = trackingMode === 'patrol' ? 'natural' : 'patrol';
    showToast(
      trackingMode === 'patrol' ? 'Previewing 4-Second Animation' : 'Natural Cursor Tracking Active',
      'The fluffball will smoothly sweep across all 96 frames.'
    );
  });

  stampTrigger.addEventListener('click', () => {
    // Cycle modes
    if (trackingMode === 'natural') {
      trackingMode = 'scrub';
      showToast('Switched to Full Timeline Scrub', 'Moving cursor across screen scrubs linearly 0% to 100%.');
    } else if (trackingMode === 'scrub') {
      trackingMode = 'patrol';
      showToast('Switched to Ambient Auto-Patrol', 'Autonomous motion sweep active.');
    } else {
      trackingMode = 'natural';
      showToast('Switched to Natural Eye Tracking', 'Cat tracks cursor location naturally.');
    }
  });

  searchBtn.addEventListener('click', () => {
    showToast('Search Menu', 'Brewing: Oat Milk Latte, Cold Foam Cappuccino, Espresso Tonic.');
  });

  cartBtn.addEventListener('click', () => {
    showToast(`Cart (${cartCount} items)`, `Current active drink: ${activeDrink} (${activePrice}). Ready to checkout.`);
  });

  // --- Toast System ---
  function showToast(title, subtitle) {
    toastTitle.textContent = title;
    toastSub.textContent = subtitle;
    toast.classList.add('active');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

})();
