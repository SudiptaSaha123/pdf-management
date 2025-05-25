import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            to={token ? "/dashboard" : "/"}
            className="flex items-center space-x-2.5 cursor-pointer"
          >
            <div className="relative text-blue-600">
              <svg
                className="h-8 w-8"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="4" width="24" height="24" rx="6" className="fill-blue-600" />
                <path
                  d="M11 12H21M11 16H21M11 20H17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M19 20H21"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>
            </div>
            <span className="text-lg font-medium bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              PDF Manager
            </span>
          </Link>

          {token && (
            <div className="flex items-center space-x-6">
              <span className="hidden text-sm text-gray-500 md:block">
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none active:bg-red-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
