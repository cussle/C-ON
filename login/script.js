$(document).ready(function() {
    // URL의 'login' 파라미터를 확인하여 실패 메시지를 표시
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'failed') {
        showToast("로그인 실패: 사용자 이름 또는 비밀번호가 잘못되었습니다.", 3000, true);
    }

    $('#login-form').submit(function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 막음

        let formData = {
            action: 'login',
            cno: $('#cno').val(),
            passwd: $('#passwd').val()
        };

        $.ajax({
            url: 'auth.php', // 로그인 요청을 보낼 PHP 파일
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    window.location.href = '../index.html'; // 로그인 성공 시 메인 페이지로 이동
                } else {
                    showToast("로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.", 3000, true); // 로그인 실패 시 토스트 메시지 표시
                }
            },
            error: function() {
                showToast('서버와의 통신 중 오류가 발생했습니다.', 3000, true); // 통신 오류 발생 시 토스트 메시지 표시
            }
        });
    });
});
