$(document).ready(function() {
    const slogans = [
        "10분 전 *주문된 *🍕피자 *어떠세요?",
        "어제 *주문하신 *🍔햄버거 *어떠셨나요?",
        "45분 전 *주문된 *🍣초밥 *어떠세요?",
    ];

    const images = [
        "https://via.placeholder.com/100?text=Pizza", // 대체 가능한 이미지 링크
        "https://via.placeholder.com/100?text=Burger", // 대체 가능한 이미지 링크
        "https://via.placeholder.com/100?text=초밥" // 대체 가능한 이미지 링크
    ];

    let currentIndex = 0;
    const $rotatingText = $('#rotating-text');
    const $rotatingImage = $('#rotating-image');

    function splitText(text) {
        // 이모지를 포함한 텍스트를 올바르게 처리
        return Array.from(text).map(char => {
            if (char === ' ') {
                return `<span class="slogan-letter">&nbsp;</span>`;
            }
            return `<span class="slogan-letter">${char}</span>`;
        }).join('');
    }

    function updateText(newIndex) {
        const words = slogans[newIndex].split('*');
        const $newText = $('<div class="slogan-text"></div>');

        words.forEach((word) => {
            const wordElement = $(`<span class="slogan-word">${splitText(word)}</span>`);
            $newText.append(wordElement).append(' ');
        });

        return $newText;
    }

    function animateTextTransition(oldText, newText) {
        const $oldLetters = oldText.find('.slogan-letter');
        const $newLetters = newText.find('.slogan-letter');

        // 새로운 텍스트 준비 (뒤로 회전된 상태)
        $newLetters.each((index, letter) => {
            $(letter).addClass('slogan-letter-animation-behind');
        });

        // 기존 텍스트를 큐브 효과로 사라지게 함
        $oldLetters.each((letterIndex, letter) => {
            setTimeout(() => {
                $(letter).addClass('slogan-letter-animation-out').removeClass('slogan-letter-animation-in');
            }, letterIndex * 50);
        });

        // 새로운 텍스트를 큐브 효과로 나타나게 함
        $newLetters.each((letterIndex, letter) => {
            setTimeout(() => {
                $(letter).removeClass('slogan-letter-animation-behind').addClass('slogan-letter-animation-in');
            }, letterIndex * 50 + 200); // 약간의 지연을 두어 기존 텍스트와 동시에 전환
        });

        // 일정 시간 후 기존 텍스트 제거하고 새로운 텍스트를 유지
        setTimeout(() => {
            oldText.remove();
        }, $oldLetters.length * 50 + 500);

        $rotatingText.append(newText);
    }

    function rotateContent() {
        const $currentText = $rotatingText.children('.slogan-text');
        const newIndex = (currentIndex + 1) % slogans.length;
        const $newText = updateText(newIndex);

        animateTextTransition($currentText, $newText);

        // 이미지 페이드 아웃
        $rotatingImage.css('opacity', 0);

        // 이미지 전환 후 페이드 인
        setTimeout(() => {
            $rotatingImage.attr('src', images[newIndex]);
            $rotatingImage.css('opacity', 1);
        }, $currentText.find('.slogan-letter').length * 50);

        currentIndex = newIndex;
    }

    // 초기 텍스트 설정
    const initialText = updateText(currentIndex);
    $rotatingText.append(initialText);
    initialText.find('.slogan-letter').addClass('slogan-letter-animation-in');

    // 이미지 초기화
    $rotatingImage.attr('src', images[currentIndex]);
    $rotatingImage.css('opacity', 1);

    // 10초마다 콘텐츠 업데이트
    setInterval(rotateContent, 10000); // 10초마다 업데이트
});
