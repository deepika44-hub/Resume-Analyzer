import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register, login, getMe } from '../api/client'

export default function Register() {
  const [form, setForm]       = useState({ full_name: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      // Step 1: Register
      await register(form)

      // Step 2: Login to get token
      const { data: tokenData } = await login({
        email: form.email,
        password: form.password,
      })

      // Step 3: Save token FIRST before calling getMe
      localStorage.setItem('token', tokenData.access_token)

      // Step 4: Now fetch user profile (token is already in localStorage)
      const { data: userData } = await getMe()

      // Step 5: Update auth context and redirect
      loginUser(tokenData.access_token, userData)
      navigate('/')
    } catch (err) {
      // Clear token if something went wrong
      localStorage.removeItem('token')
      const msg = err.response?.data?.detail
      if (msg === 'Email already registered') {
        setError('This email is already registered. Please log in instead.')
      } else {
        setError(msg || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">
          <h1>Resume<span>AI</span></h1>
          <p>Create your free account</p>
        </div>
        <div className="card">
          <h2 style={{ marginBottom: 24, fontSize: 20 }}>Get started</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="input"
                placeholder="Jane Doe"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}