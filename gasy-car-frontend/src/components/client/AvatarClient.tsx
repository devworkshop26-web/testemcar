import { InstanceAxis } from "@/helper/InstanceAxios";
import { User } from "@/types/userType";

const generateDefaultAvatar = () => {
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

const resolveUserImageUrl = (image?: string | null) => {
  if (!image || typeof image !== "string") return null;

  const trimmed = image.trim();
  if (!trimmed) return null;

  // Si l'image est déjà une URL absolue, on la garde
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Sinon on reconstruit depuis la base backend
  const rawBaseUrl = String(InstanceAxis.defaults.baseURL || "");
  const baseUrl = rawBaseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

  if (!baseUrl) return trimmed;

  return trimmed.startsWith("/") ? `${baseUrl}${trimmed}` : `${baseUrl}/${trimmed}`;
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
  const defaultAvatar = generateDefaultAvatar();

  const backendPhoto = resolveUserImageUrl(user?.image || null);

  // petit cache bust pour forcer le navigateur à recharger la nouvelle image
  const cacheKey =
    user?.updated_at || user?.date_joined || String(Date.now());

  const backendPhotoWithCache = backendPhoto
    ? `${backendPhoto}${backendPhoto.includes("?") ? "&" : "?"}v=${encodeURIComponent(cacheKey)}`
    : null;

  const finalPhoto = previewPhoto || backendPhotoWithCache || defaultAvatar;

  return (
    <div
      className="overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
      style={{
        width: size,
        height: size,
        borderRadius: "20%",
      }}
    >
      <img
        src={finalPhoto}
        alt="avatar client"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = defaultAvatar;
        }}
      />
    </div>
  );
};

export default AvatarClient;