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
        // 최종 합계 제외
        const filteredData = data.filter(row => row.Category !== null);

        // Extract categories, sales and revenue for the chart
        const categories = filteredData.map(row => row.Category);
        const totalSales = filteredData.map(row => row["Total Sales"]);
        const totalRevenue = filteredData.map(row => row["Total Revenue"]);

        // 총 판매 금액 합계 계산
        const totalRevenueSum = data.find(item => item.Category === null)["Total Revenue"];

        // Create the chart using Chart.js
        const ctx = document.getElementById('salesRevenueChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [
                    {
                        label: '총 판매 금액 (원)',
                        type: 'bar',
                        data: totalRevenue,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1'
                    },
                    {
                        label: '총 판매량',
                        type: 'line',
                        data: totalSales,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false,
                        yAxisID: 'y2'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y1: {
                        type: 'linear',
                        position: 'left',
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + ' 원';
                            }
                        },
                        title: {
                            display: true,
                            text: '총 판매 금액'
                        }
                    },
                    y2: {
                        type: 'linear',
                        position: 'right',
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' 개';
                            }
                        },
                        title: {
                            display: true,
                            text: '총 판매량'
                        }
                    }
                }
            }
        });

        // Display the total revenue sum as text
        $('#total-revenue-summary').text(`총 판매 금액 합계: ${Number(totalRevenueSum).toLocaleString()} 원`);
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
        // Chart.js 사용을 위한 컨텍스트 가져오기
        const ctx = document.getElementById('salesRankChart').getContext('2d');
    
        // 데이터 처리
        const categories = data.map(item => item.Category);
        const foodNames = data.map(item => item["Food Name"]);
        const revenues = data.map(item => item["Total Revenue"]);
        const ranks = data.map(item => item.Rank);
    
        // 차트의 높이를 데이터 항목 수에 따라 동적으로 설정
        const chartHeight = foodNames.length * 20; // 항목당 높이 설정 (예: 40px)
    
        // Canvas의 높이 설정
        document.getElementById('salesRankChart').height = chartHeight;
    
        // 차트 생성
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: foodNames,
                datasets: [{
                    label: '총 판매 금액 (원)',
                    data: revenues,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // 수평 막대 차트로 설정
                maintainAspectRatio: false, // 높이와 너비 비율 유지하지 않음
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '총 판매 금액 (원)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '음식 이름'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${Number(tooltipItem.raw).toLocaleString()}원`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Show error messages
    function showError(containerId, message) {
        const $container = $(`#${containerId}`);
        $container.empty();
        $container.append(`<p class="text-danger">오류 발생: ${message}</p>`);
    }
});
