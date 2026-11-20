import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ApiError } from "./types/api-error";

import Navbar from "./components/layout/Navbar";

import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,

      retry: (failureCount, error) => {
        // Do not retry client errors such as 400, 404 or 409.
        if (
          error instanceof ApiError &&
          error.status !== undefined &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }

        // Retry temporary failures once.
        return failureCount < 1;
      },

      refetchOnWindowFocus: true,
    },

    mutations: {
      retry: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <Routes>
            <Route path="/" element={<ProductsPage />} />

            <Route path="/products/:id" element={<ProductDetailsPage />} />

            <Route path="/admin/products" element={<AdminProductsPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
