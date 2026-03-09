// src/pages/Register.tsx
import { useState, useMemo, useEffect } from "react";
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
  User,
  Car,
  Shield,
  CheckCircle,
  MapPin,
  Clock,
  CreditCard,
  Mail,
  Phone,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/useQuery/authUseQuery";
import image from "@/assets/car-1.jpg";
import { videLocalStorage } from "@/helper/utils";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { getDashboardPath } from "@/helper/routeUtils";


// --- Fonction utilitaire pour évaluer la force du mot de passe (sans librairie externe)
const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (!password) return 0;

  // Critères de force
  const checks = {
    length: password.length >= 8,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  // 1 point par critère rempli (max 5)
  Object.values(checks).forEach(check => {
    if (check) strength += 1;
  });

  return strength; // Retourne un nombre entre 0 et 5
};
// ---

const Register = () => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Nouveau state
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"CLIENT" | "PRESTATAIRE" | "ADMIN">("CLIENT");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    user_type: userType,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Calcule si le formulaire est rempli (pour désactiver le bouton)
  const isFormFilled = useMemo(() => {
    return (
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.phone.trim() !== ""
    );
  }, [formData]);

  // Calcule la force du mot de passe
  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const { data: currentUser } = useCurrentUserQuery()

  useEffect(() => {
    if (currentUser) {
      const destination = getDashboardPath(currentUser.role);
      navigate(destination, { replace: true });
    }
  }, [currentUser, navigate]);

  if (currentUser) {
    return null;
  }

  // Détermine la couleur de la barre de progression
  const strengthColor = useMemo(() => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength <= 2) return "bg-red-500"; // Faible
    if (passwordStrength <= 4) return "bg-yellow-500"; // Moyen
    return "bg-green-500"; // Fort (5/5)
  }, [passwordStrength]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // vide le localstorage
    videLocalStorage()
    // VALIDATION FORMULAIRE (le tien)
    let hasError = false;

    // email
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide";

    // password
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 8)
      newErrors.password = "Minimum 8 caractères";

    // confirm password
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirmation requise";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    // first name
    if (!formData.firstName) newErrors.firstName = "Le prénom est requis";

    // last name
    if (!formData.lastName) newErrors.lastName = "Le nom est requis";

    // phone
    const phoneDigits = formData.phone.replace("+261", "");
    if (phoneDigits.length !== 9)
      newErrors.phone = "Numéro invalide (doit comporter 9 chiffres après +261)";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // ---- Form final envoyé à l'API ----
    const form = {
      email: formData.email,
      password: formData.password,
      password_confirm: formData.confirmPassword,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      role: userType
    };

    setIsLoading(true);

    try {

      const response = await register.mutateAsync(form);


      const userId = response?.data?.id;
      localStorage.setItem("user_email", response.data.email);
      navigate("/otp-verification", {
        state: { email: response.data.email }
      });

    } catch (error: any) {
      console.error("Registration failed:", error);

      const apiErrors: Record<string, string> = {};

      if (error.response?.data?.email)
        apiErrors.email = error.response.data.email[0];

      if (error.response?.data?.password)
        apiErrors.password = error.response.data.password[0];

      setErrors(prev => ({ ...prev, ...apiErrors }));

    } finally {
      setIsLoading(false);
    }
  };


  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Étape 1 : Nettoyer la saisie pour ne garder QUE les chiffres
    const rawValue = e.target.value;
    let value = rawValue.replace(/\D/g, "");

    // Si le numéro commence par '0', on l'enlève (règle Madagascar +261)
    if (value.startsWith("0")) {
      value = value.substring(1);
    }

    // Limiter la longueur à 9 chiffres (format Madagascar standard après +261)
    if (value.length > 9) return;

    // Stocker le numéro formaté avec le préfixe +261 SANS ESPACE
    const formatted = value.length > 0 ? `+261${value}` : "";

    setFormData({ ...formData, phone: formatted });

    // Clear error if it exists
    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const features = [
    { icon: <Clock className="w-5 h-5 text-blue-100" />, text: "Service 24h/24" },
    { icon: <CreditCard className="w-5 h-5 text-blue-100" />, text: "Paiement sécurisé" },
    { icon: <CheckCircle className="w-5 h-5 text-blue-100" />, text: "Assurance incluse" },
    { icon: <MapPin className="w-5 h-5 text-blue-100" />, text: "Livraison nationale" },
  ];

  // Le bouton est désactivé si chargement OU si le formulaire n'est pas rempli OU s'il y a des erreurs de validation
  const isFormValid = isFormFilled && Object.keys(errors).length === 0 && (formData.password === formData.confirmPassword) && (formData.password.length >= 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-100">
      <Header />

      <div className="flex items-center justify-center min-h-screen py-8 lg:py-0 fade-in">
        <div className="container mx-auto px-4 pt-[15vh] pb-[5vh] max-w-7xl h-auto lg:h-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-2xl">
            {/* Colonne gauche - Image et Contenu marketing (3/5) */}
            <div className="hidden lg:flex lg:col-span-3">
              <div className="relative w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
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
                      Votre aventure à <br />
                      <span className="text-primary drop-shadow-lg">
                        Madagascar
                      </span> commence ici.
                    </h2>
                    <p className="text-lg text-blue-50 leading-relaxed font-poppins font-medium max-w-lg drop-shadow-md">
                      Découvrez l'île rouge en toute sérénité avec notre flotte
                      de véhicules premium et un service client inégalé.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-6 max-w-2xl">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-primary/40 shadow-lg">
                          {feature.icon}
                        </div>
                        <span className="text-lg font-mefium text-white drop-shadow-md font-roboto">
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
              {/* Le card n'est pas trop large en hauteur car il suit la hauteur de son contenu */}
              <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold text-foreground font-poppins">
                      Créez votre compte
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-base font-roboto">
                      Rejoignez Madagasycar en tant que client ou prestataire.
                    </CardDescription>
                  </div>
                  Client
                  {/* Sélecteur de rôle Client / Prestataire */}
                  <div className="flex space-x-2 p-1 bg-muted rounded-xl">
                    <Button
                      type="button"
                      onClick={() => setUserType("CLIENT")}
                      className={`flex-1 h-10 text-sm font-semibold rounded-lg transition-all duration-300 ${userType === "CLIENT"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-transparent text-muted-foreground hover:bg-muted/70"
                        }`}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Client
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setUserType("PRESTATAIRE")}
                      className={`flex-1 h-10 text-sm font-semibold rounded-lg transition-all duration-300 ${userType === "PRESTATAIRE"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-transparent text-muted-foreground hover:bg-muted/70"
                        }`}
                    >
                      <Car className="w-4 h-4 mr-2" />
                      Prestataire
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 pb-8">
                  <form onSubmit={handleRegister} className="space-y-5">
                    {/* Nom et Prénom */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-semibold text-foreground flex items-center gap-1"
                        >
                          <UserRound className="w-4 h-4 text-primary" /> Prénom
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="Jean"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          className={`h-10 text-sm rounded-xl border transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 
                            ${errors.firstName
                              ? "border-destructive"
                              : "border-border"
                            }`}
                          disabled={isLoading}
                        />
                        {errors.firstName && (
                          <p className="text-destructive text-xs mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-semibold text-foreground flex items-center gap-1"
                        >
                          <UserRound className="w-4 h-4 text-primary" /> Nom
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Dupont"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          className={`h-10 text-sm rounded-xl border transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 
                            ${errors.lastName
                              ? "border-destructive"
                              : "border-border"
                            }`}
                          disabled={isLoading}
                        />
                        {errors.lastName && (
                          <p className="text-destructive text-xs mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

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
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });

                          if (errors.email) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.email;
                              return newErrors;
                            });
                          }
                        }}
                        className={`h-10 text-sm rounded-xl border transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 
                              ${errors.email ? "border-destructive" : "border-border"}
                            `}
                        disabled={isLoading}
                      />

                      {errors.email && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Téléphone avec Drapeau Malgache */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-foreground flex items-center gap-1"
                      >
                        <Phone className="w-4 h-4 text-primary" /> Téléphone
                      </Label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 flex items-center gap-1 text-sm text-muted-foreground">
                          {/* Drapeau de Madagascar */}
                          <span role="img" aria-label="Drapeau de Madagascar">🇲🇬</span> +261
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="3400000000"
                          value={formData.phone.replace('+261', '')}
                          onChange={handlePhoneChange}
                          className={`h-10 text-sm rounded-xl border pl-20 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 
                            ${errors.phone
                              ? "border-destructive"
                              : "border-border"
                            }`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Mot de passe */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-semibold text-foreground flex items-center gap-1"
                      >
                        <LockKeyhole className="w-4 h-4 text-primary" /> Mot de
                        passe
                      </Label>
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
                              // Effacer la confirmation si le mot de passe change
                              confirmPassword: formData.confirmPassword,
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

                      {/* Bar de progression de la force du mot de passe */}
                      {formData.password && (
                        <div className="mt-1">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${strengthColor}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Shield className="w-3 h-3 text-secondary" />
                            Force du mot de passe : {
                              passwordStrength === 0 ? "Aucune" :
                                passwordStrength <= 2 ? "Faible" :
                                  passwordStrength <= 4 ? "Moyenne" :
                                    "Forte"
                            } ({passwordStrength}/5)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirmer le mot de passe (NOUVEAU) */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-semibold text-foreground flex items-center gap-1"
                      >
                        <LockKeyhole className="w-4 h-4 text-primary" /> Confirmer
                        le mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className={`h-10 text-sm pr-10 rounded-xl border transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 
                            ${errors.confirmPassword ||
                              (formData.confirmPassword && formData.password !== formData.confirmPassword)
                              ? "border-destructive"
                              : "border-border"
                            }`}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                      {(formData.confirmPassword && formData.password !== formData.confirmPassword && !errors.confirmPassword) && (
                        <p className="text-destructive text-xs mt-1">
                          Les mots de passe ne correspondent pas
                        </p>
                      )}
                    </div>


                    {/* Bouton d'inscription principal */}
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-semibold rounded-xl btn-primary shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mt-6"
                      disabled={isLoading || !isFormFilled || !isFormValid} // Désactivation améliorée
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Création du compte...
                        </div>
                      ) : (
                        <>
                          <User className="w-4 h-4 mr-2" />
                          Créer mon compte
                        </>
                      )}
                    </Button>

                    {/* Section alternative avec Google */}
                    {/* <div className="space-y-4 pt-2">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-3 bg-background text-muted-foreground text-xs font-medium">
                            OU CONTINUER AVEC
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 text-sm font-medium rounded-xl border-2 border-border hover:border-primary/50 hover:bg-muted/70 transition-all duration-300 flex items-center justify-center gap-3 text-foreground"
                        disabled={isLoading}
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
                        S'inscrire avec Google
                      </Button>
                    </div> */}

                    {/* Lien de connexion */}
                    <div className="text-center pt-2">
                      <p className="text-muted-foreground text-sm font-roboto">
                        Déjà membre ?{" "}
                        <Link
                          to="/login"
                          className="text-primary hover:text-primary/80 font-medium transition-colors font-poppins"
                        >
                          Se connecter
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

export default Register;