import { ComponentType } from "react";
import { IconBaseProps } from "react-icons";
import Spinner from "./Spinner";

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
  reduceOpacityOnHover = true,
}: IconProps) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`p-3 rounded-full cursor-pointer transition-all hover:bg-myBlue ${
        reduceOpacityOnHover
          ? "hover:bg-opacity-30"
          : "bg-myBlue border-2 border-white hover:drop-shadow-lg hover:bg-myPink"
      }  ${loading && "cursor-wait"}
      ${className}`}
    >
      {loading ? <Spinner /> : <IconName size={size} />}
    </button>
  );
};

export default Icon;
