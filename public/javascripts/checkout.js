// Handle form submission
const $form = $("#checkout-form");
let userAddress = ''; // Store address for later use

$form.submit(function (event) {
  event.preventDefault();
  $form.find("button").prop("disabled", true);

  // Get form data
  const formData = {
    name: $("#name").val(),
    email: $("#email").val(),
    phone: $("#phone").val(),
    address: $("#address").val(),
    _csrf: $('input[name="_csrf"]').val()
  };

  // Store address for payment verification
  userAddress = formData.address;

  // Send the form data to the server
  $.ajax({
    url: "/checkout",
    type: "POST",
    data: formData,
    success: function (response) {
      // Create Razorpay options
      const options = {
        key: response.key_id,
        amount: response.amount,
        currency: response.currency,
        name: "Your Store Name",
        description: "Purchase Description",
        order_id: response.order_id,
        handler: function (response) {
          // Handle successful payment
          $.ajax({
            url: "/payment/verify",
            type: "POST",
            data: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              address: userAddress, // Include the address in verification
              _csrf: $('input[name="_csrf"]').val()
            },
            success: function (response) {
              if (response.success) {
                window.location.href = "/user/profile";
              } else {
                $("#error").removeClass("d-none").text("Payment processing failed. Please try again.");
                $form.find("button").prop("disabled", false);
              }
            },
            error: function (error) {
              $("#error").removeClass("d-none").text("Payment verification failed. Please try again.");
              $form.find("button").prop("disabled", false);
            }
          });
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#3399cc"
        }
      };

      // Initialize Razorpay
      const rzp = new Razorpay(options);
      rzp.open();
    },
    error: function (error) {
      $("#error").removeClass("d-none").text("Failed to initialize payment. Please try again.");
      $form.find("button").prop("disabled", false);
    }
  });
});
