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

const SettingsView = () => {
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const {
    user,
    section,
    setSection,
    previewPhoto,
    handlePhotoUpload,
    handleDeletePhoto,

    // ✅ CIN
    previewCinRecto,
    previewCinVerso,
    handleCinRectoUpload,
    handleCinVersoUpload,

    // ✅ suppression backend (1 photo à la fois)
    deleteProfilePhoto,
    deleteCinRecto,
    deleteCinVerso,

    register,
    onSubmit,
    errors,
    isSubmitting,
    isUserLoading,
  } = useClientSettings();

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  /* --------------------------------------------
     🧹 Déconnexion avec spinner + redirection propre
  --------------------------------------------- */
  const handleLogout = async () => {
    setLogoutLoading(true);

    deconnectionAction(); // supprime les tokens

    // Petit délai pour laisser le spinner visible
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold font-poppins">Paramètres du compte</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SIDEBAR */}
        <Card className="rounded-2xl shadow-md h-fit">
          <CardContent className="p-6 space-y-6">
            <SidebarSettings section={section} setSection={(s: string) => setSection(s as "profile" | "security")} />

            {/* ------------------ BOUTON DECONNEXION ------------------ */}
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 
                border border-red-200 rounded-xl hover:bg-red-50"
            >
              {logoutLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></span>
              ) : (
                <LogOut className="w-5 h-5" />
              )}

              {logoutLoading ? "Déconnexion..." : "Déconnexion"}
            </button>
          </CardContent>
        </Card>

        {/* FORMULAIRE PRINCIPAL */}
        <Card className="rounded-2xl shadow-md md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {section === "profile" && "Informations personnelles"}
              {section === "security" && "Sécurité du compte"}
            </CardTitle>

            <CardDescription>
              {section === "profile" &&
                "Modifiez vos informations personnelles et votre photo."}
              {section === "security" &&
                "Changez votre mot de passe pour protéger votre compte."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {section === "profile" && (
                <ProfileForm
                  previewPhoto={previewPhoto}
                  register={register}
                  handlePhotoUpload={handlePhotoUpload}
                  handleDeletePhoto={handleDeletePhoto}

                  // ✅ CIN
                  previewCinRecto={previewCinRecto}
                  previewCinVerso={previewCinVerso}
                  handleCinRectoUpload={handleCinRectoUpload}
                  handleCinVersoUpload={handleCinVersoUpload}

                  // ✅ suppression backend (1 photo à la fois)
                  deleteProfilePhoto={deleteProfilePhoto}
                  deleteCinRecto={deleteCinRecto}
                  deleteCinVerso={deleteCinVerso}

                  errors={errors}
                  user={user}
                />
              )}

              {section === "security" && <SecurityForm register={register} />}

              {/* SUBMIT BUTTON */}
              <div className="flex justify-end pt-4">
                <Button
                  className="bg-blue-600 text-white rounded-xl flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  )}
                  {isSubmitting ? "Enregistrement..." : "Sauvegarder"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsView;
