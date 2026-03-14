import { Link } from "react-router-dom";

interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

const mcarLogoWhitePath = "/logo/mcar-logo-white.png";

const WhiteLogo = ({ size = 42, withText = false, className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img
        src={mcarLogoWhitePath}
        alt="MadagasyCar Logo"
        width={size}
        height={size}
        className="object-contain select-none"
        draggable={false}
      />
    </Link>
  );
};

export default WhiteLogo;
