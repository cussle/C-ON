$(document).ready(function() {
    const slogans = [
        "10분 전 *주문된 *🍕피자 *어떠세요?",
        "어제 *주문하신 *🍔햄버거 *어떠셨나요?",
        "45분 전 *주문된 *🍣초밥 *어떠세요?",
    ];

    const images = [
        "https://via.placeholder.com/150?text=Pizza", // Replace with actual image links
        "https://via.placeholder.com/150?text=Burger", // Replace with actual image links
        "https://via.placeholder.com/150?text=초밥" // Replace with actual image links
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
});
