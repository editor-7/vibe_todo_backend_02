# Cloudtype 배포 시 .env (환경 변수) 설정

## ⚠️ 중요: .env 파일은 올리지 마세요

- `.env` 파일은 **Git에 포함되지 않습니다** (.gitignore에 있음).
- Cloudtype에서는 **대시보드에서 환경 변수를 입력**하면 됩니다.
- 비밀번호가 들어 있는 연결 문자열은 **시크릿**으로 등록하는 것을 권장합니다.

---

## Cloudtype에서 설정할 환경 변수

### 1. Cloudtype 대시보드 들어가기

1. [Cloudtype](https://cloudtype.io) 로그인
2. 해당 **프로젝트** 선택
3. **서비스** 선택 (또는 새로 만들기)
4. **설정** 또는 **Environment Variables** 메뉴로 이동

### 2. 추가할 변수

| 이름 (Key) | 값 (Value) | 비고 |
|------------|------------|------|
| `MONGO_URL` | `mongodb+srv://사용자:비밀번호@cluster0.wsuv9mb.mongodb.net/todo?authSource=admin&retryWrites=true&w=majority` | **시크릿**으로 설정 권장 (비밀번호 포함) |

- **MONGO_URL**  
  로컬 `.env`에 넣었던 **MongoDB Atlas 연결 문자열 전체**를 그대로 복사해서 Value에 붙여넣기.
- `PORT`는 Cloudtype이 자동으로 넣어 주므로 **설정하지 않아도 됩니다.**

### 3. 시크릿으로 등록하는 방법 (권장)

- Cloudtype에서 환경 변수 추가 시 **"시크릿"** 옵션을 켜면, 값이 암호화되어 저장됩니다.
- Key: `MONGO_URL`  
  Value: (Atlas 연결 문자열)  
  → **시크릿** 체크 후 저장

---

## 배포 후 확인

- 서비스 URL 예: `https://서비스이름-프로젝트이름.cloudtype.app`
- `https://서비스URL/api/db-info` 로 접속하면 `connectedTo: "Atlas"` 인지 확인 가능.
- 할일 API: `https://서비스URL/api/todos` (GET, POST 등)

---

## 정리

| 구분 | 로컬 | Cloudtype |
|------|------|-----------|
| 설정 방법 | `.env` 파일에 `MONGO_URL=...` | 대시보드 **Environment Variables**에 `MONGO_URL` 입력 |
| .env 파일 | 사용함 (Git 제외) | **업로드하지 않음** |
| PORT | 5000 (또는 .env) | Cloudtype이 자동 설정 |
