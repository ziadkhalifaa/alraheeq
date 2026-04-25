import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// CSRF Interceptor
api.interceptors.request.use(async (config) => {
  if (config.method !== 'get' && !config.url?.includes('/csrf-token')) {
    try {
      const { data } = await axios.get(`${API_URL.replace('/api', '')}/api/csrf-token`, { withCredentials: true });
      config.headers['X-CSRF-Token'] = data.csrfToken;
    } catch (err) {
      console.error('Failed to fetch CSRF token', err);
    }
  }
  return config;
});

// Remove manual token interceptor as we are using HttpOnly cookies
export const productApi = {
  getAll: (category?: string, limit?: number) => api.get('/products', { params: { category, limit } }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  create: (data: any) => api.post('/admin/products', data),
  update: (id: number, data: any) => api.put(`/admin/products/${id}`, data),
  delete: (id: number) => api.delete(`/admin/products/${id}`),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
};

export const adminApi = {
  login: (credentials: any) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  getMe: () => api.get('/admin/me'),
};

export const inquiryApi = {
  create: (data: any) => api.post('/inquiries', data),
  getAll: () => api.get('/inquiries/admin'),
  getById: (id: number) => api.get(`/inquiries/admin/${id}`),
  getUnreadCount: () => api.get('/inquiries/admin/unread'),
  exportCSV: () => api.get('/inquiries/admin/export', { responseType: 'blob' }),
  updateStatus: (id: number, status: string) => api.patch(`/inquiries/admin/${id}`, { status }),
  updateCRM: (id: number, data: { status?: string; priority?: string; notes?: string; assigned_to?: number; mark_contacted?: boolean }) => 
    api.patch(`/inquiries/admin/${id}`, data),
};

export const blogApi = {
  getAll: () => api.get('/blog'),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
  create: (data: any) => api.post('/blog/admin', data),
  update: (id: number, data: any) => api.put(`/blog/admin/${id}`, data),
  delete: (id: number) => api.delete(`/blog/admin/${id}`),
};

export const eventApi = {
  track: (data: { type: string; product_id?: number; source_page?: string }) => api.post('/events', data),
};

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getProducts: () => api.get('/analytics/products'),
};

export const certificateApi = {
  getAll: () => api.get('/certificates'),
  create: (data: any) => api.post('/certificates/admin', data),
  update: (id: number, data: any) => api.put(`/certificates/admin/${id}`, data),
  delete: (id: number) => api.delete(`/certificates/admin/${id}`),
};

export const mediaApi = {
  getAll: (folder?: string) => api.get('/media', { params: { folder } }),
  upload: (data: FormData) => api.post('/media/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: number) => api.delete(`/media/${id}`),
};

export const pageApi = {
  getContent: (slug: string, mode: 'draft' | 'published') => api.get(`/pages/${slug}/content`, { params: { mode } }),
  updateContent: (slug: string, data: { content_key: string; value: any; language?: string }) => 
    api.put(`/pages/${slug}/content`, data),
  publish: (slug: string) => api.post(`/pages/${slug}/publish`),
  getAll: () => api.get('/pages'),
  create: (data: any) => api.post('/pages', data),
  delete: (id: number) => api.delete(`/pages/${id}`),
};

export default api;
