const BASE_URL = import.meta.env.VITE_API_URL;

 const API = {
  categories: `${BASE_URL}/api/categories`,

  filters: `${BASE_URL}/api/filters`,

  forgotPassword: `${BASE_URL}/api/users/forgot-password`,

  logout: `${BASE_URL}/api/users/logout`,

  login: `${BASE_URL}/api/users/login`,

  register: `${BASE_URL}/api/users/register`,

  uploads: `${BASE_URL}/uploads`,

  allProducts: (page, limit) =>
    `${BASE_URL}/api/categories/products?page=${page}&limit=${limit}`,

  categoryById: (id) =>
    `${BASE_URL}/api/categories/${id}`,

  productById: (id) =>
    `${BASE_URL}/api/categories/products/${id}`,

  originalFilters: (params) =>
    `${BASE_URL}/api/categories/products?${params.toString()}`,
};

export default API;