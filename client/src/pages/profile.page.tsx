import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { getMe, logout, updateProfile } from "../api/auth.api";
import { getOrders } from "../api/order.api";
import { getWishlist } from "../api/wishlist.api";
import NavBar from "../components/header";
import AuthRequired, { isAuthError } from "../components/auth-required";
import toast from "react-hot-toast";
import { mediaUrl } from "../utils/media";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getMe,
  });
  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: getOrders, enabled: Boolean(data?.data) });
  const wishlistQuery = useQuery({ queryKey: ["wishlist"], queryFn: getWishlist, enabled: Boolean(data?.data) });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProfile({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
      }),
    onSuccess: (response) => {
      toast.success(response.message || "Profile updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      navigate("/");
      toast.success("You’re signed out");
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Couldn’t sign out. Try again."),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!formData.last_name.trim()) {
      toast.error("Last name is required");
      return;
    }
    updateMutation.mutate();
  };

  if (isLoading) {
    return (
      <main className="site-shell">
        <NavBar />
        <div className="section-wrap profile-layout">
          <div className="animate-pulse space-y-4 pt-8">
            <div className="product-skeleton-line" />
            <div className="product-skeleton" style={{ height: "300px" }} />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="site-shell">
        <NavBar />
        <div className="section-wrap section-space profile-layout">
          <h1 className="page-title">My Profile</h1>
          {isAuthError(error) ? (
            <AuthRequired
              title="Sign in to view your profile"
              message="Access your account details, orders and settings by signing in."
            />
          ) : (
            <div className="empty-state">
              <h2 style={{ color: "var(--red)" }}>Error loading profile</h2>
              <p>
                {error instanceof Error ? error.message : "Please try again later"}
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  const user = data?.data;
  const displayedData = isEditing ? formData : {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  };

  return (
    <main className="site-shell">
      <NavBar />

      <div className="section-wrap section-space profile-layout">
        <span className="section-eyebrow">Your PhoneVault account</span>
        <h1 className="page-title" style={{ marginBottom: 25 }}>My profile</h1>

        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-banner">
            <div className="flex items-center gap-4">
              <div className="profile-avatar">
                {user?.profile_image?.path ? (
                  <img
                    src={mediaUrl(user.profile_image.path)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-10 h-10 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-blue-100">{user?.email}</p>
                <span className="profile-role">
                  {user?.role}
                </span>
              </div>
            </div>
            <button type="button" className="button-outline profile-logout" disabled={logoutMutation.isPending} onClick={() => logoutMutation.mutate()}>
              <FiLogOut /> {logoutMutation.isPending ? "Signing out…" : "Sign out"}
            </button>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold ">Personal Information</h3>
              <button
                type="button"
                onClick={() => {
                  if (!isEditing) {
                    setFormData({
                      first_name: user?.first_name || "",
                      last_name: user?.last_name || "",
                      email: user?.email || "",
                      phone: user?.phone || "",
                    });
                  }
                  setIsEditing((editing) => !editing);
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {isEditing ? (
                  <>
                    <FiX className="w-4 h-4" /> Cancel
                  </>
                ) : (
                  <>
                    <FiEdit2 className="w-4 h-4" /> Edit
                  </>
                )}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium  mb-1">First Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
                  <input
                    type="text"
                    name="first_name"
                    value={displayedData.first_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium  mb-1">Last Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
                  <input
                    type="text"
                    name="last_name"
                    value={displayedData.last_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium  mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
                  <input
                    type="email"
                    name="email"
                    value={displayedData.email}
                    onChange={handleChange}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium  mb-1">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
                  <input
                    type="tel"
                    name="phone"
                    value={displayedData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  <FiSave className="w-4 h-4" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>

          {/* Account Stats */}
          <div className="profile-activity">
            <h3>Keep an eye on your finds</h3>
            <div className="profile-stats">
              <Link to="/orders" className="profile-stat">
                <strong>{ordersQuery.data?.data.length ?? 0}</strong><span>Orders placed</span>
              </Link>
              <Link to="/wishlist" className="profile-stat">
                <strong>{Array.isArray(wishlistQuery.data?.data) ? wishlistQuery.data.data.length : 0}</strong><span>Saved finds</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;