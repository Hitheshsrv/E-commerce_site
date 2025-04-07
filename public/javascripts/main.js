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
        // Update cart badge - only target the header cart icon
        const cartBadge = $('.nav-icons .cart-icon .cart-badge');
        if (cartBadge.length) {
          cartBadge.text(response.totalQty);
        } else {
          $('.nav-icons .cart-icon .fa-shopping-cart').after('<span class="cart-badge">' + response.totalQty + '</span>');
        }
        
        // Show success message
        showAlert('success', response.message || 'Product added to cart successfully!');
      } else {
        showAlert('danger', response.message || 'Failed to add product to cart.');
      }
    },
    error: function(xhr, status, error) {
      showAlert('danger', 'An error occurred. Please try again.');
    }
  });
}

// Show Alert Function
function showAlert(type, message) {
  // Remove any existing alerts
  $('.alert-dismissible').remove();
  
  const alertDiv = $('<div>')
    .addClass('alert alert-' + type + ' alert-dismissible fade show')
    .attr('role', 'alert')
    .html(message + 
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
          '<span aria-hidden="true">&times;</span></button>');
  
  // Add alert to the page
  $('.container').prepend(alertDiv);
  
  // Auto-dismiss after 3 seconds
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
