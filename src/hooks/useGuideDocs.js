import { useEffect, useRef, useState } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

const FALLBACK_DOC_GROUPS = [
  {
    id: 'start',
    label: '시작하기',
    docs: [
      {
        id: 'install',
        title: '설치 및 최초 실행',
        lead: 'Windows와 macOS에서 Penso를 설치하고 처음 여는 방법을 안내합니다.',
        markdown: `## 설치 파일 내려받기

홈 화면의 다운로드 섹션에서 사용 중인 OS에 맞는 설치 파일(\`.exe\` 또는 \`.dmg\`)을 내려받아 실행합니다. macOS는 **Apple Silicon(M1~M4)**과 **Intel** 버전을 구분해 선택해 주세요.

## 최초 실행 시 보안 경고가 뜰 때

- **Windows**: "Windows의 PC 보호" 창에서 **추가 정보 → 실행**을 순서대로 클릭합니다.
- **macOS**: 미서명 앱 경고가 뜨면 **시스템 설정 → 개인정보 보호 및 보안** 하단에서 **그대로 열기**를 클릭합니다.`,
      },
      {
        id: 'overview',
        title: '화면 구성 둘러보기',
        lead: '왼쪽 탐색기, 중앙 원고 에디터, 오른쪽 커스텀 위젯 3단 구조를 살펴봅니다.',
        markdown: `## 3단 집필 레이아웃

왼쪽에는 작품·폴더·설정집 탐색기가, 중앙에는 원고 에디터가, 오른쪽에는 집필 통계·특수문자 패드 등 커스텀 위젯이 배치됩니다.

## 서체 및 다크 모드

명조체·고딕체를 버튼 하나로 전환할 수 있으며, 장시간 집필에 눈부심이 적은 다크 테마를 기본 지원합니다.`,
      },
    ],
  },
  {
    id: 'writing',
    label: '집필 & 관리',
    docs: [
      {
        id: 'folders',
        title: '작품과 세부 폴더',
        lead: '부·편·회차와 설정 문서를 원하는 계층 폴더로 깔끔하게 정리할 수 있습니다.',
        markdown: `## 세부 폴더로 나누기

1부·2부 같은 상위 폴더 아래에 회차 원고와 보조 메모를 자유롭게 나누어 배치하세요. 드래그 앤 드롭으로 회차 순서를 바꿀 수 있습니다.

## 다작 · 외전 관리

여러 작품을 동시에 연재하거나 단편·외전을 따로 관리할 때 상단 작품 스위처에서 즉시 전환할 수 있습니다.`,
      },
      {
        id: 'widgets',
        title: '에디터 & 커스텀 위젯',
        lead: '내 집필 흐름에 꼭 필요한 도구만 화면에 골라 배치하세요.',
        markdown: `## 제공 위젯

- **집필 통계**: 오늘 작성한 글자 수와 목표 달성률을 실시간으로 확인합니다.
- **특수문자 패드**: 「」 『』 …… — 등 웹소설 문장부호를 클릭 한 번으로 입력합니다.
- **복선 트래커**: 미회수·회수 복선을 체크리스트처럼 관리합니다.
- **빠른 메모 & 뽀모도로 타이머**: 떠오른 대사를 바로 적고 작업 루틴을 유지합니다.`,
      },
      {
        id: 'wiki-mindmap',
        title: '설정집 위키 & 멀티 마인드맵',
        lead: '인물·세계관 설정을 원고와 자연스럽게 연결합니다.',
        markdown: `## 등장인물 자동 하이라이트

설정집에 등록한 등장인물 이름이 본문에 등장하면 자동으로 컬러 하이라이트되어 호칭 실수를 줄여줍니다.

## 회차별 플롯 · 복선 연결

각 회차 상단 속성 바에서 해당 회차의 핵심 플롯과 연결된 복선을 한눈에 확인하고 회수 여부를 체크합니다.

## 멀티 마인드맵 보드

인물 관계도, 세력 구도, 사건 타임라인 등 목적에 따라 여러 개의 마인드맵 보드를 만들어 정리할 수 있습니다.`,
      },
    ],
  },
  {
    id: 'sync-ai',
    label: '동기화 & AI',
    docs: [
      {
        id: 'local-network',
        title: '로컬 저장 & 기기 간 통신',
        lead: '원고를 외부 서버에 맡기지 않는 로컬-퍼스트 구조입니다.',
        markdown: `## 내 기기 우선 저장

모든 원고와 설정은 작성자 본인의 기기에 먼저 저장되므로 오프라인 환경에서도 지연 없이 집필할 수 있습니다.

## 같은 네트워크 내 기기 간 통신

같은 Wi-Fi에 연결된 PC와 모바일 기기끼리 외부 서버를 거치지 않고 직접 원고를 주고받습니다.`,
      },
      {
        id: 'login-key',
        title: 'Login Key & Google Drive 백업',
        lead: '회원가입 없이 키 하나로 암호화 저장소를 만들고 백업합니다.',
        markdown: `## Login Key (개발자도 알 수 없는 키)

번거로운 가입 절차 없이 고유 **Login Key** 하나만으로 암호화 저장소가 생성됩니다.

> 이 키는 개발자도 알 수 없으므로 분실하지 않도록 안전하게 보관해 주세요.

## 개인 Google Drive E2EE 백업

원할 경우 개인 Google Drive를 연결해 기기에서 종단간 암호화(E2EE)된 상태로 백업할 수 있습니다.`,
      },
      {
        id: 'ai-assist',
        title: 'AI 퇴고 · 문체 보조',
        lead: '원고 학습 걱정 없이 본인이 쓰는 AI API만 직접 연결합니다.',
        markdown: `## 내 API 키 직접 연결 (BYOK)

Penso는 원고를 수집하거나 AI 학습에 사용하지 않습니다. 본인이 발급받은 API 키를 연결해 스플릿 화면에서 문체 변환과 비문 다듬기를 비교하며 퇴고할 수 있습니다.`,
      },
    ],
  },
  {
    id: 'help',
    label: '도움말',
    docs: [
      {
        id: 'faq',
        title: '자주 묻는 질문',
        lead: 'Penso 사용 중 자주 궁금해하시는 질문들을 모았습니다.',
        markdown: `## 정말 무료인가요?

네. 핵심 집필·설정집·마인드맵·동기화 기능은 모두 무료입니다. AI 퇴고 기능만 본인 API 키를 연결해 사용합니다.

## 업데이트는 어떻게 받나요?

새 버전이 출시되면 앱 내 안내를 통해 업데이트하거나, 홈의 다운로드 섹션에서 최신 설치 파일을 내려받아 덮어쓸 수 있습니다.`,
      },
    ],
  },
];

function stripFrontmatter(md) {
  if (!md) return '';
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, '');
}

export function useGuideDocs() {
  const [groups, setGroups] = useState(FALLBACK_DOC_GROUPS);
  const [source, setSource] = useState('fallback'); // 'github' | 'fallback'
  const [manifestLoading, setManifestLoading] = useState(true);
  const [docContent, setDocContent] = useState('');
  const [docLoading, setDocLoading] = useState(false);

  const cacheRef = useRef(new Map());

  // 1. Load docs/index.json from public GitHub repo (fallback to built-in docs if not uploaded yet)
  useEffect(() => {
    const controller = new AbortController();

    async function loadManifest() {
      try {
        const res = await fetch(SITE_CONFIG.github.docsManifestUrl, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0]?.docs?.length > 0) {
          setGroups(data);
          setSource('github');
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        // Keep built-in fallback silently until docs/index.json is added to the repo
      } finally {
        setManifestLoading(false);
      }
    }

    loadManifest();
    return () => controller.abort();
  }, []);

  // 2. Load selected doc's .md file from GitHub (or built-in markdown)
  const loadDoc = (doc) => {
    if (!doc) return undefined;

    if (source !== 'github' || !doc.file) {
      setDocContent(doc.markdown || '');
      setDocLoading(false);
      return undefined;
    }

    const filePath = doc.file.replace(/^\.\//, '').replace(/^\//, '');
    if (cacheRef.current.has(filePath)) {
      setDocContent(cacheRef.current.get(filePath));
      setDocLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setDocLoading(true);

    const url = `${SITE_CONFIG.github.docsRawBaseUrl}/${filePath}`;
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const cleaned = stripFrontmatter(text);
        cacheRef.current.set(filePath, cleaned);
        setDocContent(cleaned);
        setDocLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setDocContent(doc.markdown || '문서를 불러오지 못했습니다.');
        setDocLoading(false);
      });

    return () => controller.abort();
  };

  return {
    groups,
    source,
    manifestLoading,
    docContent,
    docLoading,
    loadDoc,
    rawBaseUrl: SITE_CONFIG.github.docsRawBaseUrl,
  };
}
