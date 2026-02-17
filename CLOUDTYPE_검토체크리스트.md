# Cloudtype 배포 검토 체크리스트

배포 링크: `https://app.cloudtype.io/@gas0044/todo-backend:main/vibe-todo-backend#settings`

---

## ✅ 코드 쪽 (이미 적절함)

| 항목 | 상태 | 비고 |
|------|------|------|
| **PORT** | ✅ | `process.env.PORT \|\| 5000` 사용 → Cloudtype이 준 PORT 사용 |
| **시작 스크립트** | ✅ | `package.json`에 `"start": "node index.js"` 있음 |
| **MONGO 연결** | ✅ | `process.env.MONGO_URL` 또는 `process.env.MONGO_URI` 사용 |
| **.env 미포함** | ✅ | `.gitignore`에 `.env` 포함 → 비밀번호 안 올라감 |
| **루트 응답** | ✅ | `GET /` → "서버가 동작 중입니다." |
| **헬스/확인용** | ✅ | `GET /api/db-info` → Atlas 연결 여부 확인 가능 |

---

## 🔧 Cloudtype 대시보드에서 확인할 것

### 1. 환경 변수 (Settings → Environment Variables)

| 이름 | 필수 | 설명 |
|------|------|------|
| **MONGO_URL** | ✅ 필수 | MongoDB Atlas 연결 문자열 전체 (시크릿 권장) |
| PORT | ❌ 불필요 | Cloudtype이 자동 설정 |

- 값: `mongodb+srv://gas004444_db_user:비밀번호@cluster0.wsuv9mb.mongodb.net/todo?authSource=admin&retryWrites=true&w=majority`
- **시크릿**으로 저장했는지 확인.

### 2. 빌드/실행 설정 (Settings → 빌드 설정)

| 설정 | 권장값 | 비고 |
|------|--------|------|
| **빌드 명령** | `npm ci` 또는 `npm install` | 의존성 설치 |
| **시작 명령** | `npm start` | `node index.js` 실행됨 |
| **소스 경로** | 비움(루트) | 저장소가 `vibe_todo_backend` 단일 프로젝트면 루트 그대로 |

- 저장소가 **vibe_todo_backend만** 있는 경우: 소스 경로 비워두기.
- 상위 repo에서 이 폴더만 배포하는 경우: 소스 경로에 `todo_backend` 등 지정.

### 3. 배포 후 확인

1. **서비스 URL**  
   대시보드에서 "연결" 또는 "서비스 URL" 복사 (예: `https://vibe-todo-backend-xxx.cloudtype.app`).

2. **동작 확인**
   - `https://서비스URL/` → "서버가 동작 중입니다." 나오는지
   - `https://서비스URL/api/db-info` → `connectedTo: "Atlas"` 인지
   - `https://서비스URL/api/todos` → GET 시 `[]` 또는 할일 배열

3. **실패 시**
   - 로그 탭에서 `MongoDB 연결 실패` 등 에러 메시지 확인.
   - `MONGO_URL` (이름/값) 다시 확인.

---

## 📌 프론트엔드 연동 시

React 등 프론트에서 API 주소를 **배포된 URL**로 바꿔야 합니다.

- 로컬: `http://localhost:5000/api/todos`
- 배포: `https://vibe-todo-backend-xxx.cloudtype.app/api/todos`

환경 변수로 나누는 것을 권장 (예: `VITE_API_BASE` 등).
