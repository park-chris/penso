## BYOK (내 API 키 직접 연결)

Penso는 별도의 AI 월 구독료를 받지 않으며, 작가님이 직접 사용하는 AI 제공사의 **API 키를 연결(BYOK)**해 필요한 만큼만 사용하는 방식입니다.

- **원고 학습 걱정 없음**: Penso 자체 서버를 거치지 않고 내 기기에서 API 제공사로 직접 요청합니다. Penso가 원고를 수집하거나 AI 학습에 활용하지 않습니다.
- **사용하던 AI 모델 그대로**: 추가 구독료를 지불하지 않고 원래 사용하던 AI를 연결하여 사용할 수 있습니다.

## 연결 방법

1. 왼쪽 하단 **설정 → AI 설정**으로 이동합니다.
2. 사용하는 AI 제공사를 선택하고 본인이 발급받은 API 키를 입력합니다.
3. 저장 후 에디터에서 텍스트를 드래그해 우클릭하면 바로 AI 퇴고·대체 표현 기능을 사용할 수 있습니다.

### Gemini API Key 발급

1. [Google AI Studio](https://aistudio.google.com)에 로그인합니다.
2. 왼쪽 메뉴 하단의 `Get API Key`로 이동합니다.
3. `API 키 만들기` → `새 키 만들기`를 클릭해 API Key를 발급받습니다.
4. `키 복사`를 눌러 발급된 키를 복사합니다.
5. 앱으로 돌아와 `설정 → AI 설정 → AI 모델 Manager`에서 `+` 버튼을 눌러 Google Gemini를 선택한 뒤 API Key 입력창에 붙여넣습니다.

> Gemini API는 무료 등급(일일 요청 한도 있음)으로도 바로 테스트해 볼 수 있습니다. 단, Google 약관상 무료 등급은 서비스 품질 개선에 입력이 활용될 수 있으며, **유료 결제를 연결하면 입력 데이터가 학습에 사용되지 않습니다.**


### OpenAI API Key 발급

1. [OpenAI Platform](https://platform.openai.com)에 로그인합니다.
2. 오른쪽 상단 톱니바퀴(`Settings`) 또는 왼쪽 메뉴에서 `API keys`로 이동합니다.
3. `Create new secret key`를 클릭해 이름(예: `Penso`)을 입력하고 API Key를 발급받습니다.
4. 발급된 키(`sk-...`)를 바로 복사합니다. *(창을 닫으면 다시 확인할 수 없습니다.)*
5. 앱으로 돌아와 `설정 → AI 설정 → AI 모델 Manager`에서 `+` 버튼을 눌러 OpenAI를 선택한 뒤 API Key 입력창에 붙여넣습니다.

> OpenAI API는 ChatGPT Plus 구독과 별도이므로, `Settings → Billing`에서 크레딧을 충전해야 정상적으로 호출됩니다.

### Claude API Key 발급

1. [Anthropic Console](https://console.anthropic.com)에 로그인합니다.
2. 왼쪽 메뉴에서 `API keys`로 이동합니다.
3. `Create Key`를 클릭해 이름(예: `Penso`)을 입력하고 API Key를 발급받습니다.
4. 발급된 키(`sk-ant-...`)를 바로 복사합니다. *(창을 닫으면 다시 확인할 수 없습니다.)*
5. 앱으로 돌아와 `설정 → AI 설정 → AI 모델 Manager`에서 `+` 버튼을 눌러 Anthropic Claude를 선택한 뒤 API Key 입력창에 붙여넣습니다.

> Claude API는 Claude Pro 구독과 별도이므로, `Plans & Billing`에서 크레딧을 충전해야 정상적으로 호출됩니다.