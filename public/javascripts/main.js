// fade out for flash messages
setTimeout(function () {
  $("#flash-msg").fadeOut("slow");
}, 3000);

setTimeout(function () {
  $("#success").fadeOut("slow");
}, 3000);

setTimeout(function () {
  $("#error").fadeOut("slow");
}, 3000);

// Add to Cart Function
function addToCart(productId) {
  $.ajax({
    url: '/add-to-cart/' + productId,
    method: 'GET',
    success: function(response) {
      if (response.success) {
        // Update cart badge
        const cartBadge = $('.cart-badge');
        if (cartBadge.length) {
          cartBadge.text(response.totalQty);
        } else {
          $('.fa-shopping-cart').after('<span class="cart-badge">' + response.totalQty + '</span>');
        }
        
        // Show success message
        showAlert('success', 'Product added to cart successfully!');
      } else {
        showAlert('danger', 'Failed to add product to cart.');
      }
    },
    error: function() {
      showAlert('danger', 'An error occurred. Please try again.');
    }
  });
}

// Show Alert Function
function showAlert(type, message) {
  const alertDiv = $('<div>')
    .addClass('alert alert-' + type + ' alert-dismissible fade show')
    .attr('role', 'alert')
    .html(message + 
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
          '<span aria-hidden="true">&times;</span></button>');
  
  // Remove any existing alerts
  $('.alert').remove();
  
  // Add the new alert at the top of the main content
  $('main').prepend(alertDiv);
  
  // Auto dismiss after 3 seconds
  setTimeout(function() {
    alertDiv.alert('close');
  }, 3000);
}

// Document Ready
$(document).ready(function() {
  // Initialize tooltips
  $('[data-toggle="tooltip"]').tooltip();
  
  // Smooth scroll for anchor links
  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    const target = $(this.getAttribute('href'));
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top - 100
      }, 1000);
    }
  });
});
