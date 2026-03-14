"use client"

import React from "react"
import { FileText, AlertCircle, CheckCircle2, Shield, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UploadCard from "@/components/vehicleManage/UploadCard"

interface DocumentsTabProps {
  vehicleId: string
}

import { Button } from "@/components/ui/button"
import {
  useVehicleDocumentsQuery,
  useCreateVehicleDocumentMutation,
  useUpdateVehicleDocumentMutation,
} from "@/useQuery/vehicleDocumentsUseQuery"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

const DocumentsTab: React.FC<DocumentsTabProps> = ({ vehicleId }) => {
  const { data: documents, isLoading } = useVehicleDocumentsQuery(vehicleId)
  const createMutation = useCreateVehicleDocumentMutation()
  const updateMutation = useUpdateVehicleDocumentMutation()

  const [uploadingType, setUploadingType] = React.useState<string | null>(null)

  const [localDocs, setLocalDocs] = React.useState<{
    carteGrise: File | null
    visiteTechnique: File | null
    assurance: File | null
  }>({
    carteGrise: null,
    visiteTechnique: null,
    assurance: null,
  })

  const existingDoc = documents?.[0]

  const handleUpload = async (type: "carte_grise" | "visite_technique" | "assurance") => {
    const file =
      type === "carte_grise"
        ? localDocs.carteGrise
        : type === "visite_technique"
          ? localDocs.visiteTechnique
          : localDocs.assurance

    if (!file) return

    const formData = new FormData()
    formData.append("vehicle", vehicleId)
    formData.append(type, file)

    try {
      setUploadingType(type)

      if (existingDoc) {
        await updateMutation.mutateAsync({ id: existingDoc.id, formData })
      } else {
        await createMutation.mutateAsync(formData)
      }
      toast.success("Document téléversé avec succès")
      setLocalDocs((prev) => ({
        ...prev,
        [type === "carte_grise" ? "carteGrise" : type === "visite_technique" ? "visiteTechnique" : "assurance"]: null,
      }))
    } catch (error) {
      toast.error("Erreur lors du téléversement")
    } finally {
      setUploadingType(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  const completedDocs = [existingDoc?.carte_grise, existingDoc?.visite_technique, existingDoc?.assurance].filter(
    Boolean,
  ).length

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-8 animate-in slide-in-from-top-4 duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-pulse" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15 ring-1 ring-primary/20 animate-in zoom-in duration-500 delay-100">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Documents du véhicule</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Téléversez les documents obligatoires pour activer les réservations
            </p>
          </div>

          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-background to-muted border border-border/50 backdrop-blur-sm shadow-lg shadow-primary/5 animate-in slide-in-from-right-4 duration-700 delay-200">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-border opacity-30"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="text-primary transition-all duration-500"
                    strokeDasharray={`${(completedDocs / 3) * 282.7} 282.7`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">
                  {completedDocs}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Progression</p>
                <p className="text-sm font-semibold text-foreground">{completedDocs}/3 documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            type: "carte_grise" as const,
            title: "Carte grise",
            subtitle: "Document d'immatriculation du véhicule",
            localFile: localDocs.carteGrise,
            existingFile: existingDoc?.carte_grise,
            setLocalFile: (f: File | null) => setLocalDocs((d) => ({ ...d, carteGrise: f })),
            delay: 0,
          },
          {
            type: "visite_technique" as const,
            title: "Visite technique",
            subtitle: "Contrôle technique en cours de validité",
            localFile: localDocs.visiteTechnique,
            existingFile: existingDoc?.visite_technique,
            setLocalFile: (f: File | null) => setLocalDocs((d) => ({ ...d, visiteTechnique: f })),
            delay: 100,
          },
          {
            type: "assurance" as const,
            title: "Assurance",
            subtitle: "Attestation d'assurance véhicule",
            localFile: localDocs.assurance,
            existingFile: existingDoc?.assurance,
            setLocalFile: (f: File | null) => setLocalDocs((d) => ({ ...d, assurance: f })),
            delay: 200,
          },
        ].map((doc) => (
          <div
            key={doc.type}
            className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ transitionDelay: `${doc.delay}ms` }}
          >
            <div className="space-y-3 h-full flex flex-col">
              <div className="flex-1 transition-all duration-300">
                <UploadCard
                  title={doc.title}
                  subtitle={doc.subtitle}
                  file={doc.localFile}
                  url={doc.existingFile}
                  onPick={doc.setLocalFile}
                  onClear={() => doc.setLocalFile(null)}
                />
              </div>

              {doc.existingFile && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 animate-in slide-in-from-left-2 duration-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Téléversé</p>
                </div>
              )}

              <Button
                className="w-full relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                size="sm"
                disabled={!doc.localFile || uploadingType === doc.type}
                onClick={() => handleUpload(doc.type)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>
                    {uploadingType === doc.type
                      ? "Envoi..."
                      : doc.existingFile
                        ? `Remplacer ${doc.title.split(" ")[0]}`
                        : `Envoyer ${doc.title.split(" ")[0]}`}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden border-amber-200 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 dark:from-amber-500/10 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-100/50 dark:hover:shadow-amber-500/10 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/20 dark:bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-base flex items-center gap-2 text-amber-900 dark:text-amber-300">
              <AlertCircle className="w-5 h-5" />
              Documents requis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-amber-800 dark:text-amber-200/80 space-y-3 relative z-10">
            {[
              "Les documents doivent être lisibles (photo nette ou PDF)",
              "Les documents expirés peuvent bloquer les réservations",
              "La taille maximale par fichier est de 10 Mo",
            ].map((text, i) => (
              <p
                key={i}
                className="flex items-start gap-2 animate-in fade-in duration-500"
                style={{ transitionDelay: `${400 + i * 50}ms` }}
              >
                <span className="text-amber-600 dark:text-amber-300 font-bold mt-0.5">•</span>
                <span>{text}</span>
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-emerald-200 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50 dark:from-emerald-500/10 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-500/10 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/20 dark:bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
              <Shield className="w-5 h-5" />
              Sécurité des données
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-emerald-800 dark:text-emerald-200/80 space-y-3 relative z-10">
            {[
              "Vos documents sont chiffrés et stockés de manière sécurisée",
              "Seuls les administrateurs vérifiés peuvent y accéder",
              "Conformité RGPD garantie",
            ].map((text, i) => (
              <p
                key={i}
                className="flex items-start gap-2 animate-in fade-in duration-500"
                style={{ transitionDelay: `${400 + i * 50}ms` }}
              >
                <span className="text-emerald-600 dark:text-emerald-300 font-bold mt-0.5">•</span>
                <span>{text}</span>
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border/50">
          <CardTitle className="text-lg">Checklist des documents</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[
              { name: "Carte grise", uploaded: !!existingDoc?.carte_grise },
              { name: "Visite technique", uploaded: !!existingDoc?.visite_technique },
              { name: "Assurance", uploaded: !!existingDoc?.assurance },
            ].map((item, i) => (
              <div
                key={item.name}
                className="animate-in fade-in slide-in-from-left-2 duration-500 group"
                style={{ transitionDelay: `${500 + i * 75}ms` }}
              >
                <div
                  className={`
                  flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                  ${
                    item.uploaded
                      ? "bg-gradient-to-r from-emerald-50 dark:from-emerald-500/10 to-transparent border border-emerald-200 dark:border-emerald-500/30 shadow-sm shadow-emerald-100/50 dark:shadow-emerald-500/10"
                      : "bg-muted/50 border border-transparent hover:bg-muted hover:border-border/50"
                  }
                `}
                >
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ring-2
                    ${
                      item.uploaded
                        ? "bg-emerald-500 dark:bg-emerald-600 text-white ring-emerald-200 dark:ring-emerald-500/30"
                        : "bg-transparent ring-border/50"
                    }
                  `}
                  >
                    {item.uploaded ? (
                      <CheckCircle2 className="w-4 h-4 animate-in zoom-in duration-300" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold transition-colors duration-300 ${item.uploaded ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}
                  >
                    {item.name}
                  </span>
                  {item.uploaded && (
                    <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 animate-in zoom-in duration-300">
                      Téléversé
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DocumentsTab
