# 정삼각형 8개로 만들 수 있는 다면체는?

정삼각형 8개로 만들 수 있는 다면체를 탐구하는 인터랙티브 웹 애플리케이션입니다. Three.js를 활용하여 3D 모델을 시각화하고, 전개도에서 다면체로 접히는 과정을 애니메이션으로 확인할 수 있습니다.

## 기능

- **3D 모델 시각화**: Three.js를 사용한 3차원 모델 렌더링
- **인터랙티브 애니메이션**: 슬라이더를 통해 전개도가 다면체로 접히는 과정을 조절
- **두 가지 다면체 탐구**:
  - 정팔면체 (Octahedron)
  - 보트형 다면체 (Boat Polyhedron / Tritetrahedron)
- **파스텔톤 디자인**: 아기자기한 느낌의 UI/UX

## 기술 스택

- **Three.js**: 3D 그래픽 렌더링
- **Vite**: 빌드 도구
- **JavaScript**: 순수 JavaScript (ES6+)

## 설치 및 실행

### 사전 요구사항

- Node.js (v16 이상 권장)
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 미리보기

```bash
npm run preview
```

## 사용 방법

1. 초기 화면에서 전개도를 확인합니다.
2. "몇 개의 다면체를 만들 수 있는지 확인하기" 버튼을 클릭합니다.
3. 좌우에 나타나는 두 개의 다면체를 확인합니다.
4. 각 다면체 아래의 "전개도 접어보기" 버튼을 클릭하여 애니메이션을 재생합니다.
5. 애니메이션이 끝나면 슬라이더를 직접 조절하여 전개도가 접히는 과정을 단계별로 확인할 수 있습니다.
6. 양쪽 슬라이더가 모두 표시되면 좌상단의 "처음으로 되돌아가기" 버튼이 나타납니다.

## 프로젝트 구조

```
ew-octa-boat-hedron/
├── public/
│   └── 3dModels/          # 3D 모델 파일 (.glb)
│       ├── 8-faced-hedrons-boat.glb
│       └── 8-faced-hedrons-octa.glb
├── src/
│   ├── main.js           # 메인 애플리케이션 로직
│   └── style.css         # 스타일시트
├── index.html            # HTML 엔트리 포인트
├── package.json          # 프로젝트 의존성
├── vite.config.js        # Vite 설정
└── README.md             # 프로젝트 문서
```

## 배포

이 프로젝트는 Netlify를 통해 배포할 수 있습니다.

1. GitHub에 프로젝트를 푸시합니다.
2. Netlify에서 새 사이트를 생성하고 GitHub 저장소를 연결합니다.
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 배포를 완료합니다.

## 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 제작자

Made by Hyowon Wang

