$(document).ready(function() {
    // 로그인 상태 확인
    $.ajax({
        url: authURL,
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (response.logged_in) {
                $('.to-login').off('click');
                $("#toCart").text("장바구니 담기");

                // "장바구니 담기" 버튼 클릭 이벤트
                $("#toCart").on("click", function() {
                    // 선택된 메뉴 항목의 정보를 가져옵니다.
                    const itemTitle = $("#menuDetailLabel").text(); // 메뉴의 제목(음식 이름)

                    // 서버로 장바구니 추가 요청을 보냅니다.
                    $.ajax({
                        url: '../server.php',
                        type: 'POST',
                        data: {
                            action: 'addToCart',
                            foodName: itemTitle
                        },
                        dataType: 'json',
                        success: function(response) {
                            console.log(response);
                            if (response.success) {
                                showToast('장바구니에 추가되었습니다.');
                            } else {
                                console.log(response.message);
                                showToast('장바구니에 추가하지 못했습니다: ' + response.message, 3000, true);
                            }
                        },
                        error: function() {
                            showToast('서버와의 통신 중 오류가 발생했습니다.', 3000, true);
                        }
                    });
                });
            }
        },
        error: function() {
            console.error("로그인 상태를 확인하는 중 오류가 발생했습니다.");
        }
    });

    // Function to create and append menu items to the search-results container
    function generateMenuItems(items) {
        const $container = $(".search-results .row");
        $container.empty(); // Clear existing content

        items.forEach(item => {
            // Create a div element for the menu item using jQuery
            const $itemDiv = $("<div>")
                .addClass("col-md-3 menu-item")
                .attr({
                    "data-id": item.id,
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#menuDetailModal"
                });

            // Create the card structure using jQuery
            const $card = $("<div>").addClass("card");
            const $img = $("<img>").addClass("card-img-top").attr({ "src": item.image, "alt": item.title });
            const $cardBody = $("<div>").addClass("card-body");
            const $title = $("<h5>").addClass("card-title").text(item.title);
            const $description = $("<p>").addClass("card-text").text(item.description);
            const $price = $("<p>").addClass("card-price").text(item.price);

            // Append the elements together to form the card
            $cardBody.append($title, $description, $price);
            $card.append($img, $cardBody);
            $itemDiv.append($card);

            // Append the item div to the container
            $container.append($itemDiv);
        });

        // Check if all images are loaded
        let imagesLoaded = 0;
        const totalImages = $("img").length;

        $("img").on("load", function() {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                // All images have loaded, hide the loading page
                endLoad();
            }
        }).each(function() {
            // For cached images, trigger the load event manually
            if (this.complete) {
                $(this).trigger("load");
            }
        });

        // Bind click event to newly created menu items to show details in the modal
        $(".menu-item").on("click", function() {
            const itemId = parseInt($(this).data("id"), 10);
            const item = items.find(menuItem => menuItem.id === itemId);

            if (item) {
                showMenuItemDetails(item);
            }
        });
    }

    // Function to populate the modal with the selected menu item details
    function showMenuItemDetails(item) {
        const $modalTitle = $("#menuDetailLabel");
        const $modalBody = $(".modal-body");

        $modalTitle.text(item.title);
        $modalBody.html(`
            <img src="${item.image}" class="img-fluid" alt="Menu Item Image">
            <p>${item.description}</p>
            <p><span>가격: </span>${item.price}</p>
        `);
    }

    $("#search-button").on("click", function() {
        startLoad();

        // Get search parameters
        const categoryEnglish = $("#category-select").val();
        const minPrice = $("#fromInput").val();
        const maxPrice = $("#toInput").val();
        const keyword = $("#search-keyword").val();

        // Define the category mapping from English to Korean
        const categoryMap = {
            "korean": "한식",
            "western": "양식",
            "chinese": "중식",
            "japanese": "일식",
            "dessert": "디저트",
            "all": "all" // For the "전체보기" option
        };

        // Convert the selected category to Korean
        const category = categoryMap[categoryEnglish] || "all";

        $.ajax({
            url: "../server.php",
            type: "GET",
            data: { 
                action: "getFilteredFood", 
                category: category,
                minPrice: minPrice,
                maxPrice: maxPrice,
                keyword: keyword
            },
            dataType: "json",
            success: function(response) {
                if (response.success) {
                    // Load the food_info.json file
                    $.getJSON("../src/food_info.json").done(function(foodInfo) {
                        // Map the response data to match the menuItems structure
                        const items = response.data.map((food, index) => ({
                            id: index + 1,
                            title: food.FOODNAME,
                            image: "https://via.placeholder.com/500?text=" + foodInfo[food.FOODNAME]["eng"], // Placeholder image
                            description: food.FOODNAME + " 설명입니다.", // Placeholder description
                            price: Number(food.PRICE).toLocaleString() + "원"
                        }));
    
                        // Generate and display the menu items
                        generateMenuItems(items);

                        // Check if there are no images to load
                        if ($("img").length === 0) {
                            endLoad();
                        }

                        if (items.length == 0) {
                            showToast("검색 조건에 부합하는 음식이 없습니다.");
                        }
                    })
                } else {
                    showToast("데이터를 불러오는 데 실패했습니다: " + response.message, 3000, true);
                    endLoad();
                }
            },
            error: function() {
                showToast("서버와의 통신 중 오류가 발생했습니다.", 3000, true);
                endLoad();
            }
        });
    });

    // URL의 "login" 파라미터를 확인하여 메뉴 제시
    const urlParams = new URLSearchParams(window.location.search);
    $("#category-select").val(urlParams.get("category"));
    $("#search-button").click();
});

