/**
 * Play notification sound
 * Uses a simple beep sound generated via Web Audio API if audio file doesn't exist
 */
let sharedAudioContext: AudioContext | null = null;
let audioUnlocked = false;

export const initNotificationAudio = async () => {
  try {
    if (!sharedAudioContext) {
      // @ts-expect-error - webkitAudioContext fallback for older browsers
      sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (sharedAudioContext.state === 'suspended') {
      await sharedAudioContext.resume();
    }
    audioUnlocked = sharedAudioContext.state === 'running';
    return audioUnlocked;
  } catch {
    console.warn('Could not initialize audio context');
    audioUnlocked = false;
    return false;
  }
};

export const playNotificationSound = () => {
  // Try to play custom notification sound from public folder first
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // If custom sound fails (or is blocked), fallback to Web Audio API beep
      playBeep();
    });
    return;
  } catch (error) {
    // Continue to Web Audio fallback
  }

  // Web Audio API fallback
  playBeep();
};

/**
 * Generate a simple beep sound using Web Audio API
 */
const playBeep = () => {
  try {
    // @ts-expect-error - webkitAudioContext fallback for older browsers
    const ctx = sharedAudioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') {
      // Try to resume, may still fail if no user gesture
      ctx.resume().catch(() => {});
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch {
    console.log('Notification sound not supported');
  }
};
