# 기름값 지킴이 ⛽

전국 17개 시도 주유소 실시간 최저가 검색 + 주유 가계부 + 카드 할인 비교 + 절약 리포트

## 기술 스택

- 정적 HTML + Vanilla JS + Tailwind (CDN)
- Vercel Serverless Function (Node.js) — 오피넷 API 프록시
- 데이터: [한국석유공사 오피넷 OpenAPI](https://www.opinet.co.kr/user/custapi/custApiInfo.do)

## 환경변수

Vercel 프로젝트 설정 → Environment Variables 에 다음을 추가:

| Key | Value |
|---|---|
| `OPINET_API_KEY` | 오피넷에서 발급받은 무료 API 키 |

## 로컬 개발 (선택)

배포 후엔 로컬 서버가 필요 없습니다. 개발용 로컬 서버는 별도 폴더의 `server.py` 참고.
