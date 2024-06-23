<?php
date_default_timezone_set('Asia/Seoul');

session_start();

// 데이터베이스 연결 정보
$host = 'localhost';
$port = '1521';
$sid = 'XE';
$username = 'd202002521';
$password = '1111';

// PDO DSN 구성
$dsn = "oci:dbname=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=$host)(PORT=$port))(CONNECT_DATA=(SID=$sid)));charset=AL32UTF8";

try {
    // PDO 인스턴스 생성
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(array('success' => false, 'message' => '연결 실패: ' . $e->getMessage())));
}

// 메뉴 조회
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';

    if ($action == 'getFilteredFood') {
        // 파라미터 가져오기
        $category = isset($_REQUEST['category']) ? $_REQUEST['category'] : 'all';
        $minPrice = isset($_REQUEST['minPrice']) ? $_REQUEST['minPrice'] : 0;
        $maxPrice = isset($_REQUEST['maxPrice']) ? $_REQUEST['maxPrice'] : 100000;
        $keyword = isset($_REQUEST['keyword']) ? trim($_REQUEST['keyword']) : '';

        // 기본 쿼리
        $query = 'SELECT DISTINCT f.foodName, f.price 
                  FROM Food f 
                  LEFT JOIN Contain c ON f.foodName = c.foodName';
        $conditions = [];

        // 조건 추가
        if ($category !== 'all') {
            $conditions[] = "c.categoryName = :category";
        }
        $conditions[] = "f.price BETWEEN :minPrice AND :maxPrice";
        if (!empty($keyword)) {
            $conditions[] = "f.foodName LIKE :keyword";
        }

        // 조건을 쿼리에 추가
        if (count($conditions) > 0) {
            $query .= ' WHERE ' . implode(' AND ', $conditions);
        }

        // 쿼리 준비 및 실행
        $stmt = $conn->prepare($query);
        if ($category !== 'all') {
            $stmt->bindParam(':category', $category, PDO::PARAM_STR);
        }
        $stmt->bindParam(':minPrice', $minPrice, PDO::PARAM_INT);
        $stmt->bindParam(':maxPrice', $maxPrice, PDO::PARAM_INT);
        if (!empty($keyword)) {
            $searchKeyword = '%' . $keyword . '%';
            $stmt->bindParam(':keyword', $searchKeyword, PDO::PARAM_STR);
        }
        $stmt->execute();

        // 결과를 배열로 가져오기
        $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // JSON으로 변환하여 출력
        echo json_encode(array('success' => true, 'data' => $foods));
    } else if ($action == 'getCart') {
        // 사용자 ID 가져오기 (예: 세션에 저장된 사용자 ID 사용)
        $userId = $_SESSION['cno'] ?? null;
    
        if ($userId) {
            $query = "
                SELECT 
                    C.id AS OrderID,
                    C.orderDateTime AS OrderDateTime,
                    C.cno AS CustomerNo,
                    OD.itemNo AS ItemNo,
                    OD.foodName AS FoodName,
                    LISTAGG(CT.categoryName, ', ') WITHIN GROUP (ORDER BY CT.categoryName) AS CategoryNames,
                    F.price AS UnitPrice,
                    OD.quantity AS Quantity,
                    OD.totalPrice AS TotalPrice
                FROM 
                    Cart C
                JOIN 
                    OrderDetail OD ON C.id = OD.id
                JOIN 
                    Contain CT ON OD.foodName = CT.foodName
                JOIN
                    Food F ON OD.foodName = F.foodName
                WHERE 
                    C.cno = :userId
                    AND C.id = (
                        SELECT MAX(id) 
                        FROM Cart 
                        WHERE cno = :userId
                    )
                GROUP BY 
                    C.id, C.orderDateTime, C.cno, OD.itemNo, OD.foodName, F.price, OD.quantity, OD.totalPrice
                ORDER BY 
                    C.orderDateTime, C.id, OD.itemNo
            ";
    
            try {
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                $stmt->execute();
                $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                echo json_encode(array('success' => true, 'data' => $cartItems));
            } catch (PDOException $e) {
                echo json_encode(array('success' => false, 'message' => '데이터베이스 오류: ' . $e->getMessage()));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => '사용자가 로그인되어 있지 않습니다.'));
        }
    } else if ($action == 'getRecentOrders') {
        try {
            // 일반 대중의 최근 주문 내역
            // 필요시 추가: FETCH FIRST 10 ROWS ONLY
            $query = '
                SELECT 
                    F.foodName AS FoodName, -- 음식 이름
                    EXTRACT(DAY FROM (SYSDATE - C.orderDateTime)) * 24 * 60 + 
                    EXTRACT(HOUR FROM (SYSDATE - C.orderDateTime)) * 60 + 
                    EXTRACT(MINUTE FROM (SYSDATE - C.orderDateTime)) AS TotalMinutesAgo, -- 현재 시각으로부터 몇 분 전에 주문되었는지 계산
                    EXTRACT(HOUR FROM (SYSDATE - C.orderDateTime)) AS HoursAgo, -- 현재 시각으로부터 몇 시간 전에 주문되었는지 계산
                    EXTRACT(MINUTE FROM (SYSDATE - C.orderDateTime)) AS MinutesAgo -- 현재 시각으로부터 몇 분 전에 주문되었는지 계산
                FROM 
                    OrderDetail O -- 주문 상세 테이블
                JOIN 
                    Food F ON O.foodName = F.foodName -- 음식 테이블과 조인하여 음식 정보를 가져옴
                JOIN 
                    Cart C ON O.id = C.id -- 카트 테이블과 조인하여 주문 시간 정보를 가져옴
                WHERE
                    C.id NOT IN (
                        SELECT MAX(C2.id)
                        FROM Cart C2
                        GROUP BY C2.cno
                    ) -- 각 사용자의 가장 최근의 카트 ID를 제외하여 실제 결제가 이루어진 주문만 선택
                ORDER BY 
                    C.orderDateTime DESC -- 주문 시간 내림차순으로 정렬하여 최근 주문이 먼저 오도록 함
            ';
    
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $recentOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // 로그인한 사용자의 주문 내역
            $userId = $_SESSION['cno'] ?? null;
            $userOrders = [];
    
            if ($userId) {
                $userQuery = '
                    SELECT 
                        F.foodName AS FoodName, -- 음식 이름
                        EXTRACT(DAY FROM (SYSDATE - C.orderDateTime)) * 24 * 60 + 
                        EXTRACT(HOUR FROM (SYSDATE - C.orderDateTime)) * 60 + 
                        EXTRACT(MINUTE FROM (SYSDATE - C.orderDateTime)) AS TotalMinutesAgo, -- 현재 시각으로부터 몇 분 전에 주문되었는지 계산
                        EXTRACT(HOUR FROM (SYSDATE - C.orderDateTime)) AS HoursAgo, -- 현재 시각으로부터 몇 시간 전에 주문되었는지 계산
                        EXTRACT(MINUTE FROM (SYSDATE - C.orderDateTime)) AS MinutesAgo -- 현재 시각으로부터 몇 분 전에 주문되었는지 계산
                    FROM 
                        OrderDetail O -- 주문 상세 테이블
                    JOIN 
                        Food F ON O.foodName = F.foodName -- 음식 테이블과 조인하여 음식 정보를 가져옴
                    JOIN 
                        Cart C ON O.id = C.id -- 카트 테이블과 조인하여 주문 시간 정보를 가져옴
                    WHERE 
                        C.cno = :userId -- 로그인한 사용자의 ID와 일치하는 주문을 선택
                        AND C.id NOT IN (
                            SELECT MAX(C2.id)
                            FROM Cart C2
                            WHERE C2.cno = :userId
                        ) -- 사용자의 가장 최근의 카트 ID를 제외하여 실제 결제가 이루어진 주문만 선택
                    ORDER BY 
                        C.orderDateTime DESC -- 주문 시간 내림차순으로 정렬하여 최근 주문이 먼저 오도록 함
                ';
    
                $userStmt = $conn->prepare($userQuery);
                $userStmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                $userStmt->execute();
                $userOrders = $userStmt->fetchAll(PDO::FETCH_ASSOC);
            }
    
            // JSON으로 응답
            echo json_encode(array(
                'success' => true,
                'data' => $recentOrders,
                'userOrders' => $userOrders
            ));
        } catch (Exception $e) {
            echo json_encode(array('success' => false, 'message' => '주문 내역을 불러오는 중 오류 발생: ' . $e->getMessage()));
        }
    } else if ($action === 'getUserOrders') {
        $startDate = $_REQUEST['startDate'] ?? null;
        $endDate = $_REQUEST['endDate'] ?? null;
        $userId = $_SESSION['cno'] ?? null;
    
        if ($startDate && $endDate && $userId) {
            try {
                $query = "
                    SELECT 
                        F.foodName AS FoodName,
                        C.orderDateTime AS OrderDateTime,
                        OD.quantity AS Quantity,
                        OD.totalPrice AS TotalPrice,
                        C.id AS OrderID
                    FROM 
                        OrderDetail OD
                    JOIN 
                        Food F ON OD.foodName = F.foodName
                    JOIN 
                        Cart C ON OD.id = C.id
                    JOIN 
                        Customer CU ON C.cno = CU.cno
                    WHERE 
                        CU.cno = :userId -- 특정 사용자의 ID를 지정
                        AND C.orderDateTime BETWEEN TO_DATE(:startDate, 'YYYY-MM-DD') AND TO_DATE(:endDate, 'YYYY-MM-DD') -- 날짜 범위 지정
                        AND TO_NUMBER(SUBSTR(C.id, 2)) < (
                            SELECT MAX(TO_NUMBER(SUBSTR(id, 2)))
                            FROM Cart
                            WHERE cno = :userId
                        ) -- 현재 장바구니 내역의 숫자 부분을 최대 값으로 비교하여 제외
                    ORDER BY 
                        C.orderDateTime DESC, OD.itemNo
                ";
    
                // 쿼리 준비 및 실행
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                $stmt->bindParam(':startDate', $startDate, PDO::PARAM_STR);
                $stmt->bindParam(':endDate', $endDate, PDO::PARAM_STR);
                $stmt->execute();
    
                // 결과를 배열로 가져오기
                $userOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                // 결과를 JSON으로 변환하여 응답
                echo json_encode([
                    'success' => true,
                    'data' => $userOrders
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'success' => false,
                    'message' => '주문 내역을 불러오는 중 오류 발생: ' . $e->getMessage()
                ]);
            }
        } else {
            echo json_encode([
                'success' => false,
                'message' => '유효한 시작 날짜, 종료 날짜, 또는 사용자가 필요합니다.'
            ]);
        }
    } else if ($action == 'getCategorySales') {
        // SQL문 1: 카테고리별 음식 총 판매량과 총 판매 금액을 계산하는 쿼리
        $query = '
            -- 카테고리별 음식 총 판매량과 총 판매 금액을 계산하는 쿼리
            SELECT 
                c.categoryName AS "Category",  -- Category 컬럼을 카테고리 이름으로 표시
                COUNT(od.foodName) AS "Total Sales",  -- 각 카테고리에서 판매된 음식의 총 수량을 계산하여 Total Sales 컬럼으로 표시
                SUM(od.totalPrice) AS "Total Revenue"  -- 각 카테고리에서 발생한 총 판매 금액을 계산하여 Total Revenue 컬럼으로 표시
            FROM 
                OrderDetail od  -- OrderDetail 테이블을 od 별칭으로 사용
                JOIN Contain ct ON od.foodName = ct.foodName  -- OrderDetail과 Contain 테이블을 foodName을 기준으로 조인
                JOIN Category c ON ct.categoryName = c.categoryName  -- Contain과 Category 테이블을 categoryName을 기준으로 조인
            GROUP BY ROLLUP(c.categoryName)  -- ROLLUP 함수를 사용하여 카테고리별로 그룹화하고, 총합계를 계산
            ORDER BY 
                "Total Sales" ASC,  -- 총 판매량을 기준으로 오름차순 정렬
                "Total Revenue" ASC  -- 총 판매 금액을 기준으로 오름차순 정렬
        ';

        try {
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $categorySales = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(array('success' => true, 'data' => $categorySales));
        } catch (PDOException $e) {
            echo json_encode(array('success' => false, 'message' => '쿼리 실행 실패: ' . $e->getMessage()));
        }
    } else if ($action == 'getCategorySalesRank') {
        // SQL문 2: 음식의 카테고리별 판매 순위를 계산하는 쿼리
        $query = '
            -- 음식의 카테고리별 판매 순위를 계산하는 쿼리
            SELECT 
                c.categoryName AS "Category",  -- Category 컬럼을 카테고리 이름으로 표시
                od.foodName AS "Food Name",  -- Food Name 컬럼을 음식 이름으로 표시
                SUM(od.totalPrice) AS "Total Revenue",  -- 각 음식의 총 판매 금액을 계산하여 Total Revenue 컬럼으로 표시
                RANK() OVER (PARTITION BY c.categoryName ORDER BY SUM(od.totalPrice) DESC) AS "Rank"  -- 카테고리별로 나누어 총 판매 금액 기준 내림차순으로 순위를 매겨 Rank 컬럼으로 표시
            FROM 
                OrderDetail od  -- OrderDetail 테이블을 od 별칭으로 사용
                JOIN Contain ct ON od.foodName = ct.foodName  -- OrderDetail과 Contain 테이블을 foodName을 기준으로 조인
                JOIN Category c ON ct.categoryName = c.categoryName  -- Contain과 Category 테이블을 categoryName을 기준으로 조인
            GROUP BY 
                c.categoryName, od.foodName  -- 카테고리와 음식별로 그룹화
            ORDER BY 
                c.categoryName, "Rank"  -- 결과를 카테고리와 순위별로 정렬
        ';

        try {
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $categorySalesRank = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(array('success' => true, 'data' => $categorySalesRank));
        } catch (PDOException $e) {
            echo json_encode(array('success' => false, 'message' => '쿼리 실행 실패: ' . $e->getMessage()));
        }
    } else if ($action == 'getMembers') {
        // 회원 정보 조회 쿼리
        $query = "
            SELECT 
                c.cno AS \"cno\",
                c.name AS \"name\",
                c.passwd AS \"passwd\",
                c.phoneno AS \"phoneno\"
            FROM 
                Customer c
            ORDER BY 
                c.cno ASC
        ";

        try {
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(array('success' => true, 'data' => $members));
        } catch (PDOException $e) {
            echo json_encode(array('success' => false, 'message' => '쿼리 실행 실패: ' . $e->getMessage()));
        }
    } else {
        echo json_encode(array('success' => false, 'message' => '유효하지 않은 action입니다.'));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';

    if ($action == 'updateCartItem') {
        $itemId = isset($_REQUEST['itemId']) ? $_REQUEST['itemId'] : null;
        $orderId = isset($_REQUEST['orderId']) ? $_REQUEST['orderId'] : null;
        $quantity = isset($_REQUEST['quantity']) ? $_REQUEST['quantity'] : null;
    
        if ($itemId && $quantity) {
            try {
                // 1. unitPrice를 가져오기 위해 foodName을 조회
                $query = '
                    SELECT F.price 
                    FROM OrderDetail OD
                    JOIN Food F ON OD.foodName = F.foodName
                    WHERE OD.itemNo = :itemId AND OD.id = :orderId
                ';
                
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':itemId', $itemId, PDO::PARAM_INT);
                $stmt->bindParam(':orderId', $orderId, PDO::PARAM_STR);
                $stmt->execute();
                $food = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$food) {
                    throw new Exception('해당 아이템을 찾을 수 없습니다.');
                }
    
                $unitPrice = $food['PRICE'];
                $totalPrice = $quantity * $unitPrice;
    
                // 2. quantity와 totalPrice를 업데이트
                $query = '
                    UPDATE OrderDetail
                    SET quantity = :quantity, totalPrice = :totalPrice
                    WHERE itemNo = :itemId AND id = :orderId
                ';
    
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
                $stmt->bindParam(':totalPrice', $totalPrice, PDO::PARAM_INT);
                $stmt->bindParam(':itemId', $itemId, PDO::PARAM_INT);
                $stmt->bindParam(':orderId', $orderId, PDO::PARAM_STR);
                $stmt->execute();
    
                echo json_encode(array('success' => true));
            } catch (Exception $e) {
                echo json_encode(array('success' => false, 'message' => '업데이트 중 오류 발생: ' . $e->getMessage()));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => '아이템 ID와 수량을 제공해야 합니다.'));
        }
    } elseif ($action == 'deleteCartItem') {
        $itemId = isset($_REQUEST['itemId']) ? $_REQUEST['itemId'] : null;
        $orderId = isset($_REQUEST['orderId']) ? $_REQUEST['orderId'] : null;
    
        if ($itemId && $orderId) {
            try {
                $query = 'DELETE FROM OrderDetail WHERE itemNo = :itemId AND id = :orderId';
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':itemId', $itemId, PDO::PARAM_INT);
                $stmt->bindParam(':orderId', $orderId, PDO::PARAM_STR);
                $stmt->execute();
    
                echo json_encode(array('success' => true));
            } catch (Exception $e) {
                echo json_encode(array('success' => false, 'message' => '삭제 중 오류 발생: ' . $e->getMessage()));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => '아이템 ID와 주문 ID를 제공해야 합니다.'));
        }
    } else if ($action == 'addToCart') {
        $userId = $_SESSION['cno'] ?? null;
        $foodName = $_REQUEST['foodName'] ?? null;
    
        if ($userId && $foodName) {
            try {
                // 음식 정보를 SQL로 가져오기
                $query = 'SELECT f.foodName, f.price, c.categoryName
                          FROM Food f
                          JOIN Contain c ON f.foodName = c.foodName
                          WHERE f.foodName = :foodName';
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':foodName', $foodName, PDO::PARAM_STR);
                $stmt->execute();
                $foodInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    
                if (!$foodInfo) {
                    throw new Exception('음식을 찾을 수 없습니다.');
                }
    
                // 사용자의 가장 최근 장바구니 찾기
                $query = 'SELECT id FROM Cart WHERE cno = :userId ORDER BY TO_NUMBER(SUBSTR(id, 2)) DESC FETCH FIRST 1 ROWS ONLY';
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                $stmt->execute();
                $cart = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$cart) {
                    throw new Exception('사용자의 장바구니를 찾을 수 없습니다.');
                }

                $orderId = $cart['ID'];
                
                // 해당 장바구니에 음식이 이미 있는지 확인
                $query = 'SELECT itemNo, quantity FROM OrderDetail WHERE id = :orderId AND foodName = :foodName';
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':orderId', $orderId, PDO::PARAM_STR);
                $stmt->bindParam(':foodName', $foodName, PDO::PARAM_STR);
                $stmt->execute();
                $existingItem = $stmt->fetch(PDO::FETCH_ASSOC);
                // echo json_encode(array('success' => true, 'message' => $existingItem));
    
                if ($existingItem) {
                    // 이미 존재하는 경우 수량 업데이트
                    $newQuantity = $existingItem['QUANTITY'] + 1;
                    $totalPrice = $newQuantity * $foodInfo['PRICE'];
    
                    $query = 'UPDATE OrderDetail 
                              SET quantity = :quantity, totalPrice = :totalPrice
                              WHERE id = :orderId AND foodName = :foodName';
                    $stmt = $conn->prepare($query);
                    $stmt->bindParam(':quantity', $newQuantity, PDO::PARAM_INT);
                    $stmt->bindParam(':totalPrice', $totalPrice, PDO::PARAM_INT);
                    $stmt->bindParam(':orderId', $orderId, PDO::PARAM_STR);
                    $stmt->bindParam(':foodName', $foodName, PDO::PARAM_STR);
                    $stmt->execute();
                } else {
                    // 새로운 항목 추가
                    $query = 'INSERT INTO OrderDetail (itemNo, id, quantity, totalPrice, foodName) 
                              VALUES ((SELECT COALESCE(MAX(itemNo), 0) + 1 FROM OrderDetail WHERE id = :orderId), 
                              :orderId, 1, :totalPrice, :foodName)';
                    $stmt = $conn->prepare($query);
                    $stmt->bindParam(':orderId', $orderId, PDO::PARAM_STR);
                    $stmt->bindParam(':totalPrice', $foodInfo['PRICE'], PDO::PARAM_INT);
                    $stmt->bindParam(':foodName', $foodName, PDO::PARAM_STR);
                    $stmt->execute();
                }
    
                // Cart 테이블의 orderDateTime을 현재 시간으로 업데이트
                $query = 'UPDATE Cart SET orderDateTime = SYSTIMESTAMP WHERE id = :orderId';
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':orderId', $orderId, PDO::PARAM_STR);
                $stmt->execute();
    
                echo json_encode(array('success' => true, 'message' => '장바구니에 항목이 추가되었습니다.'));
            } catch (Exception $e) {
                echo json_encode(array('success' => false, 'message' => '장바구니에 추가 중 오류 발생: ' . $e->getMessage()));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => '로그인되지 않았거나 유효하지 않은 데이터입니다.'));
        }
    } else if ($action == 'checkout') {
        $userId = $_SESSION['cno'] ?? null;

        if ($userId) {
            try {
                // 현재 시간
                $currentDateTime = date('Y-m-d H:i:s');

                // 사용자의 가장 최근 장바구니 찾기
                $query = 'SELECT id FROM Cart WHERE cno = :userId ORDER BY id DESC FETCH FIRST 1 ROWS ONLY';
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                $stmt->execute();
                $cart = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($cart) {
                    $orderId = $cart['ID'];

                    // 장바구니에 항목이 있는지 확인
                    $query = 'SELECT COUNT(*) AS itemCount FROM OrderDetail WHERE id = :orderId';
                    $stmt = $conn->prepare($query);
                    $stmt->bindParam(':orderId', $orderId, PDO::PARAM_STR);
                    $stmt->execute();
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    $itemCount = $result['ITEMCOUNT'];

                    if ($itemCount == 0) {
                        throw new Exception('장바구니에 담긴 물품이 없습니다.');
                    }

                    // 기존 장바구니의 orderDateTime을 결제된 시간으로 업데이트
                    $query = 'UPDATE Cart SET orderDateTime = :currentDateTime WHERE id = :orderId';
                    $stmt = $conn->prepare($query);
                    $stmt->bindParam(':currentDateTime', $currentDateTime, PDO::PARAM_STR);
                    $stmt->bindParam(':orderId', $orderId, PDO::PARAM_STR);
                    $stmt->execute();
                } else {
                    throw new Exception('사용자의 장바구니를 찾을 수 없습니다.');
                }

                // 현재 가장 큰 id의 숫자를 찾기
                $query = 'SELECT MAX(TO_NUMBER(SUBSTR(id, 2))) AS maxId FROM Cart';
                $stmt = $conn->prepare($query);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $maxId = $result['MAXID'];

                // 새로운 장바구니 ID 생성 (가장 높은 숫자 + 1)
                $newCartNumber = $maxId + 1;
                $newCartId = 'O' . str_pad($newCartNumber, 3, '0', STR_PAD_LEFT); // 3자리로 0 채움
                
                // echo json_encode(array('success' => true, 'message' => $userId));

                // 새로운 장바구니 생성
                $query = 'INSERT INTO Cart (id, orderDateTime, cno) VALUES (:id, :orderDateTime, :userId)';
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':id', $newCartId, PDO::PARAM_STR);
                $stmt->bindParam(':orderDateTime', $currentDateTime, PDO::PARAM_STR);
                $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                $stmt->execute();

                echo json_encode(array('success' => true, 'message' => '결제가 완료되고 새로운 장바구니가 생성되었습니다.'));
            } catch (Exception $e) {
                echo json_encode(array('success' => false, 'message' => '결제 처리 중 오류 발생: ' . $e->getMessage()));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => '로그인되지 않았거나 유효하지 않은 데이터입니다.'));
        }
    } else {
        echo json_encode(array('success' => false, 'message' => '유효하지 않은 action입니다.'));
    }
}

// 데이터베이스 연결 종료
$conn = null;
?>
