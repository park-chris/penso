import { useEffect, useState } from 'react';

function detectInitialOS() {
  if (typeof navigator === 'undefined') {
    return { os: 'windows', arch: 'x64' };
  }

  const ua = navigator.userAgent || '';
  const platform =
    navigator.userAgentData?.platform || navigator.platform || '';

  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isMac = !isIOS && (/mac/i.test(platform) || /macintosh|mac os x/i.test(ua));
  const isWindows = /win/i.test(platform) || /windows/i.test(ua);

  if (isMac) {
    // Modern macOS browsers often report MacIntel even on Apple Silicon;
    // default to arm64 (M1~M4) and refine via userAgentData when available.
    return { os: 'macos', arch: 'arm64' };
  }

  if (isWindows) {
    return { os: 'windows', arch: 'x64' };
  }

  return { os: 'other', arch: 'x64' };
}

export function useUserOS() {
  const [info, setInfo] = useState(detectInitialOS);

  useEffect(() => {
    let active = true;

    async function refineArchitecture() {
      if (info.os !== 'macos') return;
      if (typeof navigator === 'undefined' || !navigator.userAgentData?.getHighEntropyValues) {
        return;
      }

      try {
        const values = await navigator.userAgentData.getHighEntropyValues(['architecture']);
        if (!active || !values?.architecture) return;
        const archLower = String(values.architecture).toLowerCase();
        if (archLower === 'x86' || archLower === 'x86_64' || archLower === 'x64') {
          setInfo((prev) => (prev.os === 'macos' ? { ...prev, arch: 'x64' } : prev));
        } else if (archLower === 'arm' || archLower === 'arm64') {
          setInfo((prev) => (prev.os === 'macos' ? { ...prev, arch: 'arm64' } : prev));
        }
      } catch {
        // Ignore high-entropy API errors and keep default
      }
    }

    refineArchitecture();
    return () => {
      active = false;
    };
  }, [info.os]);

  return info;
}
