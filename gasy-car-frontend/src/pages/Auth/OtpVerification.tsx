import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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

// Assurez-vous que ces importations sont disponibles dans votre environnement
import { useOtp } from "@/useQuery/otpUseQuery";
import { useToast } from "@/hooks/use-toast";
import { otpAPI } from "@/Actions/otpApi";
import { authAPI } from "@/Actions/authApi";
import { accessTokenKey, refreshTokenKey } from "@/helper/InstanceAxios";
import { queryClient } from "@/lib/queryClient";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { getDashboardPath } from "@/helper/routeUtils";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { verifyOtp, resendOtp } = useOtp(); // Gardé pour référence, mais les appels sont simulés

  const { data: currentUser } = useCurrentUserQuery()

  if (currentUser) {
    const destination = getDashboardPath(currentUser.role);
    navigate(destination, { replace: true });
    return null;
  }

  // --- États ---
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // État de chargement simulé
  const [isResending, setIsResending] = useState(false); // État de chargement simulé

  // --- Récupération de l'email et Nettoyage ---
  useEffect(() => {
    // Récupérer l'email depuis l'URL ou le state de navigation
    const emailstorage = localStorage.getItem("user_email");
    const emailFromParams = emailstorage ? emailstorage : "";

    interface LocationState {
      email?: string;
    }
    const state = location.state as LocationState;

    if (emailFromParams) {
      setEmail(emailFromParams);
    } else if (state && state.email) {
      setEmail(state.email);
    }
  }, [location.state]);


  // --- Compte à Rebours ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // --- Formatage du Compte à Rebours ---
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // --- Vérification OTP (Simulée) ---
  const handleVerifyOtp = async () => {

    if (otp.length !== 6) {
      toast({
        title: "Code incomplet",
        description: "Veuillez saisir les 6 chiffres du code OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await otpAPI.verifyOtp({ email, code: otp, purpose: "email_verification" });

      toast({
        title: "✅ Succès",
        description: "Le code est correct. Redirection vers la connexion...",
      });


      if (response.data.access_token && response.data.refresh_token) {
        localStorage.setItem(accessTokenKey, response.data.access_token);
        localStorage.setItem(refreshTokenKey, response.data.refresh_token);
      }

      // 🔥 Fetch and sync user data immediately to avoid UI latency
      try {
        const userRes = await authAPI.getCurrentUser();
        if (userRes?.data) {
          await queryClient.setQueryData(["currentUser"], userRes.data);
        }
      } catch (e) {
        console.error("Failed to sync user data after OTP verification:", e);
      }

      const role = response.data.role;
      const successState = { state: { message: "Votre compte a été activé avec succès." } };

      // Redirection based on role
      switch (role) {
        case "CHAUFFEUR":
          navigate("/chauffeur", successState);
          break;
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

    } catch (error) {
      toast({
        title: "⚠️ Code Invalide",
        description:
          "Le code OTP est invalide ou a expiré. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // --- Renvoyer OTP (Simulé) ---
  const handleResendOtp = async () => {
    if (isResending) return;

    setIsResending(true);

    try {
      await otpAPI.resendOtp({ email, purpose: "email_verification" });
      toast({
        title: "✅ Code Renvoyé",
        description: "Un nouveau code OTP a été envoyé à votre email.",
      });
      setCountdown(600);
      setCanResend(false);
    } catch (error) {
      toast({
        title: "⚠️ Erreur",
        description:
          "Une erreur est survenue lors de l'envoi du code. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  // --- Rendu Minimaliste et Moderne ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <Header />

      <div className="flex items-center justify-center min-h-screen py-10 pt-24 fade-in">
        <div className="container mx-auto px-4 max-w-sm">
          {/* Utilisation de glass-surface pour l'effet moderne */}
          <Card className="border-0 shadow-xl rounded-3xl glass-surface">
            <CardHeader className="text-center space-y-4 pb-6 pt-8 px-8">
              {/* Icône et Titre Centrés et Raffinés */}
              <div className="space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  Vérification Requise
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  Un code de vérification à 6 chiffres a été envoyé à
                  <br />
                  {/* Mise en évidence de l'email avec la couleur primary pour l'information */}
                  <span className="font-medium font-poppins text-primary">
                    {email}
                  </span>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              {/* OTP Input */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleVerifyOtp}
                    disabled={isVerifying}
                  >
                    <InputOTPGroup className="gap-2">
                      {[...Array(6)].map((_, index) => (
                        // Ajustement pour un style plus épuré si possible via votre InputOTPSlot
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-10 h-14 text-lg font-mono border-2 focus:border-primary transition-all duration-200"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Countdown */}
                <div className="text-center pt-2">
                  <div
                    className={`flex items-center justify-center gap-2 text-sm font-medium transition-colors ${canResend ? "text-destructive" : "text-primary"
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

              {/* Actions */}
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
                  disabled={isResending || isVerifying}
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

              {/* Informations - Bloc minimaliste */}
              <div className="bg-muted/50 border border-muted rounded-xl p-3 mt-4">
                <p className="text-xs text-muted-foreground text-center">
                  Vous ne recevez pas l'email ? Vérifiez votre dossier de spams
                  ou indésirables.
                </p>
              </div>

              {/* Retour à l'inscription */}
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
