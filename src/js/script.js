const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartItems = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-counter')
const cartModal = document.getElementById('cart-modal')
const adressInput = document.getElementById('address')
const adressWarn = document.getElementById('address-warn')

const cart = [];

cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex'
    updateCartModal()
})

cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) { // Ou seja se eu clicar só na parte de fora da modal na parte escura utilizando o target o display troca para none
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', (event) => {
    let passButton = event.target.closest('.add-to-cart-btn')
    console.log(passButton)

    if (passButton) {
        const name = passButton.getAttribute("data-name")
        const price = parseFloat(passButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

// Função para manipular o nome do item e o preço apartir dos atributos: "data-name e o data-price" que eu recuperei e guardei numa variavel
function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }

    updateCartModal()

}

function updateCartModal() { // Atualiza visualmente os itens adicionados na modal
    cartItems.innerHTML = ""
    let total = 0

    cart.forEach((item) => {
        const cartItem = document.createElement("div")
        cartItem.classList.add('flex', 'items-center', 'justify-center', 'mb-4', 'flex-col')

        cartItem.innerHTML = `
            <div class='flex items-center justify-between w-full'>
                <div>
                    <p class='font-medium'>${item.name}</p>
                    <p>Qt ${item.quantity}</p>
                    <p class='mt-2 font-medium'>R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-item-btn" data-name="${item.name}">
                     Remover
                </button>
            </div>
        `

        total += item.price * item.quantity

        cartItems.appendChild(cartItem)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", { // Converte a moeda em real
        style: 'currency',
        currency: 'BRL'
    })

    cartCounter.innerHTML = cart.length

}

cartItems.addEventListener('click', (event) => {
    if (event.target.classList.contains("remove-item-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1
            updateCartModal() // Coloquei essa função para atualizar visualmente a modal
            return
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}

adressInput.addEventListener('input', (event) => {
    let inputValue = event.target.value

    if (inputValue !== "") {
        adressInput.classList.remove('border-red-500')
        adressWarn.classList.add('hidden')
    }
})


// Botão de finalizar o pedido

checkoutBtn.addEventListener('click', () => {

    // Eu passo os returns para parar a aplicação e não continuar oque tem em baixo
    // Quando passar por todos esses ifs ele vai enviar para a API do whatsapp

    const isOpen = checkRestaurantOpen()
    if (!isOpen) {
        Toastify({
            text: "Ops restaurante fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#E84855",
            },
        }).showToast()
        return
    }

    if (cart.length === 0) {
        Toastify({
            text: 'Ops Carrinho vazio',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            stopFocus: true,
            style: {
                background: '#F95738'
            }
        }).showToast()
        return
    }

    if (adressInput.value === "") {
        adressWarn.classList.remove('hidden')
        adressInput.classList.add('border-red-500')
        return
    }

    // Enviar para api do whatsapp

    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: ${item.quantity} Preço: R$${item.price} |`
        )
    }).join("") // transforma em string em vez de objeto

    const message = encodeURIComponent(cartItems)
    const phone = '933677647'

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, "_blank") // Serve para redirecionar para uma outra página

    cart.length = 0
    updateCartModal()
})


const dateSpan = document.getElementById('date-span')

function checkRestaurantOpen() {
    const data = new Date
    const hourAtual = data.getHours()
    return hourAtual >= 18 && hourAtual <= 22
}

const isOpen = checkRestaurantOpen()

if (isOpen) {
    dateSpan.classList.remove('bg-red-500')
    dateSpan.classList.add('bg-green-600')
} else {
    dateSpan.classList.remove('bg-green-500')
    dateSpan.classList.add('bg-red-600')
}