import axios from './vendor/axios.esm.js';

const isLocalDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const client = axios.create({
  baseURL: 'http://localhost:4000',
});

let staticProductsPromise;

function loadStaticProducts() {
  if (!staticProductsPromise) {
    staticProductsPromise = axios.get('db.json').then(({ data }) => data.products);
  }
  return staticProductsPromise;
}

export async function fetchTopSelling() {
  if (isLocalDev) {
    const { data } = await client.get('/products', {
      params: { category: 'top-selling' },
    });
    return data;
  }

  const products = await loadStaticProducts();
  return products.filter((product) => product.category === 'top-selling');
}

export async function fetchBouquets({ page, limit, search }) {
  if (isLocalDev) {
    const { data, headers } = await client.get('/products', {
      params: {
        category: 'bouquet',
        _page: page,
        _limit: limit,
        name_like: search || undefined,
      },
    });

    const total = Number(headers['x-total-count']) || data.length;
    return { items: data, total };
  }

  const products = await loadStaticProducts();
  const query = (search || '').toLowerCase();
  const filtered = products.filter(
    (product) => product.category === 'bouquet' && product.name.toLowerCase().includes(query)
  );

  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);
  return { items, total: filtered.length };
}
