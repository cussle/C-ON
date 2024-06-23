$(document).ready(function() {
    // 로그인된 사용자만 접근 가능
    $.ajax({
        url: '../login/auth.php',
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (!response.logged_in) {
                window.location.href = "../login";
            }
        },
        error: function() {
            console.error("로그인 상태를 확인하는 중 오류가 발생했습니다.");
        }
    });



    // Function to set default dates
    function setDefaultDates() {
        const today = new Date();
        const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // 오늘 날짜에 하루를 더하여 내일 날짜 설정

        // Helper function to format the date in 'YYYY-MM-DD' format
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        $('#start-date').val(formatDate(lastYear));
        $('#end-date').val(formatDate(tomorrow));
    }



    // Function to fetch and display order history based on date filters
    function fetchOrderHistory() {
        const startDate = $('#start-date').val();
        const endDate = $('#end-date').val();

        // 날짜 입력 값이 없을 때 경고 출력
        if (!startDate || !endDate) {
            showToast("시작 날짜와 종료 날짜를 모두 입력하세요.", 3000, true);
            return; // 함수 종료
        }

        // AJAX 요청으로 주문 내역 가져오기
        $.ajax({
            url: '../server.php',
            method: 'GET',
            data: {
                action: 'getUserOrders',
                startDate: startDate,
                endDate: endDate
            },
            dataType: 'json',
            success: function(response) {
                // 주문 내역 리스트 초기화
                $('#orderHistoryList').empty();
                console.log(response);
                if (response.success && response.data.length > 0) {
                    // 주문 데이터를 orderID로 그룹화
                    const ordersById = response.data.reduce((acc, order) => {
                        if (!acc[order.ORDERID]) {
                            acc[order.ORDERID] = {
                                orderID: order.ORDERID,
                                orderDate: order.ORDERDATETIME,
                                totalPrice: 0,
                                items: []
                            };
                        }
                        acc[order.ORDERID].items.push(order);
                        acc[order.ORDERID].totalPrice += parseFloat(order.TOTALPRICE);
                        return acc;
                    }, {});

                    // Group order items into rows with three items each
                    const $orderHistoryList = $('#orderHistoryList');
                    const $orderGroupWrapper = $('<div>').addClass('order-group-wrapper');

                    // 그룹화된 주문들을 반복 처리하여 표시
                    Object.values(ordersById).forEach((orderGroup, index) => {
                        const $orderGroupDiv = $('<div>').addClass('order-group mb-4 p-3 border rounded bg-light');

                        // 주문 날짜를 제목처럼 표시하고 구분선 추가
                        const $orderDateTitle = $('<div>').addClass('order-date').text(orderGroup.orderDate.split(".")[0]);
                        $orderGroupDiv.append($orderDateTitle);

                        // 주문에 포함된 음식 목록 표시
                        orderGroup.items.forEach(orderItem => {
                            const $foodItemDiv = $('<div>').addClass('food-item');

                            // 음식명, 수량 및 가격 표시
                            const $foodName = $('<span>').addClass('food-name').text(orderItem.FOODNAME);
                            const $symbol = $('<span>').addClass('symbol').text('*');
                            const $quantity = $('<span>').addClass('quantity').text(`${orderItem.QUANTITY}개`);
                            const $equals = $('<span>').addClass('symbol').text('=');
                            const $totalPrice = $('<span>').addClass('price').text(`${(parseFloat(orderItem.TOTALPRICE)).toLocaleString()}원`);

                            $foodItemDiv.append($foodName);
                            $foodItemDiv.append($symbol); // Add the * symbol
                            $foodItemDiv.append($quantity);
                            $foodItemDiv.append($equals); // Add the = symbol
                            $foodItemDiv.append($totalPrice);

                            $orderGroupDiv.append($foodItemDiv);
                        });

                        // 총 결제 금액 표시
                        const $summaryDiv = $('<div>').addClass('summary');
                        const $totalPrice = $('<span>').addClass('text-muted').text(`${orderGroup.totalPrice.toLocaleString()}원`);
                        $summaryDiv.append($totalPrice);

                        $orderGroupDiv.append($summaryDiv);

                        // Add the order group to the wrapper
                        $orderGroupWrapper.append($orderGroupDiv);
                    });

                    // Append the order group wrapper to the list
                    $orderHistoryList.append($orderGroupWrapper);
                } else {
                    const $message = $('<p>')
                    .addClass('text-muted fs-4 mb-0 text-center p-4') // Styling classes
                    .text('선택된 날짜 범위 내에 주문 기록이 없어요🥲');
                
                    // Create a container div for the message and use Bootstrap classes to center it
                    const $centeredContainer = $('<div>')
                        .addClass('d-flex justify-content-center align-items-center w-100 h-100') // Centering classes
                        .css({
                            'min-height': '200px', // Ensuring it has enough height for centering
                        })
                        .append($message); // Append the message to this container
                    
                    // Append the centered container to the orderHistoryList
                    $('#orderHistoryList').append($centeredContainer);
                }
            },
            error: function(error) {
                console.error('Error fetching order history:', error);
            }
        });

        showToast("주문내역을 불러왔습니다.");
    }



    // Attach event handler to the search button
    $('#search-button').on('click', function() {
        fetchOrderHistory();
    });



    // Set default dates when the page loads
    setDefaultDates();
    // Initial fetch of order history on page load
    fetchOrderHistory();
});
