let sfxEnabled = true;
let bgmEnabled = false;
let bgmAudio: HTMLAudioElement | null = null;

// Initialize BGM with a nature loop
export const initAudio = () => {
  if (!bgmAudio) {
    // Using a reliable nature sound source
    bgmAudio = new Audio('https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg');
    bgmAudio.loop = true;
    bgmAudio.volume = 0.3;
  }
};

export const setAudioConfig = (sfx: boolean, bgm: boolean) => {
  sfxEnabled = sfx;
  
  if (bgm !== bgmEnabled) {
    bgmEnabled = bgm;
    if (bgmAudio) {
      if (bgmEnabled) {
        bgmAudio.play().catch(e => console.warn("Audio play failed (interaction required):", e));
      } else {
        bgmAudio.pause();
      }
    }
  }
};

export const playSynthSound = (type: string) => {
  if (!sfxEnabled) return;

  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  const actx = new AudioContext();
  
  if (actx.state === 'suspended') actx.resume();

  const o = actx.createOscillator();
  const g = actx.createGain();
  o.connect(g);
  g.connect(actx.destination);
  
  const now = actx.currentTime;

  if (type === 'success' || type === 'victory') {
    o.type = 'triangle';
    o.frequency.setValueAtTime(523, now);
    o.frequency.setValueAtTime(659, now + 0.1);
    g.gain.value = 0.1;
    o.start();
    o.stop(now + 0.5);
  } else if (type === 'sad') {
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(400, now);
    o.frequency.linearRampToValueAtTime(100, now + 0.5);
    g.gain.value = 0.1;
    o.start();
    o.stop(now + 0.5);
  } else if (type === 'dice') {
    o.type = 'square';
    o.frequency.setValueAtTime(150, now);
    o.frequency.linearRampToValueAtTime(600, now + 1.5);
    g.gain.setValueAtTime(0.1, now);
    g.gain.linearRampToValueAtTime(0, now + 1.5);
    o.start();
    o.stop(now + 1.5);
  } else {
    // Nature / Neutral / Suspense fallback
    o.type = 'sine';
    o.frequency.setValueAtTime(440, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    o.start();
    o.stop(now + 0.5);
  }
};