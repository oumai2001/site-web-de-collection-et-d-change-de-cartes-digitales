// Données statiques des cartes Pokémon

const cards = [
  { id: 1, name: "Pikachu", rarity: "Common", description: "Un Pokémon électrique rapide et adorable.", price: "150 $", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png" },
  { id: 2, name: "Charizard", rarity: "Rare Ultra", description: "Un dragon puissant cracheur de flammes.", price: "1200 $", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png" },
  { id: 3, name: "Bulbasaur", rarity: "Common", description: "Un Pokémon plante avec une graine sur le dos.", price: "200 $", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png" },
  { id: 4, name: "Mewtwo", rarity: "Rare Rainbow", description: "Un Pokémon légendaire créé par manipulation génétique.", price: "3000 $", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png" },
  { id: 5, name: "Gengar", rarity: "Rare Holo", description: "Un esprit joueur venant de l’ombre.", price: "850 $", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png" },
  { id: 6, name: "Snorlax", rarity: "Rare", description: "Un géant paresseux qui adore dormir.", price: "600 $", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/143.png" },
  { id: 7, name: "Eevee", rarity: "Common", description: "Un Pokémon mignon capable de multiples évolutions.", price: "300 $", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png" },
  { id: 8, name: "Lucario", rarity: "Rare Ultra", description: "Un combattant agile qui maîtrise l’aura.", price: "1000 $", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/448.png" },
  { id: 9, name: "Rayquaza", rarity: "Rare Rainbow", description: "Un dragon céleste gardien des cieux.", price: "2500 $", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/384.png" }
];

// Variables globales

const container = document.getElementById("cards-container");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const notification = document.getElementById("notification");
const notifText = document.getElementById("notification-text");

let currentPage = 1;
const itemsPerPage = 6;
let filteredCards = cards;

// LocalStorage Favoris

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function addFavorite(card) {
  let favorites = getFavorites();
  if (!favorites.find(c => c.id === card.id)) {
    favorites.push(card);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showNotification(`${card.name} ajouté aux favoris !`, "pink");
  }
}

function removeFavorite(cardId) {
  let favorites = getFavorites();
  favorites = favorites.filter(c => c.id !== cardId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}


// Afficher les cartes (Market ou autre)
function displayCards(list) {
  if (!container) return;
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = `<p class="text-white text-center text-xl">Aucune carte trouvée.</p>`;
    return;
  }

  list.forEach(card => {
    const div = document.createElement("div");
    div.className = `relative w-90 h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white hover:scale-105 transition-transform mx-auto bg-transparent backdrop-blur-md`;

    div.innerHTML = `
      <img src="${card.image}" alt="${card.name}" class="w-full h-full object-cover">
      <div class="absolute bottom-0 w-full bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent p-4 text-white">
        <h2 class="text-2xl font-bold text-yellow-400 mb-1">${card.name}</h2>
        <p class="text-sm mb-1">Rareté: <span class="font-semibold">${card.rarity}</span></p>
        <p class="text-gray-300 mb-2 text-xs">${card.description}</p>
        <p class="text-lg font-bold mb-2">${card.price}</p>
        <div class="flex gap-2">
          <button class="bg-yellow-400 text-black px-2 py-1 rounded-lg font-bold hover:bg-yellow-500 text-xs add-cart">Add to carte</button>
          <button class="bg-pink-500 text-white px-2 py-1 rounded-lg font-bold hover:bg-pink-600 text-xs add-fav">Favoris</button>
        </div>
      </div>
    `;

    // Bouton "Add to carte" : ajoute la carte au panier et la stocke dans localStorage
    div.querySelector(".add-cart")?.addEventListener("click", () => {
      addToCart(card); // doit être défini dans ton JS
      showNotification(`${card.name} a été ajoutée au panier !`, "green");
    });

    // Bouton "Favoris"
    div.querySelector(".add-fav")?.addEventListener("click", () => {
      addFavorite(card);
      if (window.location.pathname.includes("favorites.html")) {
        displayFavorites();
      }
    });

    container.appendChild(div);
  });
}


// Afficher les cartes favorites (Favorites Page)
function displayFavorites() {
  const favContainer = document.getElementById("favorites-container");
  const noFavMsg = document.getElementById("no-favorites");
  if (!favContainer) return;

  favContainer.innerHTML = "";
  const favorites = getFavorites();

  if (favorites.length === 0) {
    noFavMsg?.classList.remove("hidden"); 
    return;
  } else {
    noFavMsg?.classList.add("hidden"); 
  }

  favorites.forEach(card => {
    const div = document.createElement("div");
    div.className = `relative w-90 h-[490px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white hover:scale-105 transition-transform mx-auto bg-transparent backdrop-blur-md`;

    div.innerHTML = `
      <img src="${card.image}" alt="${card.name}" class="w-full h-full object-cover">
      <div class="absolute bottom-0 w-full bg-gradient-to-t from-purple-900/90 via-purple-900/60 to-transparent p-4 text-white z-10">
        <h2 class="text-2xl font-bold text-yellow-400 mb-1">${card.name}</h2>
        <p class="text-sm mb-1">Rareté: <span class="font-semibold">${card.rarity}</span></p>
        <p class="text-gray-300 mb-2 text-xs">${card.description}</p>
        <p class="text-lg font-bold mb-2">${card.price}</p>
        <div class="flex gap-2">
          <button class="bg-red-500 text-white px-3 py-1 rounded-lg font-bold hover:bg-red-600 remove-fav text-xs">Remove</button>
          <button class="bg-yellow-400 text-black px-3 py-1 rounded-lg font-bold hover:bg-yellow-500 add-cart-fav text-xs">Add to carte</button>
        </div>
      </div>
    `;

    // زر إزالة من المفضلة
    div.querySelector(".remove-fav").addEventListener("click", () => {
      removeFavorite(card.id);
      displayFavorites(); 
    });

    // زر إضافة للسلة (Cart)
    div.querySelector(".add-cart-fav").addEventListener("click", () => {
      addToCart(card);   // دالة addToCart من Market / panier
      showNotification(`${card.name} تمت إضافتها إلى السلة!`, "green");
    });

    favContainer.appendChild(div);
  });
}

// Pagination

function paginate() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredCards.slice(start, end);
  displayCards(pageItems);
}

// Filtrage par rareté

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const rarity = btn.dataset.rarity;
    filterButtons.forEach(b => b.classList.remove("ring-4", "ring-yellow-300"));
    btn.classList.add("ring-4", "ring-yellow-300");
    filteredCards = rarity ? cards.filter(c => c.rarity === rarity) : cards;
    currentPage = 1;
    paginate();
  });
});

// Recherche

searchInput?.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  filteredCards = cards.filter(c => c.name.toLowerCase().includes(value));
  currentPage = 1;
  paginate();
});

// Notification

function showNotification(message, color) {
  if (!notification || !notifText) return;
  notifText.textContent = message;
  notification.classList.remove("translate-x-full");
  notification.style.backgroundColor = color === "green" ? "#22c55e" : "#ec4899";
  setTimeout(() => {
    notification.classList.add("translate-x-full");
  }, 2000);
}

// Pagination boutons

document.getElementById("prev-page")?.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    paginate();
  }
});
document.getElementById("next-page")?.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    paginate();
  }
});
document.querySelectorAll(".page-num").forEach(btn => {
  btn.addEventListener("click", () => {
    currentPage = parseInt(btn.dataset.page);
    paginate();
  });
});

// Slider accueil

if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
  const sliderContainer = document.getElementById("autoSlider");
  if (sliderContainer) {
    const sliderCards = cards.slice(0, 4);
    sliderCards.forEach(card => {
      const div = document.createElement("div");
      div.className = `
        relative w-90 h-[490px] min-w-full
        bg-transparent text-white border-4 border-white
        rounded-2xl overflow-hidden flex flex-col
        items-center justify-end p-6 backdrop-blur-md shadow-2xl animate-shimmer
      `;

      div.innerHTML = `
        <div class="flex-1 flex items-center justify-center w-full relative z-10">
          <img src="${card.image}" 
               alt="${card.name}" 
               class="w-[85%] h-auto max-h-[350px] object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-transform duration-500 hover:scale-105">
        </div>
        <div class="text-center mt-4 relative z-10">
          <h2 class="text-2xl font-bold text-yellow-400 mb-1">${card.name}</h2>
          <p class="text-sm text-gray-300 mb-1">Rareté : ${card.rarity}</p>
          <p class="text-lg font-bold">${card.price}</p>
        </div>
      `;
      sliderContainer.appendChild(div);
    });

    let index = 0;
    const slides = sliderContainer.children.length;
    setInterval(() => {
      index = (index + 1) % slides;
      sliderContainer.style.transform = `translateX(-${index * 100}%)`;
    }, 3000);
  }
}

// Initialisation

window.addEventListener("DOMContentLoaded", () => {
  loading?.classList.add("hidden");
  if (window.location.pathname.includes("favorites.html")) {
    displayFavorites();
  } else {
    paginate();
  }
});


// ======================
// Panier (Cart) Logic
// ======================

// Récupérer le panier depuis le localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Sauvegarder le panier dans le localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Ajouter une carte au panier
function addToCart(card) {
  let cart = getCart();
  const existing = cart.find(item => item.id === card.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...card, quantity: 1 });
  }
  saveCart(cart);
  showNotification(`${card.name} ajouté au panier !`, "green");
}

// Supprimer une carte du panier
function removeFromCart(cardId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== cardId);
  saveCart(cart);
  displayCartItems();
}

// Changer la quantité d'une carte
function changeQuantity(cardId, delta) {
  let cart = getCart();
  const item = cart.find(c => c.id === cardId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(c => c.id !== cardId);
  }
  saveCart(cart);
  displayCartItems();
}

// Afficher le panier
function displayCartItems() {
  const cartContainer = document.getElementById("cart-items");
  const subtotalElem = document.getElementById("cart-subtotal");
  const taxElem = document.getElementById("cart-tax");
  const totalElem = document.getElementById("cart-total");

  if (!cartContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <p class="text-white text-center text-xl mb-4">Votre panier est vide. Découvrez de nouvelles cartes sur le marché !</p>
      <a href="market.html" class="block text-center text-yellow-400 font-bold hover:underline">Voir le Market</a>
    `;
    subtotalElem.textContent = "$0.00";
    taxElem.textContent = "$0.00";
    totalElem.textContent = "$0.00";
    return;
  }

  cartContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = parseFloat(item.price.replace("$","")) * item.quantity;
    subtotal += itemTotal;

    const div = document.createElement("div");
    div.className = "flex items-center justify-between bg-purple-900/30 rounded-lg p-4 mb-4";
    div.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-contain rounded-lg">
        <div>
          <h3 class="text-yellow-400 font-bold">${item.name}</h3>
          <p class="text-white">$${parseFloat(item.price.replace("$","")).toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-action="decrease" data-id="${item.id}">-</button>
        <span class="text-white font-bold">${item.quantity}</span>
        <button class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" data-action="increase" data-id="${item.id}">+</button>
        <button class="ml-2 bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600" data-action="remove" data-id="${item.id}">Supprimer</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
  taxElem.textContent = `$${tax.toFixed(2)}`;
  totalElem.textContent = `$${total.toFixed(2)}`;

  // Ajouter les événements des boutons
  cartContainer.querySelectorAll("button").forEach(btn => {
    const id = parseInt(btn.dataset.id);
    const action = btn.dataset.action;
    btn.addEventListener("click", () => {
      if (action === "increase") changeQuantity(id, 1);
      else if (action === "decrease") changeQuantity(id, -1);
      else if (action === "remove") removeFromCart(id);
    });
  });
}

// Mettre à jour le compteur du panier dans la navbar
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-count-mobile").textContent = count;
}

// Vider le panier
function clearCart() {
  localStorage.removeItem("cart");
  displayCartItems();
  showNotification("Panier vidé !", "pink");
}

// Simuler l'achat
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    showNotification("Votre panier est vide !", "pink");
    return;
  }
  clearCart();
  showNotification("Merci pour votre achat !", "green");
}

// Initialisation
window.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
  updateCartCount();

  // Si on veut aussi que "Add to carte" ajoute directement au panier depuis le Market
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const cardId = parseInt(btn.closest("div").dataset.id);
      const card = cards.find(c => c.id === cardId);
      if (card) addToCart(card);
      displayCartItems();
    });
  });
});
