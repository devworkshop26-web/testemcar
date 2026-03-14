import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReservationPricingConfigQuery, useReservationQuery, useUpdateReservationMutation } from "@/useQuery/reservationsUseQuery";
import { useCreateReservationPaymentMutation, useSendPaymentLink } from "@/useQuery/useReservationPayment";
import { useModePaymentsQuery } from "@/useQuery/modePaymentUseQuery";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Upload, FileText, RefreshCw, Check, Smartphone, Monitor, Send } from "lucide-react";
import { toast } from "sonner";
import { ModePayment } from "@/types/modePayment";
import { useAuthContext } from "@/contexts/AuthContext";

const generatePaymentRef = (methodName: string) => {
  const prefix = methodName.toUpperCase().substring(0, 4);
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `REF-${prefix}-${rand}`;
};

const ReservationPaymentPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthContext();

  const { data: reservation, isLoading: isLoadingReservation } = useReservationQuery(reservationId);
  const { data: pricingConfig } = useReservationPricingConfigQuery();
  const { data: paymentModes } = useModePaymentsQuery();
  const createPayment = useCreateReservationPaymentMutation();
  const updateReservation = useUpdateReservationMutation();
  const sendPaymentLink = useSendPaymentLink();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [selectedPaymentMode, setSelectedPaymentMode] = useState<ModePayment | null>(null);
  const [paymentRef, setPaymentRef] = useState<string>("");

  const [paymentChoice, setPaymentChoice] = useState<"web" | "phone" | null>(null);
  const [linkSent, setLinkSent] = useState(false);

  useEffect(() => {
    if (selectedPaymentMode) {
      setPaymentRef(generatePaymentRef(selectedPaymentMode.name));
    }
  }, [selectedPaymentMode]);

  useEffect(() => {
    if (!reservation?.created_at || paymentChoice === "phone") return;

    const calculateTimeLeft = () => {
      const created = new Date(reservation.created_at!).getTime();
      const now = new Date().getTime();
      const expiresAt = created + 15 * 60 * 1000;
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        return;
      }

      setTimeLeft(diff);
      setIsExpired(false);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [reservation?.created_at, paymentChoice]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!reservation || !proofFile || !selectedPaymentMode) {
      toast.error("Veuillez sélectionner un mode de paiement et télécharger une preuve.");
      return;
    }

    createPayment.mutate(
      {
        reservation: reservation.id,
        mode: selectedPaymentMode.id,
        reason: paymentRef,
        proof_image: proofFile,
      },
      {
        onSuccess: () => {
          toast.success("Paiement envoyé pour validation !");
          const destination =
            role === "PRESTATAIRE"
              ? `/prestataire/bookings/${reservation.id}`
              : `/client/booking/${reservation.id}`;
          navigate(`${destination}#payment-details`);
        },
        onError: (error: any) => {
          let errorMessage = "Erreur lors de l'envoi du paiement.";

          if (error?.response?.data) {
            const errorData = error.response.data;

            if (errorData.detail) {
              errorMessage = errorData.detail;
              if (errorData.error) {
                errorMessage += ` - ${errorData.error}`;
              }
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          }

          toast.error(errorMessage);
        },
      }
    );
  };

  const handleCancel = () => {
    if (!reservation) return;
    updateReservation.mutate(
      {
        id: reservation.id,
        payload: { status: "CANCELLED" },
      },
      {
        onSuccess: () => {
          toast.info("Réservation annulée.");
          navigate("/");
        },
      }
    );
  };

  const handleSendLink = () => {
    if (!selectedPaymentMode || !reservationId) {
      toast.error("Veuillez sélectionner un mode de paiement.");
      return;
    }

    sendPaymentLink.mutate(
      {
        methode_payment: selectedPaymentMode.id,
        reservation_id: reservationId,
      },
      {
        onSuccess: () => {
          toast.success("Lien de paiement envoyé !");
          setLinkSent(true);
        },
        onError: (error: any) => {
          let errorMessage = "Erreur lors de l'envoi.";

          if (error?.response?.data) {
            const errorData = error.response.data;

            if (errorData.detail) {
              errorMessage = errorData.detail;
              if (errorData.error) {
                errorMessage += ` - ${errorData.error}`;
              }
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          }

          toast.error(errorMessage);
        },
      }
    );
  };

  const handleExtend = () => {
    setIsExpired(false);
    toast.success("Temps prolongé de 15 minutes.");
  };

  const paymentAmounts = useMemo(() => {
    if (!reservation) {
      return {
        baseAmount: 0,
        optionsAmount: 0,
        serviceFee: 0,
        cautionAmount: 0,
        totalToPayNow: 0,
      };
    }

    const baseAmount = Number(reservation.base_amount ?? 0) || 0;
    const rawOptionsAmount = Number(reservation.options_amount ?? 0) || 0;
    const equipmentOptionsAmount = (reservation.equipments_data ?? []).reduce(
      (sum, equipment) => sum + (Number(equipment.price ?? 0) || 0) * (Number(reservation.total_days ?? 1) || 1),
      0
    );
    const optionsAmount = Math.max(rawOptionsAmount, equipmentOptionsAmount);

    const cautionAmount = Number(reservation.caution_amount ?? 0) || 0;
    const apiTotalAmount = Number(reservation.total_amount ?? 0) || 0;

    const configuredServiceFee = Number(pricingConfig?.service_fee ?? 5000) || 0;
    const computedWithoutCaution = baseAmount + optionsAmount + configuredServiceFee;

    const totalToPayNow = Math.max(
      apiTotalAmount,
      computedWithoutCaution,
      baseAmount + optionsAmount
    );

    return {
      baseAmount,
      optionsAmount,
      serviceFee: Math.max(0, totalToPayNow - baseAmount - optionsAmount),
      cautionAmount,
      totalToPayNow,
    };
  }, [reservation, pricingConfig?.service_fee]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (isLoadingReservation) {
    return <div className="p-10 text-center">Chargement...</div>;
  }

  if (!reservation) {
    return <div className="p-10 text-center text-red-500">Réservation introuvable.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 relative">
      {isExpired && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">Temps écoulé !</h2>
              <p className="text-slate-600 mt-2">
                Le délai de 15 minutes pour effectuer le paiement est dépassé.
                Votre réservation risque d'être annulée.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleExtend}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-lg"
              >
                Demander 15 min de plus
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Annuler la réservation
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Paiement Sécurisé</h1>
          <p className="text-slate-600">
            Paiement pour la réservation <span className="font-bold text-slate-900">{reservation.reference}</span>
          </p>
        </div>

        <div className={`bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex items-center justify-between ${paymentChoice === "phone" ? "opacity-50" : ""}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentChoice === "phone" ? "bg-slate-100" : "bg-blue-50"}`}>
              <Clock className={`w-6 h-6 ${paymentChoice === "phone" ? "text-slate-400" : "text-blue-600"}`} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {paymentChoice === "phone" ? "Compte à rebours désactivé" : "Temps restant"}
              </p>
              <p className="text-xs text-slate-500">
                {paymentChoice === "phone" ? "Paiement via téléphone" : "Pour confirmer votre place"}
              </p>
            </div>
          </div>
          <div className={`text-3xl font-mono font-bold ${paymentChoice === "phone" ? "text-slate-400" : "text-blue-600"}`}>
            {paymentChoice === "phone" ? "∞" : (timeLeft !== null ? formatTime(timeLeft) : "--:--")}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
          <h2 className="text-xl font-bold">Sélectionnez votre mode de paiement</h2>

          <div className="grid grid-cols-1 gap-3">
            {paymentModes?.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedPaymentMode(mode)}
                className={`flex items-center gap-3 p-4 rounded-xl border transition ${selectedPaymentMode?.id === mode.id
                  ? "border-primary bg-primary/10"
                  : "border-slate-200 hover:border-primary/50"
                  }`}
              >
                {mode.image ? (
                  <img src={mode.image} className="h-10 w-10 object-contain" alt={mode.name} />
                ) : (
                  <span className="text-2xl">💵</span>
                )}
                <div className="text-left flex-1">
                  <span className="font-medium block">{mode.name}</span>
                  <span className="text-xs text-slate-500">{mode.operateur || mode.description}</span>
                </div>
                {selectedPaymentMode?.id === mode.id && (
                  <Check className="text-primary w-5 h-5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedPaymentMode && !paymentChoice && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold">Comment souhaitez-vous payer ?</h2>
            <p className="text-slate-600 text-sm">
              Choisissez de payer maintenant sur cette page ou de recevoir un lien sur votre téléphone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentChoice("web")}
                className="group relative p-6 rounded-2xl border-2 border-slate-200 hover:border-primary transition-all bg-gradient-to-br from-white to-slate-50 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Monitor className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Sur cette page</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Téléchargez votre preuve maintenant
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentChoice("phone")}
                className="group relative p-6 rounded-2xl border-2 border-slate-200 hover:border-primary transition-all bg-gradient-to-br from-white to-slate-50 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Smartphone className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Sur mon téléphone</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Recevez un lien par email/SMS
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {selectedPaymentMode && paymentChoice === "phone" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Paiement sur téléphone</h2>
                <p className="text-sm text-slate-500">Recevez le lien de paiement</p>
              </div>
            </div>

            {!linkSent ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-sm text-blue-900">
                    Un lien de paiement sera envoyé à votre adresse email. Vous pourrez compléter le paiement depuis votre téléphone à tout moment.
                  </p>
                </div>

                <Button
                  onClick={handleSendLink}
                  disabled={sendPaymentLink.isPending}
                  className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20"
                >
                  {sendPaymentLink.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Envoyer le lien de paiement
                    </div>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setPaymentChoice(null)}
                  className="w-full h-12 rounded-2xl"
                >
                  Retour aux options
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 bg-green-50 rounded-2xl border border-green-200 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-green-900 text-lg mb-2">Lien envoyé avec succès !</h3>
                  <p className="text-sm text-green-700">
                    Vérifiez votre email et complétez le paiement depuis votre téléphone.
                  </p>
                </div>

                <Button
                  onClick={handleSendLink}
                  disabled={sendPaymentLink.isPending}
                  variant="outline"
                  className="w-full h-12 rounded-2xl"
                >
                  {sendPaymentLink.isPending ? "Envoi..." : "Renvoyer le lien"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="w-full h-12 rounded-2xl"
                >
                  Retour à l'accueil
                </Button>
              </div>
            )}
          </div>
        )}

        {selectedPaymentMode && paymentChoice === "web" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Détails du paiement
              </h2>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4 items-start">
                <div className="bg-amber-100 p-2 rounded-full shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-amber-800">Important : Motif du paiement</p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Lors de votre transfert ou dépôt <b>{selectedPaymentMode.name}</b>, vous <span className="underline">devez</span> saisir la référence ci-dessous dans le champ <b>"Motif"</b> ou <b>"Communication"</b>.
                    Cela nous permet de valider votre réservation instantanément.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-100">
                <div className="space-y-2 pb-4 border-b border-slate-200">
                  <div className="flex justify-between items-center text-sm text-slate-600">
                    <span>Location</span>
                    <span>{paymentAmounts.baseAmount.toLocaleString()} Ar</span>
                  </div>
                  {paymentAmounts.optionsAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span>Options</span>
                      <span>+{paymentAmounts.optionsAmount.toLocaleString()} Ar</span>
                    </div>
                  )}
                  {paymentAmounts.serviceFee > 0 && (
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span>Frais de service</span>
                      <span>+{paymentAmounts.serviceFee.toLocaleString()} Ar</span>
                    </div>
                  )}
                  {paymentAmounts.cautionAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-emerald-700">
                      <span>Caution à déposer séparément</span>
                      <span>{paymentAmounts.cautionAmount.toLocaleString()} Ar</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-200">
                    <span className="text-slate-600 font-semibold">Montant à payer maintenant</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {paymentAmounts.totalToPayNow.toLocaleString()} Ar
                    </span>
                  </div>
                  {paymentAmounts.cautionAmount > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <p className="text-sm text-emerald-800 font-medium">
                        La caution de {paymentAmounts.cautionAmount.toLocaleString()} Ar n’est pas incluse dans ce paiement.
                      </p>
                      <p className="text-xs text-emerald-700 mt-1">
                        Elle sera déposée séparément lors de la remise du véhicule.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {selectedPaymentMode.image ? (
                      <img src={selectedPaymentMode.image} alt={selectedPaymentMode.name} className="h-10 object-contain" />
                    ) : (
                      <span className="text-2xl">💵</span>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">{selectedPaymentMode.name}</p>
                      <p className="text-xs text-slate-500">Méthode choisie</p>
                    </div>
                  </div>

                  <div className="bg-white border rounded-xl p-4 space-y-2">
                    {selectedPaymentMode.numero && <p><b>Numéro :</b> {selectedPaymentMode.numero}</p>}
                    {selectedPaymentMode.operateur && <p><b>Opérateur :</b> {selectedPaymentMode.operateur}</p>}

                    <div className="pt-2 border-t border-slate-100 mt-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Référence à utiliser (Motif) :</p>
                          <p className="font-mono font-bold text-xl text-primary">
                            {paymentRef}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-lg text-slate-400 hover:text-primary bg-slate-50"
                          onClick={() => {
                            navigator.clipboard.writeText(paymentRef);
                            toast.success("Référence copiée !");
                          }}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {selectedPaymentMode.description && (
                    <p className="text-xs text-slate-500">
                      {selectedPaymentMode.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Upload className="w-5 h-5 text-slate-400" />
                Preuve de paiement (Requis)
              </h2>

              <p className="text-sm text-slate-600">
                Veuillez télécharger une capture d'écran ou une photo de votre reçu de transfert pour valider votre réservation.
              </p>

              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:bg-slate-50 transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preuve"
                      className="max-h-64 mx-auto rounded-xl shadow-md"
                    />
                    <div
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-slate-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProofFile(null);
                        setPreviewUrl(null);
                      }}
                    >
                      <RefreshCw className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-900">Cliquez ici pour ajouter votre preuve</p>
                    <p className="text-sm text-slate-500">Format accepté : PNG, JPG, PDF (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={createPayment.isPending || !proofFile || !selectedPaymentMode}
              className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20"
            >
              {createPayment.isPending ? "Envoi en cours..." : "Confirmer le paiement"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationPaymentPage;