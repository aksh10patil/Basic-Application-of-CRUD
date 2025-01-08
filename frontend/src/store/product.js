import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  // Fetch products from the API
  fetchProducts: async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products.");
      const data = await res.json();
      set({ products: data.data });
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  },

  // Create a new product
  createProduct: async (newProduct) => {
    try {
      if (!newProduct.name || !newProduct.image || !newProduct.price) {
        return { success: false, message: "Please input all fields." };
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Failed to create product.");
      const data = await res.json();
      set((state) => ({ products: [...state.products, data.data] }));

      return { success: true, message: "Product Created Successfully" };
    } catch (error) {
      return { success: false, message: error.message || "An error occurred." };
    }
  },

  // Delete a product by ID
  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete product.");


        // updates the UI immedaitely whenever a change is made no need to referesh
      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message || "An error occurred." };
    }
  },
  updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`/api/products/${pid}`, {
        method:"PUT",
        headers:{
            "Content-Type": "application/json",
        },

        body: JSON.stringify(updatedProduct),
    });

    const data = await res.json();
    if(!data.success) return { success: false, message: data.message };


    // update the UI without refreshing again and again
    set( state => ({
        products: state.products.map(product => product._id === pid ? data.data : product)
    }));

    return { success: true, message: data.message};
  }
}));