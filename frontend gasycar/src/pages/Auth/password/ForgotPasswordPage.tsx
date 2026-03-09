import React, { useState } from "react";
import { AxiosError } from "axios";
import { PasswordResetRequestPayload } from "@/types/authType";
import { usePasswordResetMutation } from "@/useQuery/password-query";

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
}

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const passwordResetMutation = usePasswordResetMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Veuillez entrer votre adresse email.");
      return;
    }

    try {
      const payload: PasswordResetRequestPayload = { email: email.trim() };
      const response = await passwordResetMutation.mutateAsync(payload);
      const message =
        response?.message ??
        "Si un compte existe avec cette adresse, un email de réinitialisation vous a été envoyé.";
      setSuccessMessage(message);
      setEmail("");
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid gap-12 md:grid-cols-2 items-center">

        {/* --- LEFT SECTION (white theme) --- */}
        <div className="space-y-6 text-slate-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"
              aria-hidden
            />
            <span className="font-semibold text-emerald-700 tracking-wide">
              GasyCar
            </span>
            <span className="text-slate-500">Sécurité & fiabilité</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Mot de passe oublié ?
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              GasyCar sécurise l’accès à votre compte pour que vous puissiez
              reprendre la route en toute tranquillité.
            </p>
          </div>

          <ul className="space-y-3">
            {[
              "Processus sécurisé et chiffré",
              "Aucune donnée sensible stockée",
              "Support rapide en cas de besoin",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-slate-700 text-sm md:text-base leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- RIGHT CARD: FORM --- */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Réinitialiser mon mot de passe
            </h2>
            <p className="text-sm text-slate-600">
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
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
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                placeholder="vous@example.com"
              />
            </div>

            {errorMessage && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={passwordResetMutation.isPending}
              className="w-full inline-flex justify-center items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {passwordResetMutation.isPending
                ? "Envoi en cours..."
                : "Envoyer le lien de réinitialisation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
