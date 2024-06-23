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

            // cno가 C0인 경우 통계 정보 버튼 추가
            if (response.user === 'C0') {
                fetchMemberInfo();
                fetchStatistics();
            } else {
                showToast("인가되지 않은 사용자입니다.", 24*60*60*1000, true);
            }
        },
        error: function() {
            console.error("로그인 상태를 확인하는 중 오류가 발생했습니다.");
        }
    });

    // Function to fetch member information
    function fetchMemberInfo() {
        $.ajax({
            url: '../server.php',
            method: 'GET',
            data: {
                action: 'getMembers'
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    displayMemberInfo(response.data);
                } else {
                    showError('member-info', response.message);
                }
            },
            error: function(error) {
                console.error('Error fetching member info:', error);
            }
        });
    }

    // Function to display member information
    function displayMemberInfo(members) {
        const $memberInfo = $('#member-info');
        $memberInfo.empty(); // Clear existing content

        if (members.length === 0) {
            $memberInfo.append('<p class="text-muted">회원 정보가 없습니다.</p>');
            return;
        }

        const $table = $('<table>').addClass('table table-striped');
        $table.append(`
            <thead>
                <tr>
                    <th>회원번호</th>
                    <th>이름</th>
                    <th>비밀번호</th>
                    <th>전화번호</th>
                </tr>
            </thead>
            <tbody>
        `);

        members.forEach(member => {
            const $tr = $('<tr>');
            $tr.append(`<td>${member.cno}</td>`);
            $tr.append(`<td>${member.name}</td>`);
            $tr.append(`<td>${member.passwd}</td>`);
            $tr.append(`<td>${member.phoneno}</td>`);
            $table.append($tr);
        });

        $table.append('</tbody>');
        $memberInfo.append($table);
    }

    // Function to fetch and display statistics data
    function fetchStatistics() {
        fetchTotalSalesRevenue();
        fetchCategorySalesRank();
    }

    // Fetch category sales and revenue
    function fetchTotalSalesRevenue() {
        $.ajax({
            url: '../server.php',
            method: 'GET',
            data: {
                action: 'getCategorySales'
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    displayTotalSalesRevenue(response.data);
                } else {
                    showError('total-sales-revenue', response.message);
                }
            },
            error: function(error) {
                console.error('Error fetching total sales and revenue:', error);
            }
        });
    }

    // Display total sales and revenue
    function displayTotalSalesRevenue(data) {
        const $totalSalesRevenue = $('#total-sales-revenue');
        $totalSalesRevenue.empty(); // Clear existing content

        if (data.length === 0) {
            $totalSalesRevenue.append('<p class="text-muted">데이터가 없습니다.</p>');
            return;
        }

        const $table = $('<table>').addClass('table table-striped');
        $table.append(`
            <thead>
                <tr>
                    <th>카테고리</th>
                    <th>총 판매량</th>
                    <th>총 판매 금액</th>
                </tr>
            </thead>
            <tbody>
        `);

        data.forEach(row => {
            const $tr = $('<tr>');
            $tr.append(`<td>${row.Category ?? "합계"}</td>`);
            $tr.append(`<td>${row["Total Sales"]}</td>`);
            $tr.append(`<td>${Number(row["Total Revenue"]).toLocaleString() + '원'}</td>`);
            $table.append($tr);
        });

        $table.append('</tbody>');
        $totalSalesRevenue.append($table);
    }

    // Fetch category sales rank
    function fetchCategorySalesRank() {
        $.ajax({
            url: '../server.php',
            method: 'GET',
            data: {
                action: 'getCategorySalesRank'
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    displayCategorySalesRank(response.data);
                } else {
                    showError('category-sales-rank', response.message);
                }
            },
            error: function(error) {
                console.error('Error fetching category sales rank:', error);
            }
        });
    }

    // Display category sales rank
    function displayCategorySalesRank(data) {
        const $categorySalesRank = $('#category-sales-rank');
        $categorySalesRank.empty(); // Clear existing content

        if (data.length === 0) {
            $categorySalesRank.append('<p class="text-muted">데이터가 없습니다.</p>');
            return;
        }

        const $table = $('<table>').addClass('table table-striped');
        $table.append(`
            <thead>
                <tr>
                    <th>카테고리</th>
                    <th>음식 이름</th>
                    <th>총 판매 금액</th>
                    <th>순위</th>
                </tr>
            </thead>
            <tbody>
        `);

        data.forEach(row => {
            const $tr = $('<tr>');
            $tr.append(`<td>${row.Category}</td>`);
            $tr.append(`<td>${row["Food Name"]}</td>`);
            $tr.append(`<td>${Number(row["Total Revenue"]).toLocaleString() + '원'}</td>`);
            $tr.append(`<td>${row.Rank}</td>`);
            $table.append($tr);
        });

        $table.append('</tbody>');
        $categorySalesRank.append($table);
    }

    // Show error messages
    function showError(containerId, message) {
        const $container = $(`#${containerId}`);
        $container.empty();
        $container.append(`<p class="text-danger">오류 발생: ${message}</p>`);
    }
});
