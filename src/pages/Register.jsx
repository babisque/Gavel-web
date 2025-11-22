import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

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
      navigate('/'); 
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create your account</h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">First Name</label>
              <input
                name="firstName"
                type="text"
                required
                maxLength={50}
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Last Name</label>
              <input
                name="lastName"
                type="text"
                required
                maxLength={50}
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
                placeholder="Smith"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
              placeholder="Repeat your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 px-4 rounded text-white mt-6 transition duration-200
              ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}`}
          >
            {loading ? 'Creating account...' : 'REGISTER'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}