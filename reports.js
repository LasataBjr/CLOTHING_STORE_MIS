document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('monthlySalesChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Sales (Rs.)',
        data: [20000, 25000, 18000, 30000, 22000, 27000],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Monthly Sales Data'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
