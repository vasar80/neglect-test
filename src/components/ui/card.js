export const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold">{children}</h2>
);

export const CardContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

export const CardFooter = ({ children }) => (
  <div className="mt-4">{children}</div>
);
