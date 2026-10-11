import axios from 'axios';

const GUEST_ID_KEY = 'float247_guest_id';

const getGuestId = (): string => {
  let guestId = localStorage.getItem(GUEST_ID_KEY);

  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }

  return guestId;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const guestId = getGuestId();

    config.headers['X-Guest-Id'] = guestId;

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const clearAdminSessionStorage = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('role');
    sessionStorage.clear();
  } catch {
    // ignore storage blocks
  }
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearAdminSessionStorage();
      return false;
    }
    return true;
  } catch {
    clearAdminSessionStorage();
    return false;
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      clearAdminSessionStorage();
      if (
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login'
      ) {
        window.location.replace('/admin/login');
      }
    }

    console.error(
      'API Error:',
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export { getGuestId };

export default api;