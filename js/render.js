import { fetchTopSelling, fetchBouquets } from './api.js';

const topSellingList = document.querySelector('#top-selling-list');
const bouquetsList = document.querySelector('#bouquets-list');
const bouquetsEmpty = document.querySelector('#bouquets-empty');
const showMoreBtn = document.querySelector('#show-more-btn');
const searchInput = document.querySelector('#bouquets-search');
const filterForm = document.querySelector('#bouquets-filter');

const BOUQUETS_LIMIT = 4;

const state = {
  page: 1,
  search: '',
};

let allProducts = [];

function productCardMarkup(product) {
  return `
    <li class="product-card" data-aos="fade-up">
      <button class="product-card__link" type="button" data-id="${product.id}">
        <img
          class="product-card__image"
          src="${product.image}"
          srcset="${product.image} 1x, ${product.image2x} 2x"
          alt="${product.name} bouquet"
          loading="lazy"
        />
      </button>
      <h3 class="product-card__title">${product.name}</h3>
      <p class="product-card__price">$${product.price}</p>
    </li>
  `;
}

function findProduct(id) {
  return allProducts.find((item) => String(item.id) === String(id));
}

function registerProducts(items) {
  items.forEach((item) => {
    if (!findProduct(item.id)) {
      allProducts.push(item);
    }
  });
}

export async function initTopSelling() {
  try {
    const items = await fetchTopSelling();
    registerProducts(items);
    topSellingList.innerHTML = items.map(productCardMarkup).join('');
  } catch (error) {
    topSellingList.innerHTML = `<li class="products__empty">Failed to load bestsellers. Please try again later.</li>`;
    console.error(error);
  }
}

async function loadBouquets({ append }) {
  try {
    const { items, total } = await fetchBouquets({
      page: state.page,
      limit: BOUQUETS_LIMIT,
      search: state.search,
    });
    registerProducts(items);

    if (append) {
      bouquetsList.insertAdjacentHTML('beforeend', items.map(productCardMarkup).join(''));
    } else {
      bouquetsList.innerHTML = items.map(productCardMarkup).join('');
    }

    const loadedCount = bouquetsList.children.length;
    bouquetsEmpty.hidden = loadedCount > 0;
    showMoreBtn.hidden = loadedCount >= total;
  } catch (error) {
    if (!append) {
      bouquetsList.innerHTML = '';
      bouquetsEmpty.hidden = false;
      bouquetsEmpty.textContent = 'Failed to load bouquets. Please try again later.';
    } else {
      state.page -= 1;
    }
    showMoreBtn.hidden = append;
    console.error(error);
  }
}

export function initBouquets() {
  loadBouquets({ append: false });

  showMoreBtn.addEventListener('click', () => {
    state.page += 1;
    loadBouquets({ append: true });
  });

  let debounceId;
  searchInput.addEventListener('input', (event) => {
    clearTimeout(debounceId);
    debounceId = setTimeout(() => {
      state.search = event.target.value.trim();
      state.page = 1;
      loadBouquets({ append: false });
    }, 300);
  });

  filterForm.addEventListener('submit', (event) => event.preventDefault());
}

export function onProductCardClick(callback) {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.product-card__link');
    if (!trigger) return;
    const product = findProduct(trigger.dataset.id);
    if (product) callback(product);
  });
}
