"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { SidebarSettingsPrestataire } from "@/components/Prestataire/setting/SidebarSettingsPrestataire";
import { PersonalInfoFormPrestataire } from "@/components/Prestataire/setting/PersonalInfoFormPrestataire";
import { CompanyInfoFormPrestataire } from "@/components/Prestataire/setting/CompanyInfoFormPrestataire";
import { SecurityFormPrestataire } from "@/components/Prestataire/setting/SecurityFormPrestataire";

import { usePrestataireSettings } from "@/hooks/usePrestataireSettings";

const SettingsView = () => {
  const {
    user,
    section,
    setSection,
    companyEnabled,
    saveCompanyChoice,
    isCompanyChoiceLoading,
    previewPhoto,
    handlePhotoUpload,
    handleDeletePhoto,
    previewCinRecto,
    previewCinVerso,
    handleCinRectoUpload,
    handleCinVersoUpload,
    deleteProfilePhoto,
    deleteCinRecto,
    deleteCinVerso,
    register,
    onSubmit,
    errors,
    isSubmitting,
    previewLogo,
    handleLogoUpload,
    handleNifUpload,
    handleStatUpload,
    handleRcsUpload,
    handleCifUpload,
  } = usePrestataireSettings();

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-poppins tracking-tight">
          Paramètres du compte prestataire
        </h2>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et professionnelles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-lg border-border/50 h-fit sticky top-24 transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-6 space-y-6">
            <SidebarSettingsPrestataire
              section={section}
              setSection={setSection as any}
              companyEnabled={companyEnabled}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-border/50 md:col-span-2 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {section === "personal" && "Informations personnelles"}
              {section === "company" && "Informations de l'entreprise"}
              {section === "security" && "Sécurité du compte"}
            </CardTitle>

            <CardDescription className="text-base leading-relaxed">
              {section === "personal" && "Modifiez vos informations personnelles et votre photo."}
              {section === "company" &&
                "Modifiez les informations administratives et professionnelles de votre entreprise."}
              {section === "security" &&
                "Changez votre mot de passe afin de sécuriser votre compte."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={onSubmit} className="space-y-6">
              {section === "personal" && (
                <PersonalInfoFormPrestataire
                  user={user}
                  previewPhoto={previewPhoto}
                  register={register as any}
                  handlePhotoUpload={handlePhotoUpload}
                  handleDeletePhoto={handleDeletePhoto}
                  errors={errors}
                  previewCinRecto={previewCinRecto}
                  previewCinVerso={previewCinVerso}
                  handleCinRectoUpload={handleCinRectoUpload}
                  handleCinVersoUpload={handleCinVersoUpload}
                  deleteProfilePhoto={deleteProfilePhoto}
                  deleteCinRecto={deleteCinRecto}
                  deleteCinVerso={deleteCinVerso}
                />
              )}

              {section === "company" && (
                <CompanyInfoFormPrestataire
                  user={user}
                  register={register as any}
                  errors={errors}
                  previewLogo={previewLogo}
                  handleLogoUpload={handleLogoUpload}
                  handleNifUpload={handleNifUpload}
                  handleStatUpload={handleStatUpload}
                  handleRcsUpload={handleRcsUpload}
                  handleCifUpload={handleCifUpload}
                />
              )}

              {section === "security" && (
                <SecurityFormPrestataire
                  register={register as any}
                  errors={errors}
                />
              )}

              <div className="flex flex-col gap-4 pt-6 border-t border-border/50">
                <div className="flex justify-end items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl transition-all duration-200 hover:bg-accent hover:scale-105 bg-transparent"
                    onClick={() => setShowConfirm(true)}
                    disabled={isCompanyChoiceLoading}
                  >
                    {companyEnabled ? "Modifier le statut entreprise" : "Êtes-vous une entreprise ?"}
                  </Button>

                  <Button
                    className="bg-primary text-white rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enregistrement..." : "Sauvegarder"}
                  </Button>
                </div>

                {showConfirm && (
                  <div className="flex flex-col sm:flex-row justify-end items-center gap-3 p-4 bg-muted/50 border-2 border-border rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-sm">
                    <span className="text-sm font-medium text-foreground flex-1 sm:flex-none">
                      Confirmez-vous être une entreprise ?
                    </span>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        className="bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 hover:scale-105 flex-1 sm:flex-none"
                        disabled={isCompanyChoiceLoading}
                        onClick={async () => {
                          await saveCompanyChoice(true);
                          setShowConfirm(false);
                          setSection("company");
                        }}
                      >
                        Oui
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        className="rounded-xl transition-all duration-200 hover:scale-105 flex-1 sm:flex-none"
                        disabled={isCompanyChoiceLoading}
                        onClick={async () => {
                          await saveCompanyChoice(false);
                          setShowConfirm(false);
                          setSection("personal");
                        }}
                      >
                        Non
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsView;
