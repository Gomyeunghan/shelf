@AGENTS.md

# Shelf

친구들과 음악 플레이리스트를 공유하는 그룹 공간 앱.

## 기술 스택

- Next.js 14 + TypeScript
- shadcn/ui + Tailwind CSS
- Supabase (Auth + DB + Storage)
- YouTube Data API v3
- 배포: Vercel

## DB 테이블

User, Playlist, Track, Group, GroupMember, PlaylistGroup

## 페이지 구조

- `/login` 로그인/회원가입
- `/home` 내 서재 + 그룹 탭
- `/playlist/[id]` 플리 상세 + 재생
- `/group/[id]` 그룹 홈

## 진행 상황

- ✅ 1단계: 프로젝트 셋업
- ✅ 2단계: Supabase Auth (로그인/회원가입)
- 🔄 3단계: 플레이리스트 CRUD + YouTube API
- ⬜ 4단계: 그룹 기능
- ⬜ 5단계: YouTube IFrame 재생
- ⬜ 6단계: UI 다듬기 + PWA + 배포

## 코드 컨벤션

### 파일명

- 컴포넌트: PascalCase (`PlaylistCard.tsx`)
- 그 외 (hooks, utils, lib): camelCase (`usePlaylist.ts`, `formatDate.ts`)

### 함수

- 화살표 함수 사용

```ts
const PlaylistCard = () => { ... }
const fetchPlaylists = async () => { ... }
```

### CSS

- Tailwind만 사용, 인라인 style 금지

### 폴더 구조

```
src/
├── app/          # 페이지 (Next.js App Router)
├── components/   # 공통 컴포넌트
├── hooks/        # 커스텀 훅
├── lib/          # supabase 클라이언트 등
└── types/        # 타입 정의
```

### 타입

- `interface` 대신 `type` 사용
- Supabase 테이블 타입은 `types/` 폴더에 정의

### 기타

- 서버 컴포넌트 기본, 클라이언트는 필요할 때만 `'use client'`
- 환경변수는 `.env.local` 관리, 절대 커밋 금지

## 커밋 컨벤션

### 형식

```
타입: 한글로 간단히 설명
```

### 타입 종류

| 타입       | 설명                      |
| ---------- | ------------------------- |
| `feat`     | 새 기능 추가              |
| `fix`      | 버그 수정                 |
| `style`    | UI 변경 (기능 변화 없음)  |
| `refactor` | 코드 리팩토링             |
| `chore`    | 설정, 패키지 등 기타 작업 |
| `docs`     | 문서 수정                 |

### 예시

```
feat: 플레이리스트 생성 기능 추가
fix: 로그인 후 리다이렉트 안 되는 버그 수정
style: 홈 카드 레이아웃 수정
refactor: Supabase 쿼리 훅으로 분리
chore: YouTube API 키 환경변수 추가
```
