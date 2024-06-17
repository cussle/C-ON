# C-ON

## 개요
- CNU 2024-봄학기 데이터베이스 텀프로젝트
- 텀프로젝트 문제 요구사항을 충족하는 웹 페이지 구현

## 페이지 목록
- [ ] 메인 페이지(=카테고리 선택 페이지)
- [ ] 메뉴 선택 페이지
- [X] 로그인 페이지
- [ ] 장바구니 페이지
- [ ] 주문내역 페이지
- [ ] 관리자 화면

## 기능 목록
### 1. 회원 기능
- [X] 고객번호와 비밀번호를 이용하여 로그인 가능
- [ ] 여러 카테고리로 나누어 브라우징 
- [ ] 카테고리 정보와 음식 정보 보여주기 
- [ ] 하나의 음식이 여러 다른 카테고리에 포함됨
- [ ] 키워드 입력 시 해당 음식 검색
- [ ] 가격 범위를 정해서 해당 음식 검색
- [ ] 최소값, 최대값 범위에 포함된 음식 검색
- [ ] 키워드와 가격 범위를 정해서 음식 검색

### 2. 장바구니 기능
- [ ] 하나의 주문에 여러 개의 음식을 담을 수 있는지 확인
- [ ] 주문하는 음식의 개수에 따라 음식 가격이 계산
- [ ] 장바구니에 담긴 모든 음식에 대한 총 결제 금액이 계산

### 3. 결제 기능
- [ ] 결제 버튼 누르면 장바구니에서 사라짐
- [ ] 결제 완료된 카트 정보와 음식 정보가 데이타베이스에 저장됨

### 4. 주문 내역 조회 기능
- [ ] 과거부터 현재까지 주문한 전체 내역 조회
- [ ] 시작 날짜와 종료 날짜를 지정하여 주문 내역 조회 

### 5. 통계 정보
- [ ] 그룹 함수를 이용한 질의
- [ ] 윈도우 함수를 이용한 질의

## 기술 스택
- **HTML5**: [HTML5 Documentation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
- **CSS3**: [CSS3 Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3)
- **JavaScript**: [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **jQuery**: [jQuery Documentation](https://api.jquery.com/)
- **Bootstrap**: [Bootstrap Documentation](https://getbootstrap.com/docs/)
- **PHP**: [PHP Documentation](https://www.php.net/docs.php)
- **Oracle**: [Oracle Database Documentation](https://docs.oracle.com/en/database/)

## 개발 규칙 및 스타일 가이드
### 코드 스타일 (Code Style)
- **HTML/CSS/JavaScript**: 코드 들여쓰기는 4 스페이스를 사용합니다. 변수명은 `camelCase`를 사용하고, 상수는 `UPPER_CASE`를 사용합니다.
- **PHP**: PSR-12 표준을 따릅니다. 클래스명은 `PascalCase`를 사용하고, 메소드와 변수명은 `camelCase`를 사용합니다.
### 커밋 메시지 (Commit Messages)
- **AngularJS Git Commit Message Conventions**을 따릅니다.
