
type Props = {
  label?: string;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
};

function Button({ label = "Button", type = "button", disabled = false }: Props) {
  return (
    <div>
      <button
        className={`w-full py-3 rounded-md text-white font-bold text-lg cursor-pointer ${
          disabled ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
        type={type}
        disabled={disabled}
      >
        {label}
      </button>
    </div>
  );
}

export default Button