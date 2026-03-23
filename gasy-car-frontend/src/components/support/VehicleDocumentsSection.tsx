import React, { useMemo, useState } from "react";
import { Eye, FileText, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useVehicleDocumentsQuery,
  useUpdateVehicleDocumentMutation,
} from "@/useQuery/vehicleDocumentsUseQuery";

type VehicleDocumentsSectionProps = {
  vehicleId: string;
  readOnly?: boolean;
};

const docLabelMap = {
  carte_grise: "Carte grise",
  assurance: "Assurance",
  visite_technique: "Visite technique",
} as const;

const buildFileUrl = (value?: string | null) => {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  const apiBase = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/api\/?$/, "");
  if (!apiBase) return value;
  return `${apiBase}${value.startsWith("/") ? value : `/${value}`}`;
};

export default function VehicleDocumentsSection({
  vehicleId,
  readOnly = false,
}: VehicleDocumentsSectionProps) {
  const { toast } = useToast();
  const { data: documents = [], isLoading } = useVehicleDocumentsQuery(vehicleId);
  const updateDocumentMutation = useUpdateVehicleDocumentMutation();

  const [rejectionReason, setRejectionReason] = useState("");

  const documentRecord = useMemo(() => {
    if (!Array.isArray(documents) || documents.length === 0) return null;
    return documents[0] as any;
  }, [documents]);

  const docsList = useMemo(() => {
    if (!documentRecord) return [];
    return [
      { key: "carte_grise", label: docLabelMap.carte_grise, file: documentRecord.carte_grise },
      { key: "assurance", label: docLabelMap.assurance, file: documentRecord.assurance },
      { key: "visite_technique", label: docLabelMap.visite_technique, file: documentRecord.visite_technique },
    ];
  }, [documentRecord]);

  const isComplete = docsList.length > 0 && docsList.every((doc) => !!doc.file);
  const isValidated = !!documentRecord?.is_valide;

  const handleApprove = async () => {
    if (!documentRecord?.id) return;

    const formData = new FormData();
    formData.append("is_valide", "true");
    formData.append("rejection_reason", "");

    try {
      await updateDocumentMutation.mutateAsync({
        id: documentRecord.id,
        formData,
      });

      setRejectionReason("");
      toast({
        title: "Documents validés",
        description: "Les documents du véhicule ont été validés avec succès.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de valider les documents.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!documentRecord?.id) return;
    if (!rejectionReason.trim()) {
      toast({
        title: "Motif requis",
        description: "Veuillez saisir une raison de rejet des documents.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("is_valide", "false");
    formData.append("rejection_reason", rejectionReason.trim());

    try {
      await updateDocumentMutation.mutateAsync({
        id: documentRecord.id,
        formData,
      });

      toast({
        title: "Documents rejetés",
        description: "Le rejet des documents a été enregistré.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter les documents.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Documents du véhicule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Chargement des documents...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Documents du véhicule
          </CardTitle>

          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isComplete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {isComplete ? "Dossier complet" : "Dossier incomplet"}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isValidated ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
              }`}
            >
              {isValidated ? "Documents validés" : "Documents non validés"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {!documentRecord ? (
          <p className="text-sm text-slate-500">
            Aucun document n’a encore été envoyé pour ce véhicule.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {docsList.map((doc) => {
                const fileUrl = buildFileUrl(doc.file);

                return (
                  <div
                    key={doc.key}
                    className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{doc.label}</h3>
                      {doc.file ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                          Fourni
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                          Manquant
                        </span>
                      )}
                    </div>

                    {doc.file ? (
                      <a
                        href={fileUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-10 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Eye className="w-4 h-4" />
                        Voir le document
                      </a>
                    ) : (
                      <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-10 text-sm text-slate-400">
                        Non fourni
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!!documentRecord.rejection_reason && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
                  Dernier motif de rejet
                </p>
                <p className="text-sm text-red-700 whitespace-pre-line">
                  {documentRecord.rejection_reason}
                </p>
              </div>
            )}

            {!readOnly && (
              <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-700" />
                  <p className="text-sm font-semibold text-slate-900">
                    Validation des documents
                  </p>
                </div>

                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Motif à envoyer au prestataire en cas de rejet..."
                  className="w-full min-h-[110px] rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={updateDocumentMutation.isPending || !isComplete}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Valider les documents
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReject}
                    disabled={updateDocumentMutation.isPending}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter les documents
                  </Button>
                </div>

                {!isComplete && (
                  <p className="text-xs text-amber-600">
                    Tous les documents requis doivent être présents avant validation.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}