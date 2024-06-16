/* loading */
function startLoad() { $('.loading-page').addClass('show'); } // fade-in (로딩 시작시)
function endLoad() { $('.loading-page').removeClass('show'); } // fade-out (로딩 종료시)
$(document).ready(function() {
    startLoad();
    $(window).on('load', function() {
        endLoad();
    });

    // Handle login button click
    $('.to-login').on('click', function() {
        // Redirect to the login page
        window.location.href = 'login/index.html';
    });
});