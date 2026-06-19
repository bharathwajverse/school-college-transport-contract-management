// src/components/LoadingSpinner.jsx
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
