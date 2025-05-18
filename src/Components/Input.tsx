import React from "react";

type InputProps = {
  name: string;
  value?: string;
  type?: string;
  onChange?: (e: any) => void;
  className?: string;
  onKeyDown?: (e: any) => void;
  disabled?: boolean;
};

const Input = ({
  name,
  type = "text",
  value,
  onChange,
  className,
  onKeyDown,
  disabled,
}: InputProps) => {
  return (
    <input
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      type={type}
      placeholder={`Enter ${name}`}
      className={`flex-1 bg-transparent placeholder-gray-300 border-2 border-gray-200 rounded-full px-3 py-2 ${className}`}
    />
  );
};

export default Input;
