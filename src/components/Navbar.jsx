import { Link } from "react-router-dom";

export default function Navbar() {
    const userEmail = localStorage.getItem('gavel_user');

    function handleLogout() {
        localStorage.removeItem('gavel_token');
        localStorage.removeItem('gavel_user');
        window.location.reload();
    }

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                
                <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div className="w-10 h-10 bg-gradient-to-tr from-gavel-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                        <span className="text-xl">🔨</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">Gavel</span>
                </Link>

                <div className="flex items-center gap-6">
                    {userEmail ? (
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/create"
                                className="hidden sm:flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700"
                            >
                                <span>+</span> New Auction
                            </Link>

                            <div className="h-6 w-px bg-gray-800 mx-2 hidden sm:block"></div>

                            <span className="text-sm text-gray-400 hidden md:block">
                                Hello, <span className="text-white font-medium">{userEmail}</span>
                            </span>
                            <button 
                                onClick={handleLogout}
                                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-all"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}