import axios from 'axios'

const api = axios.create({ baseURL: '' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const register       = (data) => api.post('/auth/register', data)
export const login          = (data) => api.post('/auth/login', data)
export const getMe          = ()     => api.get('/auth/me')
export const analyzeResume  = (fd)   => api.post('/resume/analyze', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getHistory     = ()     => api.get('/resume/history')
export const getAnalysis    = (id)   => api.get(`/resume/history/${id}`)
export const deleteAnalysis = (id)   => api.delete(`/resume/history/${id}`)

export default api