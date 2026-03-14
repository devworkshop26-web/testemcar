import { InstanceAxis } from "@/helper/InstanceAxios";

// Fonction pour générer la silhouette "style Facebook"
const generateDefaultAvatar = () => {
  // Couleurs grises neutres pour le look Facebook/Moderne
  const bgColor = "#F0F2F5";
  const iconColor = "#8A8D91";

  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${iconColor}'>
      <rect width='24' height='24' fill='${bgColor}'/>
      <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

interface AvatarPrestataireProps {
  user?: {
    first_name?: string;
    last_name?: string;
    image?: string;
  } | null;
  previewPhoto?: string | null;
  size?: number;
}

const AvatarPrestataire = ({ user, previewPhoto, size = 48 }: AvatarPrestataireProps) => {
  // On génère la silhouette par défaut
  const defaultAvatar = generateDefaultAvatar();

  const getMediaUrl = (value?: string | null) => {
    if (!value) return null;
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
      return value;
    }
    const RAW_BASE_URL = InstanceAxis.defaults.baseURL || "";
    const BASE_URL = RAW_BASE_URL.replace("/api", "").replace(/\/+$/, "");
    return `${BASE_URL}${value}`;
  };

  const backendPhoto =
    user?.image && typeof user.image === "string"
      ? getMediaUrl(user.image)
      : null;

  const finalPhoto = previewPhoto || backendPhoto || defaultAvatar;

  return (
    <div 
      className="overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '20%' // Design moderne : ni trop rond, ni trop carré
      }}
    >
      <img
        src={finalPhoto}
        alt="avatar prestataire"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Sécurité si l'image du backend échoue
          (e.currentTarget as HTMLImageElement).src = defaultAvatar;
        }}
      />
    </div>
  );
};

export default AvatarPrestataire;
