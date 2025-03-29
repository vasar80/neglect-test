export const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${className}`}
  >
    {children}
  </button>
);
