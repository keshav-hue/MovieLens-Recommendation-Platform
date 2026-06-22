export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          🎬 MovieLens
        </h1>

        <h2 className="text-xl font-semibold text-center">
          {title}
        </h2>

        <p className="text-gray-500 text-center mb-6">
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  );
}