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

// 로그인 및 로그아웃 처리
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if ($action === 'login') {
        // 로그인 처리
        $cno = trim($_POST['cno']);
        $passwd = trim($_POST['passwd']);

        if (empty($cno) || empty($passwd)) {
            die(json_encode(array('success' => false, 'message' => '아이디 또는 비밀번호가 입력되지 않았습니다.')));
        }

        $sql = "SELECT * FROM Customer WHERE cno = :cno AND passwd = :passwd";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cno', $cno, PDO::PARAM_STR);
        $stmt->bindParam(':passwd', $passwd, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $_SESSION['cno'] = $cno;
            $_SESSION['name'] = $user['NAME']; // 사용자의 이름을 세션에 저장
            echo json_encode(array('success' => true, 'message' => '로그인 성공'));
        } else {
            echo json_encode(array('success' => false, 'message' => '로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.'));
        }
    } elseif ($action === 'logout') {
        // 로그아웃 처리
        session_unset();
        session_destroy();
        echo json_encode(array('success' => true, 'message' => '로그아웃 성공'));
    } else {
        echo json_encode(array('success' => false, 'message' => '잘못된 요청입니다.'));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 로그인 상태 확인
    $response = array();
    if (isset($_SESSION['cno'])) {
        $response['logged_in'] = true;
        $response['user'] = $_SESSION['cno'];
        $response['name'] = $_SESSION['name']; // 세션에서 사용자 이름을 가져와 반환
    } else {
        $response['logged_in'] = false;
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

// 데이터베이스 연결 종료
$conn = null;
?>
