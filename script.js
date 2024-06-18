$(document).ready(function() {
    // 페이지 로드 시 최근 주문 내역을 가져와서 슬로건과 이미지 설정
    $.ajax({
        url: 'server.php',
        type: 'GET',
        data: { action: 'getRecentOrders' },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                // food_info.json 파일을 불러와 매핑 데이터 로드
                $.getJSON("src/food_info.json").done(function(foodInfo) {
                    // 대중의 주문 내역 슬로건 생성
                    const recentOrderSlogans = response.data.map(order => {
                        const hoursAgo = order.HOURSAGO;
                        const minutesAgo = order.MINUTESAGO;
                        const foodName = order.FOODNAME;

                        let timeAgoText = '';
                        if (hoursAgo > 0) {
                            timeAgoText = `${hoursAgo}시간 `;
                        }
                        timeAgoText += `${minutesAgo}분 전`;

                        const foodEmoji = foodInfo[foodName]?.emoji || '🍽️';
                        const foodEngName = foodInfo[foodName]?.eng || 'Food';

                        return {
                            text: `${timeAgoText} *주문된 *${foodEmoji}${foodName} *어떠세요?`,
                            image: `https://via.placeholder.com/150?text=${encodeURIComponent(foodEngName)}`
                        };
                    });

                    // 로그인한 사용자의 주문 내역 슬로건 생성
                    const userOrderSlogans = response.userOrders.map(order => {
                        const foodName = order.FOODNAME;
                        const foodEmoji = foodInfo[foodName]?.emoji || '🍽️';
                        const foodEngName = foodInfo[foodName]?.eng || 'Food';

                        return {
                            text: `지난번 주문하셨던 *${foodEmoji}${foodName} *어떠셨나요?`,
                            image: `https://via.placeholder.com/150?text=${encodeURIComponent(foodEngName)}`
                        };
                    });

                    // 슬로건 결합
                    const allSlogans = [...recentOrderSlogans, ...userOrderSlogans];
                    let currentIndex = Math.floor(Math.random() * allSlogans.length);
                    const $rotatingText = $('#rotating-text');
                    const $rotatingImage = $('#rotating-image');

                    function splitText(text) {
                        return Array.from(text).map(char => {
                            if (char === ' ') {
                                return `<span class="slogan-letter">&nbsp;</span>`;
                            }
                            return `<span class="slogan-letter">${char}</span>`;
                        }).join('');
                    }

                    function updateText(newIndex) {
                        const slogan = allSlogans[newIndex];
                        const words = slogan.text.split('*');
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

                        $newLetters.each((index, letter) => {
                            $(letter).addClass('slogan-letter-animation-behind');
                        });

                        $oldLetters.each((letterIndex, letter) => {
                            setTimeout(() => {
                                $(letter).addClass('slogan-letter-animation-out').removeClass('slogan-letter-animation-in');
                            }, letterIndex * 50);
                        });

                        $newLetters.each((letterIndex, letter) => {
                            setTimeout(() => {
                                $(letter).removeClass('slogan-letter-animation-behind').addClass('slogan-letter-animation-in');
                            }, letterIndex * 50 + 200);
                        });

                        setTimeout(() => {
                            oldText.remove();
                        }, $oldLetters.length * 50 + 500);

                        $rotatingText.append(newText);
                    }

                    function rotateContent() {
                        const $currentText = $rotatingText.children('.slogan-text');
                        const newIndex = Math.floor(Math.random() * allSlogans.length); // 슬로건을 랜덤으로 선택
                        const $newText = updateText(newIndex);

                        animateTextTransition($currentText, $newText);

                        // 이미지 업데이트
                        $rotatingImage.css('opacity', 0);
                        setTimeout(() => {
                            $rotatingImage.attr('src', allSlogans[newIndex].image);
                            $rotatingImage.css('opacity', 1);
                        }, $currentText.find('.slogan-letter').length * 50);

                        currentIndex = newIndex;
                    }

                    // 초기 텍스트 및 이미지 설정
                    if (allSlogans.length > 0) {
                        const initialText = updateText(currentIndex);
                        $rotatingText.append(initialText);
                        initialText.find('.slogan-letter').addClass('slogan-letter-animation-in');
                        $rotatingImage.attr('src', allSlogans[currentIndex].image).css('opacity', 1);
                    }

                    // 컨텐츠 10초마다 업데이트
                    setInterval(rotateContent, 10000); // 10초마다 업데이트

                }).fail(function() {
                    console.log('food_info.json을 불러오는 데 실패했습니다.');
                });
            } else {
                console.log('최근 주문 내역을 불러오는 데 실패했습니다.');
            }
        },
        error: function() {
            console.log('서버와의 통신 중 오류가 발생했습니다.');
        }
    });

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
