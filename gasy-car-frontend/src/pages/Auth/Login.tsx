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
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
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
  const location = useLocation();

  const { data: currentUser } = useCurrentUserQuery()


  if (currentUser) {
    const destination = getDashboardPath(currentUser.role);
    return <Navigate to={destination} replace />;
  }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // vide le localstorage 
    videLocalStorage();

    // Validation
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




      // add tokens to local storage
      localStorage.setItem(accessTokenKey, access_token);
      localStorage.setItem(refreshTokenKey, refresh_token);

      // 🔥 IMMEDIATELY update the query cache to avoid UI latency (e.g., in the Header)
      await queryClient.setQueryData(["currentUser"], user);

      const successState = {
        state: { message: "Connexion réussie." },
      };

      // redirect based on role or intended destination
      const destination = getDashboardPath(user.role);



      // navigate(destination);
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
      icon: <Clock className="w-5 h-5 text-blue-100" />,
      text: "Service 24h/24",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-blue-100" />,
      text: "Paiement sécurisé",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-blue-100" />,
      text: "Assurance incluse",
    },
    {
      icon: <MapPin className="w-5 h-5 text-blue-100" />,
      text: "Livraison nationale",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-100">
      <Header />

      <div className="flex items-center justify-center min-h-screen py-8 lg:py-0 fade-in">
        <div className="container mx-auto px-4 pt-[15vh] pb-[5vh] max-w-7xl h-auto lg:h-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-2xl">
            {/* Colonne gauche - Image et Contenu marketing (3/5) */}
            <div className="hidden lg:flex lg:col-span-3">
              <div
                className="relative w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              >
                {/* Overlay gradient pour un look premium et un meilleur contraste */}
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent"></div>

                <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
                  {/* Header (Logo) */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg font-poppins">
                        Madagasycar
                      </h1>
                      <p className="text-blue-200 text-lg font-roboto font-light drop-shadow-md">
                        Excellence Automobile
                      </p>
                    </div>
                  </div>

                  {/* Contenu principal */}
                  <div className="max-w-xl space-y-6">
                    <h2 className="text-5xl font-bold leading-tight tracking-wide text-white drop-shadow-2xl font-poppins">
                      Heureux de vous <br />
                      <span className="text-primary drop-shadow-lg">
                        revoir
                      </span>{" "}
                      parmi nous.
                    </h2>
                    <p className="text-lg text-blue-50 leading-relaxed font-poppins font-medium max-w-lg drop-shadow-md">
                      Accédez à votre espace personnel pour gérer vos
                      réservations et retrouver vos véhicules favoris.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-6 max-w-2xl">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-primary/40 shadow-lg">
                          {feature.icon}
                        </div>
                        <span className="text-lg font-medium text-white drop-shadow-md font-roboto">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Formulaire (2/5) */}
            <div className="flex items-center justify-center lg:col-span-2 bg-background p-6 lg:p-10">
              <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg lg:hidden mb-4">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-foreground font-poppins">
                      Connexion
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-base font-roboto">
                      Entrez vos identifiants pour accéder à votre compte.
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pb-8">
                  <form onSubmit={handleLogin} className="space-y-5">
                    {loginError && (
                      <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>
                          {loginError}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-foreground flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4 text-primary" /> Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jean.dupont@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`h-10 text-sm rounded-xl border transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 
                          ${errors.email
                            ? "border-destructive"
                            : "border-border"
                          }`}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Mot de passe */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label
                          htmlFor="password"
                          className="text-sm font-semibold text-foreground flex items-center gap-1"
                        >
                          <LockKeyhole className="w-4 h-4 text-primary" /> Mot
                          de passe
                        </Label>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          Mot de passe oublié ?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className={`h-10 text-sm pr-10 rounded-xl border transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 
                            ${errors.password
                              ? "border-destructive"
                              : "border-border"
                            }`}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Bouton de connexion */}
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Connexion...
                        </div>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Se connecter
                        </>
                      )}
                    </Button>

                    {/* Séparateur */}
                    {/* <div className="relative pt-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-background text-muted-foreground text-xs font-medium uppercase">
                          Ou continuer avec
                        </span>
                      </div>
                    </div> */}

                    {/* Bouton Google */}
                    {/* <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 text-sm font-medium rounded-xl border-2 border-border hover:border-primary/50 hover:bg-muted/50 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button> */}

                    {/* Lien d'inscription */}
                    <div className="text-center pt-2">
                      <p className="text-muted-foreground text-sm">
                        Pas encore de compte ?{" "}
                        <Link
                          to="/register"
                          className="text-primary hover:text-primary/80 font-medium transition-colors"
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
