<?php
date_default_timezone_set('Asia/Seoul');
// 현재 PHP의 기본 시간대 확인
echo 'Current timezone: ' . date_default_timezone_get() . '<br>';

// 기본 시간대를 Asia/Seoul로 설정
date_default_timezone_set('Asia/Seoul');

// 현재 날짜와 시간 출력
echo 'Current date and time in Asia/Seoul timezone: ' . date('Y-m-d H:i:s') . '<br>';
?>
