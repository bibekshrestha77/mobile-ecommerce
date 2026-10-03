import { Link, useLocation } from "react-router";
import { FiLogIn } from "react-icons/fi";

/** Detects the backend's 401 response shape: { status: "fail", message: "Unauthorized..." } */
export const isAuthError = (error: any) =>
  error?.status === "fail" && /unauthorized/i.test(error?.message || "");

interface AuthRequiredProps {
  title?: string;
  message?: string;
}

/**
 * Shown when a page requires authentication but the user is not logged in.
 * Redirects to /login while preserving the current path for post-login redirect.
 */
const AuthRequired = ({ title = "Please sign in", message }: AuthRequiredProps) => {
  const location = useLocation();

  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiLogIn className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 mb-8">
        {message || "You need to be signed in to view this page."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/login"
          state={{ from: location.pathname }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          state={{ from: location.pathname }}
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default AuthRequired;
