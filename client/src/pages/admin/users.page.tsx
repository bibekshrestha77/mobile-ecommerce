import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiMoreVertical, FiUser } from "react-icons/fi";
import NavBar from "../../components/header";
import toast from "react-hot-toast";

// Mock user data - replace with actual API call
const mockUsers = [
  { _id: "1", first_name: "John", last_name: "Doe", email: "john@example.com", role: "USER", createdAt: "2026-08-15" },
  { _id: "2", first_name: "Jane", last_name: "Smith", email: "jane@example.com", role: "ADMIN", createdAt: "2026-08-10" },
  { _id: "3", first_name: "Bob", last_name: "Johnson", email: "bob@example.com", role: "USER", createdAt: "2026-07-22" },
  { _id: "4", first_name: "Alice", last_name: "Brown", email: "alice@example.com", role: "USER", createdAt: "2026-07-15" },
  { _id: "5", first_name: "Charlie", last_name: "Wilson", email: "charlie@example.com", role: "USER", createdAt: "2026-06-30" },
];

const AdminUsersPage = () => {
  const [search, setSearch] = useState("");

  // TODO: Replace with actual API call
  const { data: users = mockUsers, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockUsers;
    },
  });

  const filteredUsers = users.filter((user: any) =>
    user.first_name.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (_userId: string, newRole: string) => {
    // TODO: Implement role change API
    toast.success(`Role changed to ${newRole}`);
  };

  const handleDelete = async (_userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    // TODO: Implement delete API
    toast.success("User deleted successfully");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users</h1>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user: any) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete user"
                          >
                            <FiMoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminUsersPage;