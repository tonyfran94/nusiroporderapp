const prices = {
  "Classic Milk Tea": 150,
  "Earl Grey Milk Tea": 160,
  "Oolong Milk Tea": 170,
  "Mango Green Tea": 160,
  "Lychee Oolong Tea": 170,
  "Passionfruit Green Tea": 160,
  "Brown Sugar Milk": 180,
  "Matcha Milk Tea": 180,
  sizeUpcharges: {
    Small: 0,
    Medium: 20,
    Large: 40
  }
};

const sugarLevels = [
  "No Sugar",
  "Less Sugar",
  "Normal Sugar",
  "Extra Sugar"
];
const iceLevels = [
  "No Ice",
  "Less Ice",
  "Normal Ice",
  "Extra Ice"
];

let selectedDrink = null;
let selectedDrinks = {};
const allDrinks = [
  "Classic Milk Tea",
  "Earl Grey Milk Tea",
  "Oolong Milk Tea",
  "Mango Green Tea",
  "Lychee Oolong Tea",
  "Passionfruit Green Tea",
  "Brown Sugar Milk",
  "Matcha Milk Tea"
];
allDrinks.forEach(drink => {
  selectedDrinks[drink] = {
    quantity: 0,
    sugar: "Normal Sugar",
    ice: "Normal Ice"
  };
});

function renderCustomization(drink) {
  const container = document.getElementById("drink-customization");
  let html = "";
  allDrinks.forEach(drink => {
    if (selectedDrinks[drink].quantity > 0) {
      html += `
        <div class="form-group">
          <label>${drink} - Quantity:</label>
          <input type="number" min="1" value="${selectedDrinks[drink].quantity}" id="qty-${drink}" class="drink-qty" />
          <label for="sugar-${drink}">Sugar level:</label>
          <select id="sugar-${drink}" name="sugar-${drink}">
            ${sugarLevels.map(level => `<option value="${level}" ${selectedDrinks[drink].sugar === level ? "selected" : ""}>${level}</option>`).join("")}
          </select>
          <label for="iceLevel-${drink}">Ice level:</label>
          <select id="iceLevel-${drink}" name="iceLevel-${drink}">
            ${iceLevels.map(level => `<option value="${level}" ${selectedDrinks[drink].ice === level ? "selected" : ""}>${level}</option>`).join("")}
          </select>
        </div>
      `;
    }
  });
  container.innerHTML = html;

  allDrinks.forEach(drink => {
    if (selectedDrinks[drink].quantity > 0) {
      document.getElementById(`qty-${drink}`).addEventListener("change", function(e) {
        selectedDrinks[drink].quantity = parseInt(e.target.value) || 1;
      });
      document.getElementById(`sugar-${drink}`).addEventListener("change", function(e) {
        selectedDrinks[drink].sugar = e.target.value;
      });
      document.getElementById(`iceLevel-${drink}`).addEventListener("change", function(e) {
        selectedDrinks[drink].ice = e.target.value;
      });
    }
  });
}

document.querySelectorAll(".drink-btn").forEach(btn => {
  btn.addEventListener("click", function() {
    const drink = btn.getAttribute("data-drink");
    selectedDrinks[drink].quantity = selectedDrinks[drink].quantity > 0 ? selectedDrinks[drink].quantity : 1;
    btn.classList.add("selected");
    renderCustomization();
  });
});

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const size = document.getElementById("size").value;
  let orderSummary = "🧾 Order Summary<br/>";
  let message = `Order Details:%0ASize: ${size}`;
  let total = 0;
  let anyDrink = false;
  allDrinks.forEach(drink => {
    if (selectedDrinks[drink].quantity > 0) {
      anyDrink = true;
      const price = prices[drink];
      const drinkTotal = (price + prices.sizeUpcharges[size]) * selectedDrinks[drink].quantity;
      total += drinkTotal;
      orderSummary += `<br/>${drink} x ${selectedDrinks[drink].quantity} - Sugar: ${selectedDrinks[drink].sugar}, Ice: ${selectedDrinks[drink].ice}, Subtotal: Rs ${drinkTotal}`;
      message += `%0A${drink} x ${selectedDrinks[drink].quantity} - Sugar: ${selectedDrinks[drink].sugar}, Ice: ${selectedDrinks[drink].ice}, Subtotal: Rs ${drinkTotal}`;
    }
  });
  orderSummary += `<br/><br/>Total Price: Rs ${total}`;
  message += `%0ATotal Price: Rs ${total}`;
  // Show summary in a modal dialog
  if (!anyDrink) {
    alert("Please select at least one drink.");
    return;
  }
  const summaryDiv = document.getElementById("summary");
  summaryDiv.innerHTML = orderSummary;
  setTimeout(() => {
    if (confirm("Do you want to place this order?\n\n" + summaryDiv.innerText)) {
      const whatsappUrl = `https://wa.me/23057192609?text=${message}`;
      window.open(whatsappUrl, "_blank");
    } else {
      alert("You can modify your order below.");
    }
  }, 100);
});
