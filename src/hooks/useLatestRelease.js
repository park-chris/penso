import { useCallback, useEffect, useState } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

const IGNORED_EXTENSIONS = ['.blockmap', '.yml', '.yaml', '.json', '.txt', '.sha256', '.sig'];

function formatBytes(bytes) {
  if (!bytes || typeof bytes !== 'number') return '';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
}

function formatKoreanDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function toAssetInfo(asset) {
  if (!asset || !asset.browser_download_url) return null;
  return {
    name: asset.name,
    downloadUrl: asset.browser_download_url,
    size: formatBytes(asset.size),
  };
}

function isIgnoredAsset(asset) {
  const name = (asset?.name || '').toLowerCase();
  if (!name || !asset?.browser_download_url) return true;
  if (name.includes('source code')) return true;
  return IGNORED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function selectReleaseAssets(assets = []) {
  const validAssets = assets.filter((a) => !isIgnoredAsset(a));

  // Windows (.exe)
  const exeAssets = validAssets.filter((a) =>
    (a.name || '').toLowerCase().endsWith('.exe')
  );

  const installerAsset =
    exeAssets.find((a) => {
      const n = (a.name || '').toLowerCase();
      return (
        !n.includes('portable') &&
        (n.includes('setup') || n.includes('nsis') || n.includes('installer'))
      );
    }) ||
    exeAssets.find((a) => !(a.name || '').toLowerCase().includes('portable')) ||
    exeAssets[0] ||
    null;

  // 포터블 버전: 'portable' 포함 .exe 우선, 없으면 설치 파일(Setup) 외의 다른 .exe (예: Penso-1.0.13.exe)
  const portableAsset =
    exeAssets.find((a) => (a.name || '').toLowerCase().includes('portable')) ||
    exeAssets.find((a) => a !== installerAsset) ||
    null;

  // macOS (.dmg)
  const dmgAssets = validAssets.filter((a) =>
    (a.name || '').toLowerCase().endsWith('.dmg')
  );

  const isArm64Name = (name) =>
    name.includes('arm64') ||
    name.includes('aarch64') ||
    name.includes('apple-silicon') ||
    name.includes('apple_silicon');

  const isX64Name = (name) =>
    name.includes('x64') ||
    name.includes('x86_64') ||
    name.includes('intel') ||
    name.includes('amd64');

  const macArm64Asset =
    dmgAssets.find((a) => isArm64Name((a.name || '').toLowerCase())) ||
    dmgAssets.find((a) => (a.name || '').toLowerCase().includes('universal')) ||
    null;

  const macX64Asset =
    dmgAssets.find((a) => isX64Name((a.name || '').toLowerCase())) ||
    dmgAssets.find((a) => {
      const n = (a.name || '').toLowerCase();
      return (
        a !== macArm64Asset &&
        !isArm64Name(n) &&
        !n.includes('universal')
      );
    }) ||
    null;

  // Android (.apk)
  const apkAsset =
    validAssets.find((a) => (a.name || '').toLowerCase().endsWith('.apk')) ||
    null;

  return {
    installerAsset: toAssetInfo(installerAsset),
    portableAsset: toAssetInfo(portableAsset),
    macArm64Asset: toAssetInfo(macArm64Asset),
    macX64Asset: toAssetInfo(macX64Asset),
    apkAsset: toAssetInfo(apkAsset),
  };
}

function getPrimaryDownloadInfo(release, userOS) {
  const isMac = userOS?.os === 'macos';
  const isMacIntel = isMac && userOS?.arch === 'x64';

  if (isMac) {
    const preferredMac = isMacIntel
      ? release?.macX64Asset || release?.macArm64Asset
      : release?.macArm64Asset || release?.macX64Asset;

    const archLabel =
      preferredMac && preferredMac === release?.macX64Asset
        ? 'Intel'
        : 'Apple Silicon';

    return {
      os: 'macos',
      label: `macOS용 무료 다운로드`,
      subLabel: archLabel,
      asset: preferredMac || null,
    };
  }

  return {
    os: 'windows',
    label: 'Windows용 무료 다운로드',
    subLabel: '64-bit',
    asset: release?.installerAsset || null,
  };
}

export { getPrimaryDownloadInfo };

const RELEASE_CACHE_KEY = 'penso-latest-release-cache-v1';
const RELEASE_CACHE_TTL_MS = 5 * 60 * 1000;

function readCachedRelease() {
  try {
    const raw = sessionStorage.getItem(RELEASE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.release || Date.now() - parsed.ts > RELEASE_CACHE_TTL_MS) {
      return null;
    }
    return parsed.release;
  } catch {
    return null;
  }
}

export function useLatestRelease() {
  const [state, setState] = useState(() => {
    const cached = readCachedRelease();
    if (cached) {
      return { loading: false, error: false, release: cached };
    }
    return { loading: true, error: false, release: null };
  });
  const [reloadTick, setReloadTick] = useState(0);

  const retry = useCallback(() => {
    try {
      sessionStorage.removeItem(RELEASE_CACHE_KEY);
    } catch {
      // ignore
    }
    setState({ loading: true, error: false, release: null });
    setReloadTick((t) => t + 1);
  }, []);

  useEffect(() => {
    if (reloadTick === 0 && readCachedRelease()) {
      return undefined;
    }

    const controller = new AbortController();

    async function fetchRelease() {
      try {
        const headers = { Accept: 'application/vnd.github+json' };
        let res = await fetch(SITE_CONFIG.github.apiLatestReleaseUrl, {
          headers,
          signal: controller.signal,
        });

        let data = null;

        if (res.ok) {
          data = await res.json();
        } else if (res.status === 404) {
          // Fallback to releases list (e.g. when only pre-releases are published)
          const listRes = await fetch(SITE_CONFIG.github.apiReleasesListUrl, {
            headers,
            signal: controller.signal,
          });
          if (!listRes.ok) {
            throw new Error(`GitHub API responded with ${listRes.status}`);
          }
          const list = await listRes.json();
          data = Array.isArray(list)
            ? list.find((r) => !r.draft && Array.isArray(r.assets) && r.assets.length > 0) ||
              list.find((r) => !r.draft) ||
              null
            : null;
        } else {
          throw new Error(`GitHub API responded with ${res.status}`);
        }

        if (!data) {
          throw new Error('No published GitHub release found');
        }

        const {
          installerAsset,
          portableAsset,
          macArm64Asset,
          macX64Asset,
          apkAsset,
        } = selectReleaseAssets(data.assets || []);

        const releaseObj = {
          version: data.tag_name || data.name || '최신 버전',
          name: data.name || data.tag_name || '최신 릴리즈',
          publishedAt: formatKoreanDate(data.published_at),
          body: data.body || '',
          htmlUrl: data.html_url || SITE_CONFIG.github.releasesPageUrl,
          installerAsset,
          portableAsset,
          macArm64Asset,
          macX64Asset,
          apkAsset,
        };

        try {
          sessionStorage.setItem(
            RELEASE_CACHE_KEY,
            JSON.stringify({ ts: Date.now(), release: releaseObj })
          );
        } catch {
          // ignore storage errors
        }

        setState({
          loading: false,
          error: false,
          release: releaseObj,
        });
      } catch (err) {
        if (err.name === 'AbortError') return;
        setState({
          loading: false,
          error: true,
          release: null,
        });
      }
    }

    fetchRelease();
    return () => controller.abort();
  }, [reloadTick]);

  return { ...state, retry };
}
