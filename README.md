# A/B 테스트 기반 사용자 행동 분석 시스템

## 📋 프로젝트 목표

두 가지 버전의 상품 상세 페이지(A/B 테스트)를 배포하고, 사용자의 행동 데이터를 수집하여 어떤 UI/UX가 더 높은 구매 전환율을 보이는지 분석하는 시스템을 구축합니다. 이 프로젝트는 서버 없이 프런트엔드와 BaaS(Backend as a Service)만을 사용하여 최신 웹 기술 트렌드를 적용하는 데 중점을 두었습니다.

---

## 🛠️ 기술 스택

-   **Frontend**: HTML, CSS, Vanilla JavaScript
-   **Build Tool**: Vite
-   **Database & Backend**: [Supabase](https://supabase.com/) (BaaS)
-   **Analytics**: Custom Event Tracking

---

## 📊 수집하는 데이터 항목 및 목적

사용자의 관심도와 구매 결정 과정을 파악하기 위해 아래와 같은 데이터를 수집합니다.

-   **`page_view`**: 각 페이지(Version A/B)의 기본적인 트래픽과 노출도를 측정합니다.
-   **`scroll`**: 페이지 스크롤 깊이(`max_scroll_pct`)와 총 체류 시간(`time_on_page_ms`)을 통해 사용자의 관심도와 콘텐츠 소비 수준을 파악합니다.
-   **`section_dwell`**: 페이지 내 각 섹션(Hero, Images, Detail 등)에 머무른 시간을 측정하여 어떤 콘텐츠가 사용자에게 더 매력적인지 분석합니다.
-   **`add_to_cart`**: 구매 의도를 나타내는 핵심 지표로, 장바구니에 상품을 담는 행동을 추적합니다.
-   **`purchase`**: 최종 전환율을 측정하는 가장 중요한 지표입니다. 장바구니를 거쳤는지(`source: cart`), 바로 구매했는지(`source: direct`) 경로를 함께 수집하여 구매 패턴을 분석합니다.

---

## 🚀 실행 방법

1.  **프로젝트 복제 및 의존성 설치**
    ```bash
    git clone [your-repository-url]
    cd behavior-analytics-site
    npm install
    ```

2.  **Supabase 가상 데이터 주입 (최초 1회)**
    Supabase에 분석할 가상 데이터를 채워 넣습니다.
    ```bash

    ```
    *(이 스크립트는 `events` 테이블의 기존 데이터를 모두 삭제하고 새로운 데이터를 생성합니다.)*

3.  **프런트엔드 서버 실행**
    ```bash
    npm run dev
    ```

4.  **확인하기**
    -   **A/B 테스트 페이지**: `http://localhost:5173/version-a.html` 또는 `version-b.html`에 접속하여 스크롤, 버튼 클릭 등의 행동을 테스트합니다.
    -   **데이터 수집 확인**: Supabase 프로젝트의 `events` 테이블에서 실시간으로 데이터가 쌓이는 것을 확인합니다.
    -   **대시보드**: `http://localhost:5173/dashboard.html`에 접속하여 Supabase에 저장된 데이터를 기반으로 시각화된 분석 결과를 확인합니다.

---

## 📸 스크린샷

*(이곳에 대시보드 스크린샷, Supabase 테이블 스크린샷 등을 추가하여 포트폴리오의 완성도를 높이세요.)*

**대시보드 예시**
![Dashboard Screenshot](image_f62e58.png)

**Supabase 데이터 테이블**

---

## 🔗 배포 링크

-   **Live Demo**: [여기에 Vercel 또는 Netlify 배포 링크를 추가하세요]