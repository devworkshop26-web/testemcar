import AllCars from "@/pages/AllCars";
import Login from "@/pages/Auth/Login";
import OtpVerification from "@/pages/Auth/OtpVerification";
import Register from "@/pages/Auth/Register";
import BecomeOwner from "@/pages/BecomeOwner";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import FAQ from "@/pages/FAQ";
import MessagingHostArticlePage from "@/pages/help-center/MessagingHostArticlePage";
import CancelTripHostArticlePage from "@/pages/help-center/CancelTripHostArticlePage";
import HelpPlaceholderArticlePage from "@/pages/help-center/HelpPlaceholderArticlePage";
import HelpPlaceholderCategoryPage from "@/pages/help-center/HelpPlaceholderCategoryPage";
import HowItWorksPage from "@/pages/HowItWorks";
import Index from "@/pages/Index";
import { Route } from "react-router-dom";
import PasswordResetPage from "@/pages/Auth/password/PasswordResetPage";
import PasswordResetVerifyCodePage from "@/pages/Auth/password/PasswordResetVerifyCodePage";
import ChangePasswordPage from "@/pages/Auth/password/ChangePasswordPage";
import ForgotPasswordPage from "@/pages/Auth/password/ForgotPasswordPage";
import Layout from "@/pages/Layout/Layout";
import ReservationPage from "@/pages/Reservation/ReservationPage";
import SearchResults from "@/pages/SearchResults";
import VehiculeCategory from "@/pages/VehiculeCategoryPage";
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
        <Route path="/devenir-hote" element={<BecomeOwner />} />
        <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route
          path="/faq/messagerie-avec-votre-hote"
          element={<MessagingHostArticlePage />}
        />
        <Route
          path="/faq/annuler-voyage-avec-votre-hote"
          element={<CancelTripHostArticlePage />}
        />
        <Route
          path="/faq/article/:slug"
          element={<HelpPlaceholderArticlePage />}
        />
        <Route
          path="/faq/categorie/:slug"
          element={<HelpPlaceholderCategoryPage />}
        />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/reservations/:carId" element={<ReservationPage />} />
        <Route path="/reservation/:id" element={<ReservationsPage />} />
        <Route
          path="/reservation-form/:vehicleId"
          element={<ReservationFormPage />}
        />
        <Route
          path="/reservation-payment/:reservationId"
          element={<ReservationPaymentPage />}
        />
      </Route>

      {/* Routes sans Layout (Auth) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp-verification" element={<OtpVerification />} />

      {/* Password reset flow */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/password-reset/verify" element={<PasswordResetVerifyCodePage />} />
      <Route path="/password-reset/new" element={<PasswordResetPage />} />
      <Route path="/password-change" element={<ChangePasswordPage />} />
    </>
  );
};