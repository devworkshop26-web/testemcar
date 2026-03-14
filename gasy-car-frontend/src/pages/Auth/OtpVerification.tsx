import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, Clock, ArrowLeft, CheckCircle, RotateCcw } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { otpAPI } from "@/Actions/otpApi";
import { authAPI } from "@/Actions/authApi";
import { accessTokenKey, refreshTokenKey } from "@/helper/InstanceAxios";
import { queryClient } from "@/lib/queryClient";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { getDashboardPath } from "@/helper/routeUtils";

interface LocationState {
  email?: string;
}

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const { data: currentUser } = useCurrentUserQuery();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Redirection si déjà connecté
  useEffect(() => {
    if (currentUser) {
      const destination = getDashboardPath(currentUser.role);
      navigate(destination, { replace: true });
    }
  }, [currentUser, navigate]);

  // Charger l'email
  useEffect(() => {
    const emailFromStorage = localStorage.getItem("user_email") || "";
    const state = location.state as LocationState | null;

    if (emailFromStorage) {
      setEmail(emailFromStorage);
      return;
    }

    if (state?.email) {
      setEmail(state.email);
      localStorage.setItem("user_email", state.email);
      return;
    }

    toast({
      title: "Email introuvable",
      description: "Veuillez recommencer l'inscription.",
      variant: "destructive",
    });
    navigate("/register", { replace: true });
  }, [location.state, navigate, toast]);

  // Compte à rebours
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, canResend]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyOtp = async () => {
    if (isVerifying) return;

    if (!email) {
      toast({
        title: "Email manquant",
        description: "Veuillez recommencer l'inscription.",
        variant: "destructive",
      });
      navigate("/register", { replace: true });
      return;
    }

    if (otp.length !== 6) {
      toast({
        title: "Code incomplet",
        description: "Veuillez saisir les 6 chiffres du code OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const response = await otpAPI.verifyOtp({
        email,
        code: otp,
        purpose: "email_verification",
      });

      console.log("OTP verify response:", response.data);

      if (!response.data.verified) {
        throw new Error(response.data.error || "Code OTP invalide.");
      }

      if (response.data.access_token && response.data.refresh_token) {
        localStorage.setItem(accessTokenKey, response.data.access_token);
        localStorage.setItem(refreshTokenKey, response.data.refresh_token);
      }

      localStorage.removeItem("user_email");

      try {
        const userRes = await authAPI.getCurrentUser();
        if (userRes?.data) {
          queryClient.setQueryData(["currentUser"], userRes.data);
        }
      } catch (e) {
        console.error("Failed to sync user data after OTP verification:", e);
      }

      toast({
        title: "✅ Succès",
        description: response.data.message || "Votre compte a été activé avec succès.",
      });

      const role = response.data.role;
      const successState = {
        state: { message: "Votre compte a été activé avec succès." },
      };

      switch (role) {
        case "ADMIN":
          navigate("/admin", successState);
          break;
        case "PRESTATAIRE":
          navigate("/prestataire", successState);
          break;
        case "CLIENT":
          navigate("/client", successState);
          break;
        case "SUPPORT":
          navigate("/support", successState);
          break;
        default:
          navigate("/client", successState);
      }
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      console.error("OTP response data:", error?.response?.data);
      console.error("OTP status:", error?.response?.status);

      const backendMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Le code OTP est invalide ou a expiré. Veuillez réessayer.";

      toast({
        title: "⚠️ Vérification impossible",
        description: backendMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (isResending || !email) return;

    setIsResending(true);

    try {
      const response = await otpAPI.resendOtp({
        email,
        purpose: "email_verification",
      });

      toast({
        title: "✅ Code renvoyé",
        description:
          response.data.message || "Un nouveau code OTP a été envoyé à votre email.",
      });

      setOtp("");
      setCountdown(600);
      setCanResend(false);
    } catch (error: any) {
      console.error("OTP resend failed:", error);
      console.error("OTP resend response:", error?.response?.data);

      const backendMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Une erreur est survenue lors de l'envoi du code.";

      toast({
        title: "⚠️ Erreur",
        description: backendMessage,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <Header />

      <div className="flex items-center justify-center min-h-screen py-10 pt-24 fade-in">
        <div className="container mx-auto px-4 max-w-sm">
          <Card className="border-0 shadow-xl rounded-3xl glass-surface">
            <CardHeader className="text-center space-y-4 pb-6 pt-8 px-8">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  Vérification requise
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  Un code de vérification à 6 chiffres a été envoyé à
                  <br />
                  <span className="font-medium font-poppins text-primary">
                    {email}
                  </span>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    disabled={isVerifying}
                  >
                    <InputOTPGroup className="gap-2">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-10 h-14 text-lg font-mono border-2 focus:border-primary transition-all duration-200"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="text-center pt-2">
                  <div
                    className={`flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                      canResend ? "text-destructive" : "text-primary"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>
                      {canResend
                        ? "Code expiré. Renvoyez-le."
                        : `Expire dans ${formatCountdown(countdown)}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || isVerifying || isResending}
                  className="w-full h-11 text-sm font-semibold rounded-xl btn-primary shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Vérification...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Vérifier le code
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleResendOtp}
                  disabled={!canResend || isResending || isVerifying}
                  variant="outline"
                  className="w-full h-11 text-sm font-medium rounded-xl border-2 border-muted hover:border-primary/50 hover:bg-secondary/10 transition-all duration-300 text-muted-foreground hover:text-primary"
                >
                  {isResending ? (
                    "Renvoyer en cours..."
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Renvoyer le code
                    </div>
                  )}
                </Button>
              </div>

              <div className="bg-muted/50 border border-muted rounded-xl p-3 mt-4">
                <p className="text-xs text-muted-foreground text-center">
                  Vous ne recevez pas l'email ? Vérifiez vos spams ou renvoyez un nouveau code.
                </p>
              </div>

              <Button
                onClick={() => navigate("/register")}
                variant="ghost"
                className="w-full h-11 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à l'inscription
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;