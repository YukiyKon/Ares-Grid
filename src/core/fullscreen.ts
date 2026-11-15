export const PSEUDO_FULLSCREEN_EVENT = 'aresgrid:fullscreenchange';
const PSEUDO_CLASS = 'pseudo-fullscreen';

export function supportsNativeFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  const root = document.documentElement;
  return Boolean(
    document.fullscreenEnabled && typeof root?.requestFullscreen === 'function'
  );
}

export function isFullscreenActive(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
      document.documentElement.classList.contains(PSEUDO_CLASS)
  );
}

function setPseudoFullscreen(active: boolean): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle(PSEUDO_CLASS, active);
  window.dispatchEvent(new Event(PSEUDO_FULLSCREEN_EVENT));
}

export async function enterSafeFullscreen(): Promise<void> {
  if (typeof document === 'undefined') return;

  if (supportsNativeFullscreen()) {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      return;
    } catch {
      // Fallback cleanly to CSS pseudo-fullscreen when browser blocks native API (e.g. iOS Safari)
    }
  }
  setPseudoFullscreen(true);
}

export async function toggleSafeFullscreen(): Promise<void> {
  if (typeof document === 'undefined') return;

  if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
    try {
      await document.exitFullscreen();
      return;
    } catch {
      // Ignore native exit errors
    }
  }

  if (document.documentElement.classList.contains(PSEUDO_CLASS)) {
    setPseudoFullscreen(false);
    return;
  }

  await enterSafeFullscreen();
}
