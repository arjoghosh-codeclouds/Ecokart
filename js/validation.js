document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();

    if (!name || !email || !phone || !address) {
      alert("All fields are required!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Invalid email format");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Invalid phone number. Must be 10 digits.");
      return;
    }
    // Save order ID

    window.location.href = "confirmation.html";
  });
});
