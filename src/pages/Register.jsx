import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post('/Auth', formData);
      
      alert('Account created successfully!');
      navigate('/login'); 
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 
                  err.response?.data?.title || 
                  'Error creating account. Please check your details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-gavel-green/30">
      <Navbar />

      <div className="pt-32 pb-20 px-6 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-md w-full bg-[#121212] rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join Gavel to start bidding today.</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  maxLength={50}
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gavel-green focus:ring-1 focus:ring-gavel-green transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  maxLength={50}
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gavel-green focus:ring-1 focus:ring-gavel-green transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gavel-green focus:ring-1 focus:ring-gavel-green transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gavel-green focus:ring-1 focus:ring-gavel-green transition-all"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gavel-green focus:ring-1 focus:ring-gavel-green transition-all"
                placeholder="Repeat password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-black transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-6
                ${loading ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-white hover:bg-gavel-green hover:text-white shadow-lg shadow-white/5'}`}
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-gray-500 text-center mt-8 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-gavel-green hover:text-emerald-400 font-medium hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}