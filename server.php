<?php
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
    } else {
        // action이 'getFilteredFood'가 아닐 경우
        echo json_encode(array('success' => false, 'message' => '유효하지 않은 action입니다.'));
    }
}

// 데이터베이스 연결 종료
$conn = null;
?>
