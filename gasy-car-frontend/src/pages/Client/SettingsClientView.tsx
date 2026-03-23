import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClientSettings } from "@/hooks/useClientSetting";
import { SidebarSettings } from "@/components/client/settings/SidebarSettings";
import { ProfileForm } from "@/components/client/settings/ProfilForm";
import { SecurityForm } from "@/components/client/settings/SecurityForm";
import { deconnectionAction } from "@/helper/utils";
import { useState } from "react";

const SettingsClientView = () => {
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const {
    user,
    section,
    setSection,
    previewPhoto,
    handlePhotoUpload,
    handleDeletePhoto,
    previewCinRecto,
    previewCinVerso,
    previewDrivingLicenseRecto,
    previewDrivingLicenseVerso,
    previewResidenceCertificate,
    handleCinRectoUpload,
    handleCinVersoUpload,
    handleResidenceCertificateUpload,
    handleDrivingLicenseRectoUpload,
    handleDrivingLicenseVersoUpload,
    deleteProfilePhoto,
    deleteCinRecto,
    deleteCinVerso,
    deleteResidenceCertificate,
    deleteDrivingLicenseRecto,
    deleteDrivingLicenseVerso,
    register,
    onSubmit,
    errors,
    isSubmitting,
    isUserLoading,
  } = useClientSettings();

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleLogout = async () => {
    setLogoutLoading(true);

    deconnectionAction();

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-poppins tracking-tight">
          Paramètres du compte
        </h2>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et la sécurité de votre compte
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-lg border-border/50 h-fit sticky top-24 transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-6 space-y-6">
            <SidebarSettings
              section={section}
              setSection={(s: string) => setSection(s as "profile" | "security")}
            />

            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                border border-red-200 text-red-600
                bg-white/60 hover:bg-red-50
                transition-all duration-200
                hover:shadow-sm active:scale-[0.99]
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {logoutLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}

              <span className="font-semibold text-sm">
                {logoutLoading ? "Déconnexion..." : "Déconnexion"}
              </span>
            </button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-border/50 md:col-span-2 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {section === "profile" && "Informations personnelles"}
              {section === "security" && "Sécurité du compte"}
            </CardTitle>

            <CardDescription className="text-base leading-relaxed">
              {section === "profile" &&
                "Modifiez vos informations personnelles, votre photo et vos documents."}
              {section === "security" &&
                "Changez votre mot de passe afin de sécuriser votre compte."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={onSubmit} className="space-y-6">
              {section === "profile" && (
                <ProfileForm
                  previewPhoto={previewPhoto}
                  register={register}
                  handlePhotoUpload={handlePhotoUpload}
                  handleDeletePhoto={handleDeletePhoto}
                  previewCinRecto={previewCinRecto}
                  previewCinVerso={previewCinVerso}
                  previewDrivingLicenseRecto={previewDrivingLicenseRecto}
                  previewDrivingLicenseVerso={previewDrivingLicenseVerso}
                  previewResidenceCertificate={previewResidenceCertificate}
                  handleCinRectoUpload={handleCinRectoUpload}
                  handleCinVersoUpload={handleCinVersoUpload}
                  handleResidenceCertificateUpload={handleResidenceCertificateUpload}
                  handleDrivingLicenseRectoUpload={handleDrivingLicenseRectoUpload}
                  handleDrivingLicenseVersoUpload={handleDrivingLicenseVersoUpload}
                  deleteProfilePhoto={deleteProfilePhoto}
                  deleteCinRecto={deleteCinRecto}
                  deleteCinVerso={deleteCinVerso}
                  deleteResidenceCertificate={deleteResidenceCertificate}
                  deleteDrivingLicenseRecto={deleteDrivingLicenseRecto}
                  deleteDrivingLicenseVerso={deleteDrivingLicenseVerso}
                  errors={errors}
                  user={user}
                />
              )}

              {section === "security" && <SecurityForm register={register} />}

              <div className="flex flex-col gap-4 pt-6 border-t border-border/50">
                <div className="flex justify-end items-center gap-3">
                  <Button
                    type="submit"
                    className="
                      bg-primary text-white rounded-xl flex items-center gap-2
                      transition-all duration-200 hover:scale-105 hover:shadow-md
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    "
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    )}
                    {isSubmitting ? "Enregistrement..." : "Sauvegarder"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsClientView;