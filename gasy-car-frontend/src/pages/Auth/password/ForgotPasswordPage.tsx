import React, { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { PasswordResetRequestPayload } from "@/types/authType";
import { useRequestPasswordResetMutation } from "@/useQuery/password-query";

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
}

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();
  const requestResetMutation = useRequestPasswordResetMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Veuillez entrer votre adresse email.");
      return;
    }

    try {
      const payload: PasswordResetRequestPayload = {
        email: email.trim().toLowerCase(),
      };

      const response = await requestResetMutation.mutateAsync(payload);

      localStorage.setItem("password_reset_email", payload.email);

      navigate("/password-reset/verify", {
        state: {
          email: payload.email,
          message:
            response?.message ??
            "Un code de réinitialisation a été envoyé à votre adresse email.",
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const responseMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.error ||
        "Une erreur est survenue. Veuillez réessayer.";

      setErrorMessage(responseMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/40 to-cyan-50/40 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid gap-10 md:grid-cols-2 items-center">
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Réinitialisation sécurisée
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              Mot de passe oublié ?
            </h1>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Entrez votre adresse email pour recevoir un code sécurisé, puis choisissez un nouveau mot de passe.
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white shadow flex items-center justify-center">1</div>
              <span>Nous envoyons un code de vérification par email</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white shadow flex items-center justify-center">2</div>
              <span>Vous confirmez ce code sur une page dédiée</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white shadow flex items-center justify-center">3</div>
              <span>Vous définissez votre nouveau mot de passe</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
              <Mail className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Recevoir un code de réinitialisation
            </h2>
            <p className="text-sm text-slate-600">
              Saisissez l’adresse email associée à votre compte.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                placeholder="vous@example.com"
              />
            </div>

            {errorMessage && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-3 animate-in fade-in duration-300">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={requestResetMutation.isPending}
              className="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all disabled:opacity-60"
            >
              {requestResetMutation.isPending ? "Envoi en cours..." : "Continuer"}
              {!requestResetMutation.isPending && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;