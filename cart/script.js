$(document).ready(function() {
    // 로그인된 사용자만 접근 가능
    $.ajax({
        url: '../login/auth.php',
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (! response.logged_in) {
                window.location.href = "../login";
            }
        },
        error: function() {
            console.error("로그인 상태를 확인하는 중 오류가 발생했습니다.");
        }
    });

    // 페이지 로드 시 장바구니 데이터 로드
    function loadCartData() {
        startLoad();

        $.ajax({
            url: '../server.php',
            type: 'GET',
            data: { action: 'getCart' },
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if (response.success) {
                    renderCartItems(response.data);
                    updateCartSummary(response.data);
                } else {
                    console.log(response.message);
                    showToast('장바구니 데이터를 불러오는 데 실패했습니다.', 3000, true);
                }
                endLoad();
            },
            error: function(response) {
                console.log(response.message);
                showToast('서버와의 통신 중 오류가 발생했습니다.', 3000, true);
                endLoad();
            }
        });
    }

    // 장바구니 항목을 렌더링
    function renderCartItems(items) {
        const $container = $('#cart-items');
        $container.empty(); // 기존 장바구니 항목을 비움

        if (items.length == 0) {
            // 장바구니에 항목이 없을 때의 처리
            const $emptyMessage = $('<div>').addClass('col-12 text-center mt-5');

            const $messageHeader = $('<p>').addClass('fw-bold fs-4 mb-2').text('장바구니에 담긴 메뉴가 없어요.');
            const $messageText = $('<p>').addClass('text-muted mt-4 mb-0');

            const $link = $('<a>')
                .attr('href', '../menu')
                .addClass('fw-bold text-decoration-none')
                .text('여기');

            $messageText.append(' ').append($link).append('를 눌러 메뉴를 구경해보세요 😶');

            $emptyMessage.append($messageHeader, $messageText);
            $container.append($emptyMessage);
        } else {
            items.forEach(item => {
                const $itemDiv = $('<div>').addClass('col-12 mb-3');

                $.getJSON("../src/food_info.json").done(function(foodInfo) {
                    const $card = $('<div>').addClass('card p-3');
                    const $row = $('<div>').addClass('row align-items-center');

                    const $imgCol = $('<div>').addClass('col-12 col-md-2 text-center mb-3 mb-md-0');
                    const $img = $('<img>').addClass('img-fluid').attr({ "src": "https://via.placeholder.com/150?text=" + foodInfo[item.FOODNAME]["eng"], "alt": "Food Image" });
                    $imgCol.append($img);

                    const $infoCol = $('<div>').addClass('col-12 col-md-2 text-center text-md-start mb-3 mb-md-0');
                    const $foodName = $('<p>').addClass('mb-1').text(item.FOODNAME);
                    const $categoryName = $('<p>').addClass('text-muted mb-0').text(item.CATEGORYNAMES);
                    $infoCol.append($foodName, $categoryName);

                    const $priceCol = $('<div>').addClass('col-12 col-md-2 text-center text-md-start mb-3 mb-md-0');
                    const $price = $('<p>').addClass('mb-1').text('₩' + Number(item.UNITPRICE).toLocaleString());
                    const $priceLabel = $('<p>').addClass('text-muted mb-0').text('개당 가격');
                    $priceCol.append($price, $priceLabel);

                    const $quantityCol = $('<div>').addClass('col-12 col-md-2 text-center text-md-start mb-3 mb-md-0');
                    const $quantityInput = $('<input>').addClass('form-control').attr({ "type": "number", "value": item.QUANTITY, "min": "1", "data-item-no": item.ITEMNO, "data-order-id": item.ORDERID });
                    $quantityCol.append($quantityInput);

                    const $updateCol = $('<div>').addClass('col-12 col-md-1 text-center text-md-start mb-3 mb-md-0');
                    const $updateButton = $('<button>').addClass('btn btn-primary').text('변경').attr({ "data-item-no": item.ITEMNO, "data-order-id": item.ORDERID });
                    $updateCol.append($updateButton);

                    const $totalCol = $('<div>').addClass('col-12 col-md-2 text-center text-md-start mb-3 mb-md-0');
                    const $totalPrice = $('<p>').addClass('mb-1').text('₩' + (Number(item.TOTALPRICE)).toLocaleString());
                    const $totalPriceLabel = $('<p>').addClass('text-muted mb-0').text('음식 당 가격');
                    $totalCol.append($totalPrice, $totalPriceLabel);

                    const $deleteCol = $('<div>').addClass('col-12 col-md-1 text-center text-md-end mb-3 mb-md-0');
                    const $deleteButton = $('<button>').addClass('btn btn-danger').text('삭제').attr({ "data-item-no": item.ITEMNO, "data-order-id": item.ORDERID });
                    $deleteCol.append($deleteButton);

                    $row.append($imgCol, $infoCol, $priceCol, $quantityCol, $updateCol, $totalCol, $deleteCol);
                    $card.append($row);
                    $itemDiv.append($card);

                    $container.append($itemDiv);
                });
            });

            // 이벤트 델리게이션으로 버튼 클릭 핸들링
            $container.off('click', '.btn-primary').on('click', '.btn-primary', function() {
                const itemNo = $(this).attr('data-item-no');
                const orderId = $(this).attr('data-order-id');
                const newQuantity = $(`input[data-item-no=${itemNo}][data-order-id=${orderId}]`).val();
                updateItemQuantity(itemNo, orderId, newQuantity);
            });

            $container.off('click', '.btn-danger').on('click', '.btn-danger', function() {
                const itemNo = $(this).attr('data-item-no');
                const orderId = $(this).attr('data-order-id');
                deleteCartItem(itemNo, orderId);
            });
        }
    }

    // 장바구니 요약 업데이트
    function updateCartSummary(items) {
        let totalItems = 0;
        let totalPrice = 0;

        items.forEach(item => {
            totalItems += parseInt(item.QUANTITY, 10);
            totalPrice += item.UNITPRICE * item.QUANTITY;
        });

        $('#total-items').text(totalItems);
        $('#total-price').text(totalPrice.toLocaleString()); // 숫자를 천 단위로 구분
    }

    // 장바구니 아이템 수량 업데이트
    function updateItemQuantity(itemNo, orderId, newQuantity) {
        startLoad();

        $.ajax({
            url: '../server.php',
            type: 'POST',
            data: { action: 'updateCartItem', itemId: Number(itemNo), orderId: orderId, quantity: Number(newQuantity) },
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if (response.success) {
                    loadCartData(); // 데이터 다시 로드
                    showToast('수량을 변경했습니다.');
                } else {
                    showToast('수량 변경에 실패했습니다.', 3000, true);
                }
                endLoad();
            },
            error: function() {
                showToast('[수량 변경] 서버와의 통신 중 오류가 발생했습니다.', 3000, true);
                endLoad();
            }
        });
    }

    // 장바구니 아이템 삭제
    function deleteCartItem(itemNo, orderId) {
        startLoad();

        $.ajax({
            url: '../server.php',
            type: 'POST',
            data: { action: 'deleteCartItem', itemId: Number(itemNo), orderId: orderId },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    loadCartData(); // 데이터 다시 로드
                    showToast('메뉴를 삭제했습니다.');
                } else {
                    showToast('아이템 삭제에 실패했습니다.', 3000, true);
                }
                endLoad();
            },
            error: function() {
                showToast('서버와의 통신 중 오류가 발생했습니다.', 3000, true);
                endLoad();
            }
        });
    }

    // 결제하기 버튼 클릭 핸들러
    $('#checkout-button').on('click', function() {
        startLoad();

        $.ajax({
            url: '../server.php',
            type: 'POST',
            data: { action: 'checkout' },
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if (response.success) {
                    showToast('결제가 완료되었습니다. 새로운 장바구니가 생성되었습니다.');
                    loadCartData(); // 새로운 장바구니 데이터를 로드
                } else {
                    showToast(response.message, 3000, true);
                }
                endLoad();
            },
            error: function() {
                showToast('서버와의 통신 중 오류가 발생했습니다.', 3000, true);
                endLoad();
            }
        });
    });

    // 장바구니 데이터 로드
    loadCartData();
});
