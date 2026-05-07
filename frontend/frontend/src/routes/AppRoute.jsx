import { Routes, Route } from "react-router-dom";
import Register from "../pages/RegisterPage";
import Login from "../pages/LoginPage";
import BuyPage from "../pages/BuyPage";
import NotFound from "../pages/NotFound";
import CategoryPage from "../pages/CategoryPage";
import ProductListingPage from "../pages/ProductListingPage";
// import ForgotPasswordModal from "../components/ForgotPassword"
import ProtectedRoute from "./ProtectedRoute";
import ProductDetailPage from "../pages/ProductDetailPage";

function AppRoutes() {
  return (
      <>
      {/* <Navbar /> */}
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      <Route path="/buy" element={ <ProtectedRoute>  <BuyPage /> </ProtectedRoute>} />
       <Route path="/buy/:categorySlug" element={<ProductListingPage />} />
         <Route path="/buy/:categorySlug/:subCategorySlug" element={<ProductListingPage />} />
              <Route path="/buy/:categorySlug/:subCategorySlug/:childSlug" element={<ProductListingPage />} />
             {/* <Route path="/buy/:categoryId" element={<ProductsPage />} />
        <Route path="/buy/:categoryId/:subCategoryId" element={<ProductsPage />} /> */}
         <Route path="/buy/:slug" element={<CategoryPage />} />
           <Route path="/product/:id" element={
          <ProtectedRoute><ProductDetailPage /></ProtectedRoute>
        } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
  );
   
}

export default AppRoutes;
