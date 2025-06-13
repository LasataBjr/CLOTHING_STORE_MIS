$(document).ready(function () {
  $('#productTable').DataTable();
  $('#orderTable').DataTable();

  // Orders Chart - Line chart for last 7 days
  const ordersCtx = document.getElementById('ordersChart').getContext('2d');
  new Chart(ordersCtx, {
    type: 'line',
    data: {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [{
        label: 'Orders',
        data: [15, 22, 18, 25, 20, 24, 30],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text: 'Orders Over Last 7 Days'
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Top Selling Products - Bar chart
  const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');
  new Chart(topProductsCtx, {
    type: 'bar',
    data: {
      labels: ['Men\'s Hoodie', 'Women\'s Jacket', 'Kids T-Shirt', 'Sneakers', 'Caps'],
      datasets: [{
        label: 'Units Sold',
        data: [120, 90, 60, 75, 40],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Top Selling Products'
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Order Status - Pie chart
  const orderStatusCtx = document.getElementById('orderStatusChart').getContext('2d');
  new Chart(orderStatusCtx, {
    type: 'pie',
    data: {
      labels: ['Pending', 'Shipped', 'Delivered'],
      datasets: [{
        label: 'Order Status',
        data: [35, 50, 115],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Order Status Breakdown'
        }
      }
    }
  });
});
$(document).ready(function () {
  let productTable = $('#productTable').DataTable({
    columns: [
      { data: 'id' },
      { data: 'name' },
      { data: 'category' },
      { data: 'size' },
      { data: 'price' },
      { data: 'stock' },
      {
        data: 'image',
        render: function (data) {
          return `<img src="${data}" alt="Product Image" style="width:50px; height:50px; object-fit:cover; border-radius:5px;" />`;
        }
      },
      { data: 'description' },
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
            <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn ms-1" data-id="${row.id}">Delete</button>
          `;
        }
      }
    ],
  });

  // Sample product data to start with (you can replace with your backend data)
  let products = [
    {
      id: 1,
      name: "Men's Hoodie",
      category: "Men's",
      size: "M",
      price: 35,
      stock: 20,
      image: "https://via.placeholder.com/50",
      description: "Comfortable men's hoodie"
    }
  ];

  // Load initial data into table
  function loadTable() {
    productTable.clear();
    productTable.rows.add(products);
    productTable.draw();
  }

  loadTable();

  // Image preview
  $('#image').on('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $('#imagePreview').attr('src', e.target.result).show();
      };
      reader.readAsDataURL(file);
    } else {
      $('#imagePreview').hide().attr('src', '');
    }
  });

  // Reset form helper
  function resetForm() {
    $('#productId').val('');
    $('#productName').val('');
    $('#category').val('');
    $('#size').val('');
    $('#price').val('');
    $('#stock').val('');
    $('#image').val('');
    $('#imagePreview').hide().attr('src', '');
    $('#description').val('');
    $('#cancelEdit').hide();
    $('#productForm button[type=submit]').text('Save Product');
  }

  // Cancel edit
  $('#cancelEdit').on('click', function () {
    resetForm();
  });

  // Add / Edit product submit handler
  $('#productForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#productId').val();
    const name = $('#productName').val().trim();
    const category = $('#category').val();
    const size = $('#size').val();
    const price = parseFloat($('#price').val());
    const stock = parseInt($('#stock').val());
    const description = $('#description').val().trim();

    // Get image preview src or default placeholder
    let imageSrc = $('#imagePreview').attr('src');
    if (!imageSrc) {
      imageSrc = "https://via.placeholder.com/50"; // default image
    }

    if (id) {
      // Edit existing product
      const index = products.findIndex(p => p.id == id);
      if (index !== -1) {
        products[index] = {
          id: parseInt(id),
          name,
          category,
          size,
          price,
          stock,
          image: imageSrc,
          description
        };
      }
    } else {
      // Add new product
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      products.push({
        id: newId,
        name,
        category,
        size,
        price,
        stock,
        image: imageSrc,
        description
      });
    }

    loadTable();
    resetForm();
  });

  // Edit button click
  $('#productTable tbody').on('click', '.edit-btn', function () {
    const id = $(this).data('id');
    const product = products.find(p => p.id == id);
    if (!product) return;

    $('#productId').val(product.id);
    $('#productName').val(product.name);
    $('#category').val(product.category);
    $('#size').val(product.size);
    $('#price').val(product.price);
    $('#stock').val(product.stock);
    $('#imagePreview').attr('src', product.image).show();
    $('#description').val(product.description);
    $('#cancelEdit').show();
    $('#productForm button[type=submit]').text('Update Product');
  });

  // Delete button click
  $('#productTable tbody').on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    if (confirm('Are you sure you want to delete this product?')) {
      products = products.filter(p => p.id != id);
      loadTable();
      resetForm();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  console.log("Settings page loaded");
  // Add any dynamic logic like toggling settings, etc.
});
