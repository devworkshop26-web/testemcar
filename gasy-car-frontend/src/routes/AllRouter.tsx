import AllCars from "@/pages/AllCars";
import Login from "@/pages/Auth/Login";
import OtpVerification from "@/pages/Auth/OtpVerification";
import Register from "@/pages/Auth/Register";
import BecomeOwner from "@/pages/BecomeOwner";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import FAQ from "@/pages/FAQ";
import HowItWorksPage from "@/pages/HowItWorks";
import Index from "@/pages/Index";
import VehicleDetail from "@/pages/VehicleDetail";
import { Route, Routes } from "react-router-dom";
import PasswordResetPage from "@/pages/Auth/password/PasswordResetPage";
import ChangePasswordPage from "@/pages/Auth/password/ChangePasswordPage";
import ForgotPasswordPage from "@/pages/Auth/password/ForgotPasswordPage";
import Layout from "@/pages/Layout/Layout";
import ReservationPage from "@/pages/Reservation/ReservationPage";
import SearchResults from "@/pages/SearchResults";
import VehiculeCategory from "@/pages/VehiculeCategoryPage";
// import BlogDetailPage from "@/components/blog/BlogDetailPage";
import ReservationFormPage from "@/pages/Reservation/ReservationFormPage";
import ReservationPaymentPage from "@/pages/Reservation/ReservationPaymentPage";
import ReservationsPage from "@/pages/Reservation/ReservationsPage";

export const AllRoutes = () => {
  return (
    <>
      {/* Routes avec Layout (Header + Footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/vehicule/:id" element={<ReservationsPage />} />
        <Route path="/category/:id" element={<VehiculeCategory />} />
        <Route path="/allCars" element={<AllCars />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/devenir-proprietaire" element={<BecomeOwner />} />
        <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/reservations/:carId" element={<ReservationPage />} />
        <Route path="/reservation/:id" element={<ReservationsPage />} />
        <Route path="/reservation-form/:vehicleId" element={<ReservationFormPage />} />
        <Route path="/reservation-payment/:reservationId" element={<ReservationPaymentPage />} />
      </Route>

      {/* Routes sans Layout (Auth) - PROTECTED FOR AUTHENTICATED USERS */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      {/* password */}
      <Route path="/password-reset" element={<PasswordResetPage />} />
      <Route path="/password-change" element={<ChangePasswordPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

    </>
  );
}
