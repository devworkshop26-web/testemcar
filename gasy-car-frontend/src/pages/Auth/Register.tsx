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
    if (passwordStrength === 0) return "bg-slate-200";
    if (passwordStrength <= 2) return "bg-rose-500";
    if (passwordStrength <= 4) return "bg-amber-500";
    return "bg-emerald-500";
  }, [passwordStrength]);

  const stepProgress = useMemo(() => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    return 100;
  }, [step]);

  const features = [
    { icon: <Clock className="w-5 h-5 text-white" />, text: "Service 24h/24" },
    { icon: <CreditCard className="w-5 h-5 text-white" />, text: "Paiement sécurisé" },
    { icon: <CheckCircle className="w-5 h-5 text-white" />, text: "Assurance incluse" },
    { icon: <MapPin className="w-5 h-5 text-white" />, text: "Livraison nationale" },
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
        newErrors.phone = "Numéro invalide (9 chiffres après +261)";
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
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
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

  const inputBaseClass =
    "h-12 rounded-2xl border border-slate-200 bg-white/80 shadow-[0_4px_18px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-primary/50 focus-visible:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]";

  const errorTextClass =
    "absolute left-0 top-full mt-1 text-[11px] leading-tight text-destructive";

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground font-poppins">
              Vos informations personnelles
            </h3>
            <p className="text-sm text-muted-foreground">
              Commencez par renseigner votre identité.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative pb-5">
              <Label
                htmlFor="firstName"
                className="mb-2 text-sm font-semibold text-foreground flex items-center gap-1"
              >
                <UserRound className="w-4 h-4 text-primary" /> Prénom
              </Label>
              <div className="relative group">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="firstName"
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
                    clearError("firstName");
                  }}
                  className={`${inputBaseClass} pl-11 ${errors.firstName
                      ? "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]"
                      : ""
                    }`}
                  disabled={isLoading}
                />
              </div>
              {errors.firstName && (
                <p className={errorTextClass}>{errors.firstName}</p>
              )}
            </div>

            <div className="relative pb-5">
              <Label
                htmlFor="lastName"
                className="mb-2 text-sm font-semibold text-foreground flex items-center gap-1"
              >
                <UserRound className="w-4 h-4 text-primary" /> Nom
              </Label>
              <div className="relative group">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="lastName"
                  placeholder="Dupont"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    clearError("lastName");
                  }}
                  className={`${inputBaseClass} pl-11 ${errors.lastName
                      ? "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]"
                      : ""
                    }`}
                  disabled={isLoading}
                />
              </div>
              {errors.lastName && (
                <p className={errorTextClass}>{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
            <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-primary/5 blur-2xl" />
            <p className="relative text-sm text-muted-foreground flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              Choisissez votre type de compte selon votre besoin : louer un véhicule ou proposer le vôtre.
            </p>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground font-poppins">
              Comment vous contacter
            </h3>
            <p className="text-sm text-muted-foreground">
              Nous utiliserons ces informations pour sécuriser votre compte.
            </p>
          </div>

          <div className="relative pb-5">
            <Label
              htmlFor="email"
              className="mb-2 text-sm font-semibold text-foreground flex items-center gap-1"
            >
              <Mail className="w-4 h-4 text-primary" /> Email
            </Label>
            <div className="relative group">
              <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@email.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  clearError("email");
                }}
                className={`${inputBaseClass} pl-11 ${errors.email
                    ? "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]"
                    : ""
                  }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className={errorTextClass}>{errors.email}</p>}
          </div>

          <div className="relative pb-5">
            <Label
              htmlFor="phone"
              className="mb-2 text-sm font-semibold text-foreground flex items-center gap-1"
            >
              <Phone className="w-4 h-4 text-primary" /> Téléphone
            </Label>

            <div className="relative group">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <span role="img" aria-label="Drapeau de Madagascar">
                  🇲🇬
                </span>
                +261
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="340000000"
                value={formData.phone.replace("+261", "")}
                onChange={handlePhoneChange}
                className={`${inputBaseClass} pl-[82px] ${errors.phone
                    ? "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]"
                    : ""
                  }`}
                disabled={isLoading}
              />
            </div>
            {errors.phone && <p className={errorTextClass}>{errors.phone}</p>}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground font-poppins">
            Sécurisez votre compte
          </h3>
          <p className="text-sm text-muted-foreground">
            Définissez un mot de passe fiable pour protéger votre espace.
          </p>
        </div>

        <div className="relative pb-5">
          <Label
            htmlFor="password"
            className="mb-2 text-sm font-semibold text-foreground flex items-center gap-1"
          >
            <LockKeyhole className="w-4 h-4 text-primary" /> Mot de passe
          </Label>

          <div className="relative group">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                clearError("password");
              }}
              className={`${inputBaseClass} pl-11 pr-11 ${errors.password
                  ? "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]"
                  : ""
                }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {errors.password && <p className={errorTextClass}>{errors.password}</p>}

          {formData.password && (
            <div className="pt-3">
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
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

        <div className="relative pb-5">
          <Label
            htmlFor="confirmPassword"
            className="mb-2 text-sm font-semibold text-foreground flex items-center gap-1"
          >
            <LockKeyhole className="w-4 h-4 text-primary" />
            Confirmer le mot de passe
          </Label>

          <div className="relative group">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                clearError("confirmPassword");
              }}
              className={`${inputBaseClass} pl-11 pr-11 ${errors.confirmPassword ||
                  (formData.confirmPassword &&
                    formData.password !== formData.confirmPassword)
                  ? "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]"
                  : ""
                }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword ? (
            <p className={errorTextClass}>{errors.confirmPassword}</p>
          ) : formData.confirmPassword &&
            formData.password !== formData.confirmPassword ? (
            <p className={errorTextClass}>Les mots de passe ne correspondent pas</p>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_26%),linear-gradient(to_bottom_right,#f8fbff,#eef5ff,#f8fbff)]">
      <Header />

      <div className="flex items-start justify-center min-h-screen">
        <div className="container mx-auto px-4 pt-[14vh] pb-[3vh] max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            {/* Colonne gauche */}
            <div className="hidden lg:flex lg:col-span-3">
              <div
                className="relative w-full min-h-[700px] bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/45 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_26%)]" />
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:36px_36px]" />

                <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-12 text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg font-poppins">
                        Madagasycar
                      </h1>
                      <p className="text-blue-100/90 text-base font-light drop-shadow-md">
                        Une expérience premium à Madagascar
                      </p>
                    </div>
                  </div>

                  <div className="max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md shadow-lg">
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/95">
                        Inscription guidée
                      </span>
                    </div>

                    <h2 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-2xl font-poppins">
                      Votre aventure à
                      <br />
                      <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                        Madagascar
                      </span>
                      <br />
                      commence ici.
                    </h2>

                    <p className="text-lg text-blue-50/90 leading-relaxed max-w-lg drop-shadow-md">
                      Créez votre compte en quelques étapes simples et profitez
                      d’une expérience moderne, fluide et élégante dès le départ.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-2xl">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-md shadow-lg"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                          {feature.icon}
                        </div>
                        <span className="text-sm xl:text-base font-medium text-white/95">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="flex items-center justify-center lg:col-span-2 bg-white/75 p-4 sm:p-5 lg:p-6 xl:p-8">
              <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                <CardHeader className="text-center space-y-4 pb-5">
                  <div className="space-y-2">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-lg lg:hidden">
                      <Car className="w-8 h-8 text-white" />
                    </div>

                    <CardTitle className="text-3xl font-bold text-foreground font-poppins tracking-tight">
                      Créez votre compte
                    </CardTitle>

                    <CardDescription className="text-muted-foreground text-sm sm:text-base">
                      Une inscription rapide, moderne et sécurisée.
                    </CardDescription>
                  </div>

                  <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-1 shadow-sm">
                    <div className="grid grid-cols-2 gap-1">
                      <Button
                        type="button"
                        onClick={() => setUserType("CLIENT")}
                        className={`h-9 rounded-lg px-3 text-[13px] font-semibold transition-all duration-300 ${userType === "CLIENT"
                            ? "bg-white text-primary shadow-sm border border-primary/10"
                            : "bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                          }`}
                      >
                        Client
                      </Button>

                      <Button
                        type="button"
                        onClick={() => setUserType("PRESTATAIRE")}
                        className={`h-9 rounded-lg px-3 text-[13px] font-semibold transition-all duration-300 ${userType === "PRESTATAIRE"
                            ? "bg-white text-primary shadow-sm border border-primary/10"
                            : "bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                          }`}
                      >
                        Prestataire
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      <span className={step >= 1 ? "text-primary" : ""}>Étape 1</span>
                      <span className={step >= 2 ? "text-primary" : ""}>Étape 2</span>
                      <span className={step >= 3 ? "text-primary" : ""}>Étape 3</span>
                    </div>

                    <div className="relative h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary via-blue-500 to-cyan-500 transition-all duration-500"
                        style={{ width: `${stepProgress}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div
                      className={`${step === 1
                          ? "min-h-[250px]"
                          : step === 2
                            ? "min-h-[250px]"
                            : "min-h-[300px]"
                        }`}
                    >
                      {renderStepContent()}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      {step > 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          className="h-11 rounded-2xl px-4 border-slate-200 bg-white hover:bg-slate-50"
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
                          className="flex-1 h-11 rounded-2xl text-sm font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={isLoading}
                        >
                          Continuer
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="flex-1 h-11 rounded-2xl text-sm font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
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

                    <div className="text-center pt-1">
                      <p className="text-muted-foreground text-sm">
                        Déjà membre ?{" "}
                        <Link
                          to="/login"
                          className="font-semibold text-primary hover:text-primary/80 transition-colors"
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