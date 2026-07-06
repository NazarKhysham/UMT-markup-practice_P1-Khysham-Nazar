import axios from './vendor/axios.esm.js';

const client = axios.create({
  baseURL: 'http://localhost:4000',
});

export async function fetchTopSelling() {
  const { data } = await client.get('/products', {
    params: { category: 'top-selling' },
  });
  return data;
}

export async function fetchBouquets({ page, limit, search }) {
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
