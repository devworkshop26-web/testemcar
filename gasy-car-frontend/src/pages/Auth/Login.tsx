// src/pages/Login.tsx
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Car,
  CheckCircle,
  MapPin,
  Clock,
  CreditCard,
  Mail,
  LockKeyhole,
  LogIn,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { authAPI } from "@/Actions/authApi";
import { accessTokenKey, refreshTokenKey } from "@/helper/InstanceAxios";
import { getDashboardPath } from "@/helper/routeUtils";
import image from "@/assets/hero-2.jpg";
import { videLocalStorage } from "@/helper/utils";
import { queryClient } from "@/lib/queryClient";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUserQuery();

  if (currentUser) {
    const destination = getDashboardPath(currentUser.role);
    return <Navigate to={destination} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    videLocalStorage();

    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format d'email invalide";

    if (!formData.password) newErrors.password = "Le mot de passe est requis";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      const { access_token, refresh_token, user } = response.data;

      localStorage.setItem(accessTokenKey, access_token);
      localStorage.setItem(refreshTokenKey, refresh_token);

      await queryClient.setQueryData(["currentUser"], user);

      const successState = {
        state: { message: "Connexion réussie." },
      };

      const destination = getDashboardPath(user.role);
      navigate(destination, { ...successState, replace: true });
    } catch (error: any) {
      console.error("❌ Erreur de connexion :", error);

      let message = "Une erreur est survenue lors de la connexion.";

      if (error.response) {
        if (typeof error.response.data === "string") {
          message = error.response.data;
        } else if (error.response.data?.detail) {
          message = error.response.data.detail;
        } else if (error.response.data?.message) {
          message = error.response.data.message;
        } else if (error.response.data?.non_field_errors) {
          message = error.response.data.non_field_errors[0];
        } else if (error.response.data?.error) {
          message = error.response.data.error;
        }
      } else if (error.request) {
        message =
          "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
      }

      setLoginError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      text: "Service 24h/24",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-white" />,
      text: "Paiement sécurisé",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      text: "Assurance incluse",
    },
    {
      icon: <MapPin className="w-5 h-5 text-white" />,
      text: "Livraison nationale",
    },
  ];

  const inputBaseClass =
    "h-11 rounded-2xl border border-slate-200 bg-white/80 shadow-[0_4px_18px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-primary/50 focus-visible:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]";

  const errorTextClass =
    "absolute left-0 top-full mt-1 text-[11px] leading-tight text-destructive";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_26%),linear-gradient(to_bottom_right,#f8fbff,#eef5ff,#f8fbff)]">
      <Header />

      <div className="flex min-h-screen items-start justify-center">
        <div className="container mx-auto max-w-7xl px-4 pt-[14vh] pb-[3vh]">
          <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-5">
            {/* Colonne gauche */}
            <div className="hidden lg:col-span-3 lg:flex">
              <div
                className="relative min-h-[700px] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/45 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_26%)]" />
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:36px_36px]" />

                <div className="absolute inset-0 flex flex-col justify-between p-8 text-white xl:p-10">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="font-poppins text-4xl font-bold tracking-tight text-white drop-shadow-lg">
                        Madagasycar
                      </h1>
                      <p className="text-sm font-light text-blue-100/90 drop-shadow-md">
                        Une expérience premium à Madagascar
                      </p>
                    </div>
                  </div>

                  <div className="max-w-xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md shadow-lg">
                      <Sparkles className="h-4 w-4 text-emerald-300" />
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/95">
                        Heureux de vous revoir
                      </span>
                    </div>

                    <h2 className="font-poppins text-5xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-2xl xl:text-6xl">
                      Heureux de vous
                      <br />
                      <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                        revoir
                      </span>
                      <br />
                      parmi nous.
                    </h2>

                    <p className="max-w-lg text-base leading-relaxed text-blue-50/90 drop-shadow-md">
                      Accédez à votre espace personnel pour gérer vos
                      réservations, retrouver vos véhicules favoris et profiter
                      d’une expérience fluide et élégante.
                    </p>
                  </div>

                  <div className="grid max-w-2xl grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md shadow-lg"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                          {feature.icon}
                        </div>
                        <span className="text-sm font-medium text-white/95">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="flex items-center justify-center bg-white/75 p-4 sm:p-5 lg:col-span-2 lg:p-6 xl:p-8">
              <Card className="w-full max-w-md border-none bg-transparent shadow-none">
                <CardHeader className="space-y-3 pb-4 text-center">
                  <div className="space-y-1.5">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-lg lg:hidden">
                      <Car className="h-7 w-7 text-white" />
                    </div>

                    <CardTitle className="font-poppins text-3xl font-bold tracking-tight text-foreground">
                      Connexion
                    </CardTitle>

                    <CardDescription className="text-sm text-muted-foreground sm:text-[15px]">
                      Entrez vos identifiants pour accéder à votre compte.
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="pb-5">
                  <form onSubmit={handleLogin} className="space-y-3">
                    {/* Zone fixe pour erreur globale */}
                    <div className="relative min-h-[52px]">
                      {loginError && (
                        <div className="absolute inset-x-0 top-0 animate-in fade-in slide-in-from-top-1 duration-300 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive shadow-sm">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <div>
                              <p className="text-[12px] font-semibold">Erreur</p>
                              <p className="text-[11px] leading-relaxed">
                                {loginError}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="relative pb-5">
                      <Label
                        htmlFor="email"
                        className="mb-2 flex items-center gap-1 text-sm font-semibold text-foreground"
                      >
                        Email
                      </Label>

                      <div className="group relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="jean.dupont@email.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.email;
                                return next;
                              });
                            }
                          }}
                          className={`${inputBaseClass} pl-11 ${
                            errors.email
                              ? "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]"
                              : ""
                          }`}
                          disabled={isLoading}
                        />
                      </div>

                      {errors.email && (
                        <p className={errorTextClass}>{errors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="relative pb-5">
                      <div className="mb-2 flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="flex items-center gap-1 text-sm font-semibold text-foreground"
                        >
                          Mot
                          de passe
                        </Label>

                        <Link
                          to="/forgot-password"
                          className="text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
                        >
                          Mot de passe oublié ?
                        </Link>
                      </div>

                      <div className="group relative">
                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            });
                            if (errors.password) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.password;
                                return next;
                              });
                            }
                          }}
                          className={`${inputBaseClass} pl-11 pr-11 ${
                            errors.password
                              ? "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]"
                              : ""
                          }`}
                          disabled={isLoading}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:text-foreground"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {errors.password && (
                        <p className={errorTextClass}>{errors.password}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-sm font-semibold shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Connexion...
                        </div>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Se connecter
                        </>
                      )}
                    </Button>

                    <div className="pt-1 text-center">
                      <p className="text-sm text-muted-foreground">
                        Pas encore de compte ?{" "}
                        <Link
                          to="/register"
                          className="font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                          Créer un compte
                        </Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;