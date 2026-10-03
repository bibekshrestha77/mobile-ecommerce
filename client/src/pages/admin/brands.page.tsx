import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../../api/brand.api";
import type { Brand } from "../../api/brand.api";
import NavBar from "../../components/header";
import toast from "react-hot-toast";
import { mediaUrl } from "../../utils/media";

const AdminBrandsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: () => getBrands({ limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return createBrand(data);
    },
    onSuccess: () => {
      toast.success("Brand created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create brand");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      return updateBrand(id, data);
    },
    onSuccess: () => {
      toast.success("Brand updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update brand");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => {
      toast.success("Brand deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete brand");
    },
  });

  const openModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({ name: brand.name, description: brand.description });
    } else {
      setEditingBrand(null);
      setFormData({ name: "", description: "" });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setFormData({ name: "", description: "" });
    setImageFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand._id, data: formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      deleteMutation.mutate(id);
    }
  };

  const brands = data?.data && Array.isArray(data.data) ? data.data : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Brands</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Add Brand
          </button>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-16 text-red-500">
              Error loading brands
            </div>
          ) : brands.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">
              No brands found
            </div>
          ) : (
            brands.map((brand) => (
              <div key={brand._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {brand.image?.path ? (
                    <img
                      src={mediaUrl(brand.image.path)}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">{brand.name}</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{brand.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{brand.description}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(brand)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingBrand ? "Edit Brand" : "Create Brand"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {editingBrand?.image?.path && (
                  <div className="mt-2">
                    <img
                      src={mediaUrl(editingBrand.image.path)}
                      alt="Current"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingBrand
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminBrandsPage;