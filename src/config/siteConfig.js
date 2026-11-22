/**
 * Penso(펜소) 공식 랜딩 페이지 설정 파일
 * GitHub 릴리즈 저장소, 웹 앱 URL, Android APK 링크, 문의처 등을 한곳에서 관리합니다.
 */
export const SITE_CONFIG = {
  appName: 'Penso',
  appNameKo: '펜소',
  tagline: '소설의 첫 문장부터 완결까지, 오직 이야기에만 집중하는 집필 공간',

  // GitHub 공개 릴리즈 및 사용법 문서 저장소 설정
  github: {
    owner: 'penso-friends',
    repo: 'penso-release',
    docsRepo: 'penso-page',
    docsBranch: 'main',
    docsPath: 'docs',
    get apiLatestReleaseUrl() {
      return `https://api.github.com/repos/${this.owner}/${this.repo}/releases/latest`;
    },
    get apiReleasesListUrl() {
      return `https://api.github.com/repos/${this.owner}/${this.repo}/releases?per_page=10`;
    },
    get docsRawBaseUrl() {
      return `https://raw.githubusercontent.com/${this.owner}/${this.docsRepo}/${this.docsBranch}/${this.docsPath}`;
    },
    get docsManifestUrl() {
      return `${this.docsRawBaseUrl}/index.json`;
    },
    get releasesPageUrl() {
      return `https://github.com/${this.owner}/${this.repo}/releases`;
    },
    get repoUrl() {
      return `https://github.com/${this.owner}/${this.repo}`;
    },
    get issuesUrl() {
      return `https://github.com/${this.owner}/${this.repo}/issues`;
    },
  },

  // 플랫폼별 링크 (비워두면 자동으로 '준비 중' 상태로 표시됩니다)
  WEB_APP_URL: '', // 예: 'https://app.penso.kr'
  ANDROID_APK_URL: '', // 예: 'https://github.com/penso-friends/penso-release/releases/latest/download/penso-android.apk'

  // 문의 & 피드백 & 후원 링크
  CONTACT_EMAIL: 'contact@penso.app',
  FEEDBACK_URL: 'https://github.com/penso-friends/penso-release/issues',
  BUY_ME_A_COFFEE_URL: 'https://buymeacoffee.com/pensostudio',
};

export const { WEB_APP_URL, ANDROID_APK_URL } = SITE_CONFIG;
