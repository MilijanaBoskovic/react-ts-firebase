import Spinner from "./Spinner";

type ButtonProps = {
  text: string;
  clasName?: string;
  secondary?: boolean;
  onClick?: () => void;
  loading?: boolean;
};

const Button = ({
  text = "Button",
  secondary,
  clasName,
  onClick,
  loading = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`py-2 px-9 rounded-full text-white border-2 border-white hover:bg-myPink transition-all hover:drop-shadow-lg flex justify-center items-center gap-5 ${
        secondary ? "bg-myPink" : "bg-myBlue"
      } ${clasName} ${loading && "cursor-wait"}`}
    >
      {loading && <Spinner />}
      {text}
    </button>
  );
};

export default Button;
