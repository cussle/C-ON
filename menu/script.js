$(document).ready(function() {
    // Sample data for menu items
    const menuItems = [
        { id: 1, title: 'Sample Menu Item 1', image: 'https://picsum.photos/200/150?random=1', description: 'Detailed description of the menu item 1.', price: '₩10,000' },
        { id: 2, title: 'Sample Menu Item 2', image: 'https://picsum.photos/200/150?random=2', description: 'Detailed description of the menu item 2.', price: '₩15,000' },
        { id: 3, title: 'Sample Menu Item 3', image: 'https://picsum.photos/200/150?random=3', description: 'Detailed description of the menu item 3.', price: '₩20,000' },
        { id: 4, title: 'Sample Menu Item 4', image: 'https://picsum.photos/200/150?random=4', description: 'Detailed description of the menu item 4.', price: '₩12,000' },
        { id: 5, title: 'Sample Menu Item 5', image: 'https://picsum.photos/200/150?random=5', description: 'Detailed description of the menu item 5.', price: '₩9,000' },
        { id: 6, title: 'Sample Menu Item 6', image: 'https://picsum.photos/200/150?random=6', description: 'Detailed description of the menu item 6.', price: '₩11,000' },
        { id: 7, title: 'Sample Menu Item 7', image: 'https://picsum.photos/200/150?random=7', description: 'Detailed description of the menu item 7.', price: '₩14,000' },
        { id: 8, title: 'Sample Menu Item 8', image: 'https://picsum.photos/200/150?random=8', description: 'Detailed description of the menu item 8.', price: '₩13,000' },
        { id: 9, title: 'Sample Menu Item 9', image: 'https://picsum.photos/200/150?random=9', description: 'Detailed description of the menu item 9.', price: '₩8,000' },
    ];

    // Function to create and append menu items to the search-results container
    function generateMenuItems(items) {
        const $container = $('.search-results .row');
        $container.empty(); // Clear existing content

        items.forEach(item => {
            // Create a div element for the menu item using jQuery
            const $itemDiv = $('<div>')
                .addClass('col-md-3 menu-item')
                .attr({
                    'data-id': item.id,
                    'data-bs-toggle': 'modal',
                    'data-bs-target': '#menuDetailModal'
                });

            // Create the card structure using jQuery
            const $card = $('<div>').addClass('card');
            const $img = $('<img>').addClass('card-img-top').attr({ 'src': item.image, 'alt': item.title });
            const $cardBody = $('<div>').addClass('card-body');
            const $title = $('<h5>').addClass('card-title').text(item.title);
            const $description = $('<p>').addClass('card-text').text(item.description);
            const $price = $('<p>').addClass('card-price').text(item.price);

            // Append the elements together to form the card
            $cardBody.append($title, $description, $price);
            $card.append($img, $cardBody);
            $itemDiv.append($card);

            // Append the item div to the container
            $container.append($itemDiv);
        });

        // Bind click event to newly created menu items to show details in the modal
        $('.menu-item').on('click', function() {
            const itemId = parseInt($(this).data('id'), 10);
            const item = menuItems.find(menuItem => menuItem.id === itemId);

            if (item) {
                showMenuItemDetails(item);
            }
        });
    }

    // Function to populate the modal with the selected menu item details
    function showMenuItemDetails(item) {
        const $modalTitle = $('#menuDetailLabel');
        const $modalBody = $('.modal-body');

        $modalTitle.text(item.title);
        $modalBody.html(`
            <img src="${item.image}" class="img-fluid" alt="Menu Item Image">
            <h5>Description</h5>
            <p>${item.description}</p>
            <h5>Price</h5>
            <p>${item.price}</p>
        `);
    }

    // Generate and display the menu items when the document is ready
    generateMenuItems(menuItems);
});
