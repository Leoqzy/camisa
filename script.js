const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function(event){
    if (event.target === cartModal){
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
});

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn");

    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name);

    if(existingItem){
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex","justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-bold mt-2">R$${item.price.toFixed(2)}</p>
                </div>
                    <button class="remove-item-btn" data-name="${item.name}">
                        Remover
                    </button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);

        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toLocaleString("PT-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

    const removeButtons = document.querySelectorAll(".remove-item-btn");
    removeButtons.forEach(button => {
        button.addEventListener("click", function(){
            const itemName = button.getAttribute("data-name");
            removeFromCart(itemName);
        });
    });
}

function removeFromCart(name){
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

});

checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
    
        Toastify({
            text: "Está Fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` ou `bottom`
            position: "right", // `left`, `center` ou `right`
            stopOnFocus: true, // Impede o fechamento do toast ao passar o mouse
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(addressInput.value === ""){

        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    const phoneNumber = "554298356362"; // Adicione o número de telefone desejado aqui

    // Calculate total price of items
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Format cart items for the message
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${(item.price * item.quantity).toFixed(2)} |`
        )
    }).join("");

    // Construct message with total price
    const message = encodeURIComponent(`Total: R$${totalPrice.toFixed(2)}\n\n${cartItems}\n\nEndereço: ${addressInput.value}\n\nTotal: R$${totalPrice.toFixed(2)}`); // Add total price to the message

    window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, "_blank");

    cart = [];
    updateCartModal();
});


function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 9 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
