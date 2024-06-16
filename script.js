$(document).ready(function() {
    const slogans = [
        "1분 전 *주문된 *🍲비빔밥 *어떠세요?",
        "2분 전 *주문된 *🍙김밥 *어떠세요?",
        "3분 전 *주문된 *🍜잔치국수 *어떠세요?",
        "4분 전 *주문된 *🌶️떡볶이 *어떠세요?",
        "5분 전 *주문된 *🍜칼국수 *어떠세요?",
        "6분 전 *주문된 *🍲순두부찌개 *어떠세요?",
        "7분 전 *주문된 *🍖갈비탕 *어떠세요?",
        "8분 전 *주문된 *🍲설렁탕 *어떠세요?",
        "9분 전 *주문된 *🍲꼬리곰탕 *어떠세요?",
        "10분 전 *주문된 *🥩육회 *어떠세요?",
        "11분 전 *주문된 *🥟만둣국 *어떠세요?",
        "12분 전 *주문된 *🥥콩국수 *어떠세요?",
        "13분 전 *주문된 *🥘두부전골 *어떠세요?",
        "14분 전 *주문된 *🥣순대국밥 *어떠세요?",
        "15분 전 *주문된 *🍜막국수 *어떠세요?",
        "16분 전 *주문된 *🍲갈치조림 *어떠세요?",
        "17분 전 *주문된 *🥩토마호크 *어떠세요?",
        "18분 전 *주문된 *🍝파스타 *어떠세요?",
        "19분 전 *주문된 *🧄알리오올리오 *어떠세요?",
        "20분 전 *주문된 *🍚필라프 *어떠세요?",
        "21분 전 *주문된 *🥘리조또 *어떠세요?",
        "22분 전 *주문된 *🍖포크스테이크 *어떠세요?",
        "23분 전 *주문된 *🍠뇨끼 *어떠세요?",
        "24분 전 *주문된 *🥗샐러드 *어떠세요?",
        "25분 전 *주문된 *🍅아라비아따 *어떠세요?",
        "26분 전 *주문된 *🍕칼조네 *어떠세요?",
        "27분 전 *주문된 *🥪샌드위치 *어떠세요?",
        "28분 전 *주문된 *🍔햄버거 *어떠세요?",
        "29분 전 *주문된 *🍕피자 *어떠세요?",
        "30분 전 *주문된 *🍖커틀릿 *어떠세요?",
        "31분 전 *주문된 *🍜짜장면 *어떠세요?",
        "32분 전 *주문된 *🍜짬뽕 *어떠세요?",
        "33분 전 *주문된 *🍖꿔바로우 *어떠세요?",
        "34분 전 *주문된 *🐔유린기 *어떠세요?",
        "35분 전 *주문된 *🥗양장피 *어떠세요?",
        "36분 전 *주문된 *🥘유산슬 *어떠세요?",
        "37분 전 *주문된 *🥘전가복 *어떠세요?",
        "38분 전 *주문된 *🦐깐쇼새우 *어떠세요?",
        "39분 전 *주문된 *🍲마파두부밥 *어떠세요?",
        "40분 전 *주문된 *🍜광동초면 *어떠세요?",
        "41분 전 *주문된 *🍖탕수육 *어떠세요?",
        "42분 전 *주문된 *🥘팔보채 *어떠세요?",
        "43분 전 *주문된 *🍗깐풍기 *어떠세요?",
        "44분 전 *주문된 *🍲마라탕 *어떠세요?",
        "45분 전 *주문된 *🍣사시미 *어떠세요?",
        "46분 전 *주문된 *🥘오코노미야끼 *어떠세요?",
        "47분 전 *주문된 *🍜야끼소바 *어떠세요?",
        "48분 전 *주문된 *🐙타코야끼 *어떠세요?",
        "49분 전 *주문된 *🍚텐동 *어떠세요?",
        "50분 전 *주문된 *🍤덴푸라 *어떠세요?",
        "51분 전 *주문된 *🥘스키야키 *어떠세요?",
        "52분 전 *주문된 *🍜우동 *어떠세요?",
        "53분 전 *주문된 *🐟명란구이 *어떠세요?",
        "54분 전 *주문된 *🍗가라아게 *어떠세요?",
        "55분 전 *주문된 *🍜라멘 *어떠세요?",
        "56분 전 *주문된 *🍣초밥 *어떠세요?",
        "57분 전 *주문된 *🍲나베 *어떠세요?",
        "58분 전 *주문된 *🍢야키토리 *어떠세요?",
        "59분 전 *주문된 *🍙오니기리 *어떠세요?",
        "60분 전 *주문된 *🥯베이글 *어떠세요?",
        "61분 전 *주문된 *🥐스콘 *어떠세요?",
        "62분 전 *주문된 *🍰케이크 *어떠세요?",
        "63분 전 *주문된 *🍰버터바 *어떠세요?",
        "64분 전 *주문된 *🍰카스텔라 *어떠세요?",
        "65분 전 *주문된 *🍬마카롱 *어떠세요?",
        "66분 전 *주문된 *🥖치아바타 *어떠세요?",
        "67분 전 *주문된 *🧁머핀 *어떠세요?",
        "68분 전 *주문된 *🥣요거트 *어떠세요?",
        "69분 전 *주문된 *🍮젤리 *어떠세요?",
        "70분 전 *주문된 *🍮푸딩 *어떠세요?",
        "71분 전 *주문된 *🍎과일칩 *어떠세요?",
        "72분 전 *주문된 *🍪쿠키 *어떠세요?",
        "73분 전 *주문된 *🍭캔디 *어떠세요?",
        "74분 전 *주문된 *🍫초콜릿 *어떠세요?",
        "75분 전 *주문된 *🌰알밤 *어떠세요?",
        "76분 전 *주문된 *🍨젤라또 *어떠세요?",
        "77분 전 *주문된 *🍰티라미수 *어떠세요?",
        "78분 전 *주문된 *🥧파이 *어떠세요?",
        "79분 전 *주문된 *🍧아포가토 *어떠세요?",
        "80분 전 *주문된 *🥯소금빵 *어떠세요?",
    ];

    const images = [
        "https://via.placeholder.com/150?text=Bibimbap", // 비빔밥
        "https://via.placeholder.com/150?text=Kimbap", // 김밥
        "https://via.placeholder.com/150?text=Janchi+Noodles", // 잔치국수
        "https://via.placeholder.com/150?text=Tteokbokki", // 떡볶이
        "https://via.placeholder.com/150?text=Kalguksu", // 칼국수
        "https://via.placeholder.com/150?text=Soondubu+Stew", // 순두부찌개
        "https://via.placeholder.com/150?text=Galbitang", // 갈비탕
        "https://via.placeholder.com/150?text=Seolleongtang", // 설렁탕
        "https://via.placeholder.com/150?text=Gori+Gomtang", // 꼬리곰탕
        "https://via.placeholder.com/150?text=Yukhoe", // 육회
        "https://via.placeholder.com/150?text=Mandu+Soup", // 만둣국
        "https://via.placeholder.com/150?text=Kongguksu", // 콩국수
        "https://via.placeholder.com/150?text=Tofu+Jeongol", // 두부전골
        "https://via.placeholder.com/150?text=Soondae+Soup", // 순대국밥
        "https://via.placeholder.com/150?text=Makguksu", // 막국수
        "https://via.placeholder.com/150?text=Galchi+Jorim", // 갈치조림
        "https://via.placeholder.com/150?text=Tomahawk+Steak", // 토마호크
        "https://via.placeholder.com/150?text=Pasta", // 파스타
        "https://via.placeholder.com/150?text=Aglio+Olio", // 알리오올리오
        "https://via.placeholder.com/150?text=Pilaf", // 필라프
        "https://via.placeholder.com/150?text=Risotto", // 리조또
        "https://via.placeholder.com/150?text=Pork+Steak", // 포크스테이크
        "https://via.placeholder.com/150?text=Gnocchi", // 뇨끼
        "https://via.placeholder.com/150?text=Salad", // 샐러드
        "https://via.placeholder.com/150?text=Arrabbiata", // 아라비아따
        "https://via.placeholder.com/150?text=Calzone", // 칼조네
        "https://via.placeholder.com/150?text=Sandwich", // 샌드위치
        "https://via.placeholder.com/150?text=Burger", // 햄버거
        "https://via.placeholder.com/150?text=Pizza", // 피자
        "https://via.placeholder.com/150?text=Cotoletta", // 커틀릿
        "https://via.placeholder.com/150?text=Jajangmyeon", // 짜장면
        "https://via.placeholder.com/150?text=Jjamppong", // 짬뽕
        "https://via.placeholder.com/150?text=Guobaorou", // 꿔바로우
        "https://via.placeholder.com/150?text=Yuringi", // 유린기
        "https://via.placeholder.com/150?text=Yangjangpi", // 양장피
        "https://via.placeholder.com/150?text=Yusanseul", // 유산슬
        "https://via.placeholder.com/150?text=Jeonggok", // 전가복
        "https://via.placeholder.com/150?text=Kkanpung+Shrimp", // 깐쇼새우
        "https://via.placeholder.com/150?text=Mapo+Tofu+Rice", // 마파두부밥
        "https://via.placeholder.com/150?text=Guangdong+Noodles", // 광동초면
        "https://via.placeholder.com/150?text=Sweet+and+Sour+Pork", // 탕수육
        "https://via.placeholder.com/150?text=Palbochae", // 팔보채
        "https://via.placeholder.com/150?text=Kkanpunggi", // 깐풍기
        "https://via.placeholder.com/150?text=Malatang", // 마라탕
        "https://via.placeholder.com/150?text=Sashimi", // 사시미
        "https://via.placeholder.com/150?text=Okonomiyaki", // 오코노미야끼
        "https://via.placeholder.com/150?text=Yakisoba", // 야끼소바
        "https://via.placeholder.com/150?text=Takoyaki", // 타코야끼
        "https://via.placeholder.com/150?text=Tendon", // 텐동
        "https://via.placeholder.com/150?text=Tempura", // 덴푸라
        "https://via.placeholder.com/150?text=Sukiyaki", // 스키야키
        "https://via.placeholder.com/150?text=Udon", // 우동
        "https://via.placeholder.com/150?text=Grilled+Mentai", // 명란구이
        "https://via.placeholder.com/150?text=Karaage", // 가라아게
        "https://via.placeholder.com/150?text=Ramen", // 라멘
        "https://via.placeholder.com/150?text=Sushi", // 초밥
        "https://via.placeholder.com/150?text=Nabe", // 나베
        "https://via.placeholder.com/150?text=Yakitori", // 야키토리
        "https://via.placeholder.com/150?text=Onigiri", // 오니기리
        "https://via.placeholder.com/150?text=Bagel", // 베이글
        "https://via.placeholder.com/150?text=Scone", // 스콘
        "https://via.placeholder.com/150?text=Cake", // 케이크
        "https://via.placeholder.com/150?text=Butter+Bar", // 버터바
        "https://via.placeholder.com/150?text=Castella", // 카스텔라
        "https://via.placeholder.com/150?text=Macaron", // 마카롱
        "https://via.placeholder.com/150?text=Ciabatta", // 치아바타
        "https://via.placeholder.com/150?text=Muffin", // 머핀
        "https://via.placeholder.com/150?text=Yogurt", // 요거트
        "https://via.placeholder.com/150?text=Jelly", // 젤리
        "https://via.placeholder.com/150?text=Pudding", // 푸딩
        "https://via.placeholder.com/150?text=Fruit+Chips", // 과일칩
        "https://via.placeholder.com/150?text=Cookie", // 쿠키
        "https://via.placeholder.com/150?text=Candy", // 캔디
        "https://via.placeholder.com/150?text=Chocolate", // 초콜릿
        "https://via.placeholder.com/150?text=Chestnut", // 알밤
        "https://via.placeholder.com/150?text=Gelato", // 젤라또
        "https://via.placeholder.com/150?text=Tiramisu", // 티라미수
        "https://via.placeholder.com/150?text=Pie", // 파이
        "https://via.placeholder.com/150?text=Affogato", // 아포가토
        "https://via.placeholder.com/150?text=Salted+Bread" // 소금빵
    ];    

    let currentIndex = 0;
    const $rotatingText = $('#rotating-text');
    const $rotatingImage = $('#rotating-image');

    function splitText(text) {
        // Properly handle text including emojis
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

        // Prepare the new text (rotated backwards)
        $newLetters.each((index, letter) => {
            $(letter).addClass('slogan-letter-animation-behind');
        });

        // Remove old text with cube effect
        $oldLetters.each((letterIndex, letter) => {
            setTimeout(() => {
                $(letter).addClass('slogan-letter-animation-out').removeClass('slogan-letter-animation-in');
            }, letterIndex * 50);
        });

        // Show new text with cube effect
        $newLetters.each((letterIndex, letter) => {
            setTimeout(() => {
                $(letter).removeClass('slogan-letter-animation-behind').addClass('slogan-letter-animation-in');
            }, letterIndex * 50 + 200); // Small delay to transition simultaneously with the old text
        });

        // Remove the old text after transition
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

        // Fade out the image
        $rotatingImage.css('opacity', 0);

        // Change the image and fade in
        setTimeout(() => {
            $rotatingImage.attr('src', images[newIndex]);
            $rotatingImage.css('opacity', 1);
        }, $currentText.find('.slogan-letter').length * 50);

        currentIndex = newIndex;
    }

    // Set initial text
    const initialText = updateText(currentIndex);
    $rotatingText.append(initialText);
    initialText.find('.slogan-letter').addClass('slogan-letter-animation-in');

    // Initialize image
    $rotatingImage.attr('src', images[currentIndex]);
    $rotatingImage.css('opacity', 1);

    // Update content every 10 seconds
    setInterval(rotateContent, 10000); // Update every 10 seconds

    // Apply hover effect to category buttons
    $('.category-button').each(function() {
        const imageUrl = $(this).data('image');
        if (imageUrl) {
            // 배경 이미지를 ::before에 적용
            $(this).css('position', 'relative');
            $(this).css('background-image', 'none'); // Remove background image from main button
            $(this).attr('style', `--background-image: ${imageUrl};`);
            $(this).find('::before').css('background-image', imageUrl);
            // Manually set background image for ::before
            $(this).css('position', 'relative');
            $(this).prepend(`<style>
                .category-button[data-image="${imageUrl}"]::before {
                    background-image: ${imageUrl};
                }
            </style>`);
        }
    });

    // Handle category button clicks
    $('.category-button').on('click', function() {
        const category = $(this).data('category'); // Get the category from the button's data attribute
        // Navigate to menu/index.html with the category as a query parameter
        window.location.href = `menu/index.html?category=${category}`;
    });
});
