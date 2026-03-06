import { InstanceAxis } from "@/helper/InstanceAxios";
import { User } from "@/types/userType";

// Fonction pour générer la silhouette "style Facebook" neutre
const generateDefaultAvatar = () => {
  const bgColor = "#F0F2F5"; // Gris clair Facebook
  const iconColor = "#8A8D91"; // Icône grise

  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${iconColor}'>
      <rect width='24' height='24' fill='${bgColor}'/>
      <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const AvatarClient = ({
  user,
  previewPhoto,
  size = 40,
}: {
  user: User | null;
  previewPhoto?: string | null;
  size?: number;
}) => {
  // On génère la silhouette par défaut
  const defaultAvatar = generateDefaultAvatar();

  // 🔥 RÉCUPÉRATION DE LA BASE_URL DU BACKEND
  const RAW_BASE_URL = InstanceAxis.defaults.baseURL || "";
  const BASE_URL = RAW_BASE_URL.replace("/api", "").replace(/\/+$/, "");

  // 🔥 IMAGE BACKEND
  const backendPhoto =
    user?.image && typeof user.image === "string"
      ? `${BASE_URL}${user.image}`
      : null;

  // 🔥 PRIORITÉ : 1. preview instantané → 2. image backend → 3. avatar silhouette
  const finalPhoto = previewPhoto || backendPhoto || defaultAvatar;

  return (
    <div
      className="overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
      style={{
        width: size,
        height: size,
        borderRadius: "20%", // Design moderne (squircle) identique au prestataire
      }}
    >
      <img
        src={finalPhoto}
        alt="avatar client"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Sécurité : si l'URL de l'image est cassée, on remet la silhouette
          (e.currentTarget as HTMLImageElement).src = defaultAvatar;
        }}
      />
    </div>
  );
};

export default AvatarClient;