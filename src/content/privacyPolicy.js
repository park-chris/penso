export const PRIVACY_POLICY_MD = `# Penso 개인정보처리방침 (Privacy Policy)

**시행일: 2026년 11월 28일**
**운영자: Penso Friends**
**문의 이메일: pensofriends@gmail.com**

Penso(이하 "앱")는 사용자의 개인정보와 창작 원고를 최우선으로 보호합니다. 본 앱은 **로컬 우선(Local-First)** 구조로 설계되었으며, 운영자가 원고나 개인정보를 수집·보관하는 별도의 중앙 서버를 운영하지 않습니다.

---

## 1. 수집하는 정보 및 저장 위치

1. **원고, 설정집, 메모, 이미지 등 창작 데이터**
   - 모든 창작 데이터는 사용자의 기기 내부 저장소(\`localStorage\`, \`IndexedDB\`)에만 저장됩니다.
   - 운영자는 사용자의 원고 내용, 설정집, 이미지에 접근하거나 열람할 수 없습니다.
2. **앱 시작 잠금 비밀번호 및 저장소 키(Login Key)**
   - 앱 시작 잠금 비밀번호는 기기 내부에 단방향 해시(SHA-256 + 랜덤 솔트) 형태로만 저장되며 외부로 전송되거나 동기화되지 않습니다.
   - 저장소 키(Login Key)는 암호화 키 파생에만 사용되며 운영자 서버로 전송되지 않습니다.
3. **Google 계정 정보 (선택 기능 — Google Drive 동기화 사용 시)**
   - 사용자가 직접 Google Drive 동기화를 연동한 경우에 한하여, OAuth 2.0 인증을 통해 **이메일 주소** 및 **\`drive.appdata\`(앱 전용 숨김 폴더)** 접근 권한을 요청합니다.
   - Google Drive에 업로드되는 원고 및 이미지는 업로드 전 사용자의 기기에서 **AES-256-GCM 방식으로 종단간 암호화**되어 저장되며, 사용자의 다른 Google Drive 파일에는 일절 접근하지 않습니다.
   - 이메일 주소는 앱 내 연동 상태 표시 목적으로만 기기 내부에 저장되며, 운영자 서버로 전송되지 않습니다.
4. **AI API 키 (선택 기능 — AI 기능 사용 시)**
   - 사용자가 직접 입력한 Google Gemini, OpenAI, Anthropic API 키는 사용자의 기기 내부에만 저장됩니다.
   - 사용자가 퇴고·대체 표현·감평 등 AI 기능을 실행할 때에만 선택한 텍스트가 사용자가 지정한 AI 제공사(Google / OpenAI / Anthropic)의 공식 API 엔드포인트로 HTTPS 암호화 통신을 통해 직접 전송됩니다.

---

## 2. 개인정보의 제3자 제공 및 외부 통신

Penso는 사용자의 개인정보를 제3자에게 판매, 대여 또는 무단 제공하지 않습니다. 사용자가 선택한 기능에 따라 아래 외부 서비스와 직접 통신할 수 있습니다.

- **Google Drive API (\`drive.appdata\`)**: 사용자가 Google Drive 동기화를 활성화한 경우 암호화된 백업 파일 저장 및 불러오기
- **WebRTC P2P 동기화**: 사용자가 실시간 기기 간 동기화를 활성화한 경우, 기기 간 직접 연결(DTLS/SRTP) 위에서 사용자의 저장소 키 기반 **AES-256-GCM 암호문**만 교환
- **AI 모델 제공사 (Google / OpenAI / Anthropic)**: 사용자가 본인 API 키를 등록하고 AI 기능을 직접 실행한 경우

Penso는 광고 SDK, 행동 추적 분석(Analytics) SDK를 포함하지 않습니다.

---

## 3. 정보의 보관 기간 및 삭제 방법

- 앱은 운영자 서버에 사용자 데이터를 저장하지 않으므로, 사용자가 앱 데이터를 삭제하거나 앱을 제거하면 기기 내 모든 데이터가 즉시 삭제됩니다.
- Google Drive 동기화 데이터는 앱 내 **[설정 → 동기화 및 클라우드 → Google Drive 연결 해제]** 또는 Google 계정 설정의 **[연결된 앱 관리]**에서 언제든지 권한을 철회하고 숨김 앱 데이터를 삭제할 수 있습니다.

---

## 4. 아동의 개인정보 보호

본 앱은 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.

---

## 5. 개인정보처리방침의 변경

법령 또는 서비스 기능 변경에 따라 본 방침이 수정될 수 있으며, 변경 시 앱 공지 또는 웹사이트를 통해 안내합니다.

---

## 6. 문의처

개인정보 보호와 관련한 문의 사항은 아래 이메일로 연락해 주세요.
- 이메일: **pensofriends@gmail.com**

---

# Privacy Policy (English Summary)

**Effective Date: November 28, 2026**
**Developer: Penso Friends**
**Contact: (Insert your support email here)**

Penso is a **local-first** novel writing and worldbuilding application. We do **not** operate any central server that collects or stores your manuscripts, images, or personal data.

1. **Local Storage**: All manuscripts, lore notes, images, and app lock credentials (salted SHA-256 hash) are stored locally on your device.
2. **Optional Google Drive Sync**: If you opt in to Google Drive sync, Penso requests \`userinfo.email\` (displayed locally to show connection status) and \`drive.appdata\` (hidden app-only folder). All synced data and images are end-to-end encrypted (\`AES-256-GCM\`) on your device prior to upload. Penso never accesses any other files in your Google Drive.
3. **Optional Peer-to-Peer Sync**: If enabled, synced payloads are end-to-end encrypted with your local vault key before WebRTC transmission.
4. **Optional AI Features (BYOK)**: If you enter your own API key (Google Gemini, OpenAI, or Anthropic), requests are sent directly from your device to the provider you chose over HTTPS. Your API keys remain on your device.
5. **No Ads or Tracking**: Penso contains no advertising SDKs or third-party behavioral analytics trackers.
6. **Data Deletion**: Uninstalling the app or clearing app storage deletes all local data. You may revoke Google Drive access and delete hidden app data at any time in your Google Account settings.
`;
