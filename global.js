/* loading */
function startLoad() { $('.loading-page').addClass('show'); } // fade-in (로딩 시작시)
function endLoad() { $('.loading-page').removeClass('show'); } // fade-out (로딩 종료시)
$(document).ready(function() {
    startLoad();

    // 페이지 로딩 후 로그인 상태 확인
    checkLoginStatus();
    
    $(window).on('load', function() {
        endLoad();
    });

    // Handle login button click
    $('.to-login').on('click', function() {
        // Redirect to the login page
        const target = $(this).data('target');
        window.location.href = target;
    });
});



/* Toast Notification */
function showToast(message, duration = 3000, warning = false) {
    const toastContainer = document.getElementById('toast-container');
    const existingToasts = toastContainer.getElementsByClassName('custom-toast');

    // Move existing toasts upwards
    Array.from(existingToasts).forEach(toast => {
        toast.style.bottom = parseInt(toast.style.bottom) + 60 + 'px';
    });

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    toast.style.bottom = '20px'; // New toast appears at the bottom

    if(warning) toast.classList.add("warning-toast");

    toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add('custom-toast-show');
    }, 100);

    // Remove toast after duration
    setTimeout(() => {
        toast.classList.remove('custom-toast-show');
        setTimeout(() => toast.remove(), 500); // Match with animation time
    }, duration);

    
    if(warning) {
        setTimeout(() => {
            toast.classList.remove("warning-toast")
        }, duration + 500);
    }
}



/* 로그인 상태 관리 */
// 현재 페이지 경로와 script 경로 가져오기
const currentPath = window.location.pathname;
const scriptPath = document.currentScript.src;
const scriptDirectory = new URL(scriptPath).pathname.replace(/\/[^\/]*$/, '/');
const pageDirectory = currentPath.replace(/\/[^\/]*$/, '/');

// 페이지 디렉토리와 스크립트 디렉토리가 동일한지 여부를 판단
const isSameDirectory = scriptDirectory === pageDirectory;
const baseURL = isSameDirectory ? '' : '../';

const authURL = `${baseURL}login/auth.php`;
console.log(authURL);
// 로그인 상태 확인 함수
function checkLoginStatus() {
    $.ajax({
        url: authURL,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.logged_in) {
                // 로그인된 상태일 경우 내비게이션 아이템 수정
                let buttonsHtml = `
                    <div class="welcome-message">안녕하세요, ${response.name}님!</div>
                    <button class="scale-button" onclick="location.href='${baseURL}cart'">장바구니</button>
                    <button class="scale-button" onclick="location.href='${baseURL}orders'">주문내역</button>
                `;

                // cno가 C0인 경우 통계 정보 버튼 추가
                if (response.user === 'C0') {
                    buttonsHtml += `<button class="scale-button admin-button" onclick="location.href='${baseURL}statistics'">통계 정보</button>`;
                }

                // Logout 버튼은 항상 마지막에 추가
                buttonsHtml += `<button class="scale-button" onclick="logout()">Logout</button>`;

                $('#nav .nav-btns').html(buttonsHtml);
            }
        },
        error: function() {
            console.error('로그인 상태를 확인하는 중 오류가 발생했습니다.');
        }
    });
}


/* 로그아웃 함수 */
function logout() {
    if (window.confirm("로그아웃 하시겠습니까?")) {
        $.ajax({
            url: authURL,
            method: 'POST',
            data: { action: 'logout' },
            success: function(response) {
                location.reload(); // 로그아웃 후 페이지 새로고침
            },
            error: function() {
                console.error('로그아웃 중 오류가 발생했습니다.');
            }
        });
    }
}
