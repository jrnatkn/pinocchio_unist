# PINOCCHIO 웹사이트

사이트에 보이는 모든 문구·이름·연락처는 **`content.json` 한 파일**에 들어 있습니다.
이 파일만 고치면 네 페이지(홈·소개·활동·조직도)가 모두 함께 바뀝니다. HTML·CSS·JS는 건드리지 않아도 됩니다.

## 폴더 구성

```
pinocchio-site/
├─ content.json        ← 내용은 여기만 수정
├─ index.html          홈
├─ about.html          소개
├─ activities.html     활동
├─ team.html           조직도 · 연락처
└─ assets/
   ├─ logo.jpg         로고
   ├─ images/          활동·프로젝트 사진을 넣는 곳
   ├─ style.css        디자인
   └─ app.js           content.json을 읽어 페이지를 그리는 코드
```

## content.json 수정 방법

| 바꾸고 싶은 것 | 위치 |
|---|---|
| 동아리 이름, 테마 색, 로고 | `site` |
| 메뉴 이름 | `nav` |
| 이메일·인스타그램·카카오톡·동아리방 | `contact` (모든 페이지 하단과 연락처에 같이 반영) |
| 홈 제목·소개·숫자 정보 | `home.titleLines`, `home.intro`, `home.facts` |
| 홈 "하는 일" 카드 | `home.whatWeDo.items` |
| 홈 프로젝트 카드 | `home.projects.items` |
| 신입 부원 모집 | `home.recruit` |
| 소개 페이지 개요·활동 분야·연간 일정 | `about` |
| 활동 목록·대외활동 기록 | `activities.items`, `activities.records` |
| 회장·부회장·지도교수·부서 | `team` |

### 자주 하는 작업

**항목 추가/삭제** — 목록(`[ ... ]`) 안의 `{ ... }` 한 덩어리를 복사해 붙이거나 지우면 됩니다.
카드 번호(01, 02…)는 순서대로 자동으로 붙습니다. 목록을 비우면(`[]`) 그 섹션은 자동으로 숨겨집니다.

**사진 넣기** — 사진 파일을 `assets/images/`에 넣고, 해당 항목의 `"image"`에 경로를 적습니다.
```json
{ "type": "대회", "year": "2026", "title": "OO 로봇 대회", "image": "assets/images/contest2026.jpg" }
```
`"image": ""`로 두면 사진 칸 없이 글자만 표시됩니다.

**협력 단체 로고** — `home.whatWeDo.items`의 "외부 협력" 항목에 있는 `partners`에 추가합니다.
```json
"partners": [
  { "name": "UNIST 기계공학과", "logo": "assets/images/partner-me.png" },
  { "name": "OO 재단" }
]
```
로고가 없으면 단체 이름이 그 자리에 표시되고, 목록이 비어 있으면 협력 단체 줄 자체가 나타나지 않습니다.

**활동 구분** — `activities.items`의 `"scope"`를 `"교내"` 또는 `"대외"`로 적으면 탭 필터와 색이 자동으로 맞춰집니다.

**제목 강조 색** — `home.titleHighlight`에 적은 단어가 홈 제목에서 테마 색으로 표시됩니다.

### 수정할 때 주의할 점

- 모든 글자는 큰따옴표(`"`)로 감쌉니다.
- 항목과 항목 사이에는 쉼표(`,`)가 필요하고, 목록의 **마지막 항목 뒤에는 쉼표를 넣지 않습니다**.
- 저장 후 페이지에 "content.json을 불러오지 못했습니다"가 뜨면 대부분 쉼표·따옴표 문제입니다.
  https://jsonlint.com 에 붙여 넣으면 틀린 줄을 알려 줍니다.

## 내 컴퓨터에서 미리 보기

`index.html`을 더블클릭하면 브라우저 보안 정책 때문에 `content.json`을 읽지 못합니다. 폴더에서 아래를 실행하세요.

```bash
cd pinocchio-site
python3 -m http.server 8000
```

브라우저에서 http://localhost:8000 을 엽니다. 수정 후에는 새로고침만 하면 됩니다.

## 배포

빌드 과정 없이 폴더 그대로 올리면 됩니다.

- **GitHub Pages** — 저장소에 폴더 내용을 올리고 Settings → Pages에서 브랜치를 선택합니다. 이후 GitHub 웹에서 `content.json`을 바로 편집해도 사이트에 반영됩니다.
- **Netlify** — https://app.netlify.com/drop 에 폴더를 끌어다 놓습니다.

## 문의 양식

정적 사이트라 서버가 없으므로, "보내기"를 누르면 방문자의 메일 앱이 열리고 `contact.email` 주소로 작성 내용이 채워집니다.
양식 결과를 메일 앱 없이 받고 싶다면 Formspree 같은 양식 서비스를 연결해야 합니다.
