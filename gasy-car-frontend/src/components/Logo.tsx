interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

const mcarLogoPath = "/logo/mcar-logo.png";

const Logo = ({ size = 42, withText = false, className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={mcarLogoPath}
        alt="MadagasyCar Logo"
        width={size}
        height={size}
        className="object-contain select-none"
        draggable={false}
      />
    </div>
  );
};

export default Logo;
