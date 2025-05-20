import { ComponentType } from "react";
import { IconBaseProps } from "react-icons";

type IconProps = {
  IconName: ComponentType<IconBaseProps>;
  size?: number;
  className?: string;
  loading?: boolean;
  ping?: boolean;
  onClick?: () => void;
  reduceOpacityOnHover?: boolean;
};
const Icon = ({
  IconName,
  size = 20,
  className,
  loading,
  ping,
  onClick,
  reduceOpacityOnHover,
}: IconProps) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`p-3 rounded-full cursor-pointer hover:bg-myBlue ${
        reduceOpacityOnHover
          ? "hover:bg-opacity-30"
          : "bg-myBlue border-2 border-white hover:drop-shadow-lg"
      }  ${loading && "cursor-wait"}
      ${className}`}
    >
      {loading ? "Loading..." : <IconName size={size} />}
    </button>
  );
};

export default Icon;
