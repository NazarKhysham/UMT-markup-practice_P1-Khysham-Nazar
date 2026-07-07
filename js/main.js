import { initTopSelling, initBouquets, onProductCardClick } from './render.js';
import { initOrderFormValidation } from './validate.js';

if (window.AOS) {
  AOS.init({ duration: 600, once: true, offset: 40 });
}

/* ---------- Mobile menu ---------- */
const navToggle = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu__close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

function openMobileMenu() {
  mobileMenu.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('no-scroll');
}

function closeMobileMenu() {
  mobileMenu.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
}

navToggle.addEventListener('click', openMobileMenu);
mobileMenuClose.addEventListener('click', closeMobileMenu);
mobileMenuLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

/* ---------- Modals ---------- */
function openModal(modal) {
  modal.classList.add('is-open');
  document.body.classList.add('no-scroll');
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
}

document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal(backdrop);
  });
  backdrop.querySelector('.modal__close').addEventListener('click', () => closeModal(backdrop));
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.modal-backdrop.is-open').forEach((backdrop) => closeModal(backdrop));
  if (mobileMenu.classList.contains('is-open')) closeMobileMenu();
});

/* ---------- Product details modal ---------- */
const productModal = document.querySelector('#product-modal');
const productModalImage = document.querySelector('#product-modal-image');
const productModalTitle = document.querySelector('#product-modal-title');
const productModalPrice = document.querySelector('#product-modal-price');
const productModalDescription = document.querySelector('#product-modal-description');
const productModalBuy = document.querySelector('#product-modal-buy');

const orderModal = document.querySelector('#order-modal');
const orderProductId = document.querySelector('#order-product-id');
const orderQuantity = document.querySelector('#order-quantity');
const orderForm = document.querySelector('#order-form');
const productModalQty = document.querySelector('#product-modal-qty');

function openProductModal(product) {
  productModalImage.src = product.image;
  productModalImage.srcset = `${product.image} 1x, ${product.image2x} 2x`;
  productModalImage.alt = `${product.name} bouquet`;
  productModalTitle.textContent = product.name;
  productModalPrice.textContent = `$${product.price}`;
  productModalDescription.textContent = product.description;
  productModalBuy.dataset.id = product.id;
  productModalQty.value = 1;
  openModal(productModal);
}

onProductCardClick(openProductModal);

productModalBuy.addEventListener('click', () => {
  orderProductId.value = productModalBuy.dataset.id;
  orderQuantity.value = Math.max(1, Number(productModalQty.value) || 1);
  closeModal(productModal);
  openModal(orderModal);
});

initOrderFormValidation(orderForm);

orderForm.addEventListener('order:submit', (event) => {
  console.log('Order submitted:', Object.fromEntries(event.detail.entries()));
  closeModal(orderModal);
  orderForm.reset();
  orderForm.querySelectorAll('.order-form__field.is-invalid').forEach((field) => {
    field.classList.remove('is-invalid');
  });
});

/* ---------- Testimonials carousel ---------- */
const testimonialsList = document.querySelector('.testimonials__list');
const testimonialsArrows = document.querySelectorAll('.testimonials__arrow');

testimonialsArrows.forEach((arrow, index) => {
  arrow.addEventListener('click', () => {
    const direction = index === 0 ? -1 : 1;
    const cardWidth = testimonialsList.firstElementChild?.offsetWidth ?? 0;
    testimonialsList.scrollBy({ left: direction * (cardWidth + 24), behavior: 'smooth' });
  });
});

/* ---------- Data ---------- */
initTopSelling();
initBouquets();
