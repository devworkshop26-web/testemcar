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
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/useQuery/authUseQuery";
import image from "@/assets/car-1.jpg";
import { videLocalStorage } from "@/helper/utils";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { getDashboardPath } from "@/helper/routeUtils";

const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (!password) return 0;

  const checks = {
    length: password.length >= 8,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  Object.values(checks).forEach((check) => {
    if (check) strength += 1;
  });

  return strength;
};

type RegisterStep = 1 | 2 | 3;
type UserRole = "CLIENT" | "PRESTATAIRE";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUserQuery();

  const [step, setStep] = useState<RegisterStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<UserRole>("CLIENT");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser) {
      const destination = getDashboardPath(currentUser.role);
      navigate(destination, { replace: true });
    }
  }, [currentUser, navigate]);

  if (currentUser) {
    return null;
  }

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const strengthColor = useMemo(() => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  }, [passwordStrength]);

  const stepProgress = useMemo(() => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    return 100;
  }, [step]);

  const features = [
    { icon: <Clock className="w-5 h-5 text-blue-100" />, text: "Service 24h/24" },
    { icon: <CreditCard className="w-5 h-5 text-blue-100" />, text: "Paiement sécurisé" },
    { icon: <CheckCircle className="w-5 h-5 text-blue-100" />, text: "Assurance incluse" },
    { icon: <MapPin className="w-5 h-5 text-blue-100" />, text: "Livraison nationale" },
  ];

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (targetStep: RegisterStep) => {
    const newErrors: Record<string, string> = {};

    if (targetStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
      if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    }

    if (targetStep === 2) {
      if (!formData.email.trim()) {
        newErrors.email = "L'email est requis";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email invalide";
      }

      const phoneDigits = formData.phone.replace("+261", "");
      if (!formData.phone.trim()) {
        newErrors.phone = "Le téléphone est requis";
      } else if (phoneDigits.length !== 9) {
        newErrors.phone =
          "Numéro invalide (9 chiffres après +261)";
      }
    }

    if (targetStep === 3) {
      if (!formData.password) {
        newErrors.password = "Le mot de passe est requis";
      } else if (formData.password.length < 8) {
        newErrors.password = "Minimum 8 caractères";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirmation requise";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword =
          "Les mots de passe ne correspondent pas";
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep(1)) setStep(2);
    if (step === 2 && validateStep(2)) setStep(3);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let value = rawValue.replace(/\D/g, "");

    if (value.startsWith("0")) {
      value = value.substring(1);
    }

    if (value.length > 9) return;

    const formatted = value.length > 0 ? `+261${value}` : "";
    setFormData({ ...formData, phone: formatted });
    clearError("phone");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);

    if (!step1Valid) {
      setStep(1);
      return;
    }
    if (!step2Valid) {
      setStep(2);
      return;
    }
    if (!step3Valid) {
      setStep(3);
      return;
    }

    videLocalStorage();

    const form = {
      email: formData.email.trim(),
      password: formData.password,
      password_confirm: formData.confirmPassword,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      phone: formData.phone,
      role: userType,
    };

    setIsLoading(true);

    try {
      const response = await register.mutateAsync(form);

      localStorage.setItem("user_email", response.data.email);

      navigate("/otp-verification", {
        state: { email: response.data.email },
      });
    } catch (error: any) {
      const apiErrors: Record<string, string> = {};

      if (error.response?.data?.email) {
        apiErrors.email = error.response.data.email[0];
        setStep(2);
      }

      if (error.response?.data?.password) {
        apiErrors.password = error.response.data.password[0];
        setStep(3);
      }

      if (error.response?.data?.password_confirm) {
        apiErrors.confirmPassword = error.response.data.password_confirm[0];
        setStep(3);
      }

      if (error.response?.data?.first_name) {
        apiErrors.firstName = error.response.data.first_name[0];
        setStep(1);
      }

      if (error.response?.data?.last_name) {
        apiErrors.lastName = error.response.data.last_name[0];
        setStep(1);
      }

      if (error.response?.data?.phone) {
        apiErrors.phone = error.response.data.phone[0];
        setStep(2);
      }

      setErrors((prev) => ({ ...prev, ...apiErrors }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground font-poppins">
              Vos informations personnelles
            </h3>
            <p className="text-sm text-muted-foreground">
              Commencez par renseigner votre identité.
            </p>
          </div>

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
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  clearError("firstName");
                }}
                className={`h-11 rounded-xl transition-all ${
                  errors.firstName ? "border-destructive" : "border-border"
                }`}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-destructive text-xs">{errors.firstName}</p>
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
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  clearError("lastName");
                }}
                className={`h-11 rounded-xl transition-all ${
                  errors.lastName ? "border-destructive" : "border-border"
                }`}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-destructive text-xs">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-muted/40 border border-border/60 p-4">
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5" />
              Choisissez votre type de compte selon votre besoin : louer un véhicule ou proposer le vôtre.
            </p>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground font-poppins">
              Comment vous contacter
            </h3>
            <p className="text-sm text-muted-foreground">
              Nous utiliserons ces informations pour sécuriser votre compte.
            </p>
          </div>

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
                clearError("email");
              }}
              className={`h-11 rounded-xl transition-all ${
                errors.email ? "border-destructive" : "border-border"
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-semibold text-foreground flex items-center gap-1"
            >
              <Phone className="w-4 h-4 text-primary" /> Téléphone
            </Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 flex items-center gap-1 text-sm text-muted-foreground">
                <span role="img" aria-label="Drapeau de Madagascar">
                  🇲🇬
                </span>{" "}
                +261
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="340000000"
                value={formData.phone.replace("+261", "")}
                onChange={handlePhoneChange}
                className={`h-11 rounded-xl pl-20 transition-all ${
                  errors.phone ? "border-destructive" : "border-border"
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.phone && (
              <p className="text-destructive text-xs">{errors.phone}</p>
            )}
          </div>

          {/* <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
            <p className="text-sm text-blue-700">
              Un code de vérification sera envoyé à votre adresse email après l’inscription.
            </p>
          </div> */}
        </div>
      );
    }

    return (
      <div className="space-y-5 animate-in fade-in duration-300">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground font-poppins">
            Sécurisez votre compte
          </h3>
          <p className="text-sm text-muted-foreground">
            Définissez un mot de passe fiable pour protéger votre espace.
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-semibold text-foreground flex items-center gap-1"
          >
            <LockKeyhole className="w-4 h-4 text-primary" /> Mot de passe
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                clearError("password");
              }}
              className={`h-11 rounded-xl pr-10 transition-all ${
                errors.password ? "border-destructive" : "border-border"
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
            <p className="text-destructive text-xs">{errors.password}</p>
          )}

          {formData.password && (
            <div className="pt-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strengthColor}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-secondary" />
                Force du mot de passe :{" "}
                {passwordStrength === 0
                  ? "Aucune"
                  : passwordStrength <= 2
                  ? "Faible"
                  : passwordStrength <= 4
                  ? "Moyenne"
                  : "Forte"}{" "}
                ({passwordStrength}/5)
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-foreground flex items-center gap-1"
          >
            <LockKeyhole className="w-4 h-4 text-primary" />
            Confirmer le mot de passe
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                clearError("confirmPassword");
              }}
              className={`h-11 rounded-xl pr-10 transition-all ${
                errors.confirmPassword ||
                (formData.confirmPassword &&
                  formData.password !== formData.confirmPassword)
                  ? "border-destructive"
                  : "border-border"
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
            <p className="text-destructive text-xs">
              {errors.confirmPassword}
            </p>
          )}
          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword &&
            !errors.confirmPassword && (
              <p className="text-destructive text-xs">
                Les mots de passe ne correspondent pas
              </p>
            )}
        </div>

        {/* <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
          <p className="text-sm text-emerald-700">
            Après création du compte, vous serez redirigé vers la vérification OTP.
          </p>
        </div> */}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-100">
      <Header />

      <div className="flex items-center justify-center min-h-screen py-8 lg:py-0 fade-in">
        <div className="container mx-auto px-4 pt-[15vh] pb-[5vh] max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-2xl min-h-[760px]">
            {/* Colonne gauche */}
            <div className="hidden lg:flex lg:col-span-3">
              <div
                className="relative w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
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

                  <div className="max-w-xl space-y-6">
                    <h2 className="text-5xl font-bold leading-tight tracking-wide text-white drop-shadow-2xl font-poppins">
                      Votre aventure à <br />
                      <span className="text-primary drop-shadow-lg">
                        Madagascar
                      </span>{" "}
                      commence ici.
                    </h2>
                    <p className="text-lg text-blue-50 leading-relaxed font-poppins font-medium max-w-lg drop-shadow-md">
                      Créez votre compte en quelques étapes simples et profitez d’une expérience premium dès le départ.
                    </p>
                  </div>

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

            {/* Colonne droite */}
            <div className="flex items-center justify-center lg:col-span-2 bg-background p-6 lg:p-10">
              <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg lg:hidden mb-4">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-foreground font-poppins">
                      Créez votre compte
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-base font-roboto">
                      {/* Une inscription guidée pour une meilleure expérience. */}
                    </CardDescription>
                  </div>

                  {/* Choix du rôle */}
                  <div className="flex space-x-2 p-1 bg-muted rounded-xl">
                    <Button
                      type="button"
                      onClick={() => setUserType("CLIENT")}
                      className={`flex-1 h-10 text-sm font-semibold rounded-lg transition-all duration-300 ${
                        userType === "CLIENT"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-transparent text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      {/* <User className="w-4 h-4 mr-2" /> */}
                      Client
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setUserType("PRESTATAIRE")}
                      className={`flex-1 h-10 text-sm font-semibold rounded-lg transition-all duration-300 ${
                        userType === "PRESTATAIRE"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-transparent text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      {/* <Car className="w-4 h-4 mr-2" /> */}
                      Prestataire
                    </Button>
                  </div>

                  {/* Progression */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                      <span className={step >= 1 ? "text-primary" : ""}>Étape 1</span>
                      <span className={step >= 2 ? "text-primary" : ""}>Étape 2</span>
                      <span className={step >= 3 ? "text-primary" : ""}>Étape 3</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-500"
                        style={{ width: `${stepProgress}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-8">
                  <form onSubmit={handleRegister} className="space-y-6">
                    {/* Zone fixe */}
                    <div className="min-h-[420px]">
                      {renderStepContent()}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      {step > 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          className="h-11 rounded-xl px-4"
                          disabled={isLoading}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Retour
                        </Button>
                      ) : (
                        <div className="w-[110px]" />
                      )}

                      {step < 3 ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="flex-1 h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={isLoading}
                        >
                          Continuer
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="flex-1 h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={isLoading}
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
                      )}
                    </div>

                    {/* Login link */}
                    <div className="text-center pt-1">
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