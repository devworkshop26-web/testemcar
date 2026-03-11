import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Clock, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { otpAPI } from "@/Actions/otpApi";

interface LocationState {
  email?: string;
  message?: string;
}

export default function PasswordResetVerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const state = location.state as LocationState | null;
    const emailFromStorage = localStorage.getItem("password_reset_email") || "";

    if (state?.email) {
      setEmail(state.email);
      localStorage.setItem("password_reset_email", state.email);
      return;
    }

    if (emailFromStorage) {
      setEmail(emailFromStorage);
      return;
    }

    navigate("/forgot-password", { replace: true });
  }, [location.state, navigate]);

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

  const handleVerifyCode = async () => {
    if (isVerifying) return;

    if (!email) {
      navigate("/forgot-password", { replace: true });
      return;
    }

    if (otp.length !== 6) {
      toast({
        title: "Code incomplet",
        description: "Veuillez saisir les 6 chiffres du code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const response = await otpAPI.verifyPasswordResetOtp({
        email,
        code: otp,
        purpose: "password_reset",
      });

      if (!response.data.verified || !response.data.reset_token) {
        throw new Error(response.data.error || "Code invalide.");
      }

      localStorage.setItem("password_reset_email", email);
      localStorage.setItem("password_reset_token", response.data.reset_token);

      toast({
        title: "Code confirmé",
        description: "Vous pouvez maintenant définir un nouveau mot de passe.",
      });

      navigate("/password-reset/new", {
        state: {
          email,
          reset_token: response.data.reset_token,
        },
      });
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Le code est invalide ou expiré.";

      toast({
        title: "Vérification impossible",
        description: backendMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || isResending || !email) return;

    setIsResending(true);

    try {
      const response = await otpAPI.resendOtp({
        email,
        purpose: "password_reset",
      });

      toast({
        title: "Code renvoyé",
        description: response.data.message || "Un nouveau code a été envoyé.",
      });

      setOtp("");
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Impossible de renvoyer le code.";

      toast({
        title: "Erreur",
        description: backendMessage,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50/40 to-emerald-50/40 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-sky-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Vérifiez votre code
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Un code de réinitialisation a été envoyé à
              <br />
              <span className="font-semibold text-sky-700">{email}</span>
            </p>
          </div>

          <div className="space-y-5">
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
                      className="w-11 h-14 text-lg font-mono border-2 rounded-xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="text-center">
              <div
                className={`inline-flex items-center gap-2 text-sm font-medium ${
                  canResend ? "text-red-500" : "text-sky-600"
                }`}
              >
                <Clock className="w-4 h-4" />
                {canResend
                  ? "Code expiré. Vous pouvez en demander un nouveau."
                  : `Expire dans ${formatCountdown(countdown)}`}
              </div>
            </div>

            <Button
              onClick={handleVerifyCode}
              disabled={otp.length !== 6 || isVerifying || isResending}
              className="w-full h-12 rounded-2xl bg-sky-600 hover:bg-sky-700 transition-all"
            >
              {isVerifying ? "Vérification..." : "Valider le code"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={!canResend || isResending || isVerifying}
              className="w-full h-12 rounded-2xl"
            >
              {isResending ? (
                "Renvoi en cours..."
              ) : (
                <span className="inline-flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Renvoyer le code
                </span>
              )}
            </Button>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-xs text-slate-500 text-center">
              Vérifiez aussi vos spams ou courriers indésirables.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}