"use client";

export default function ConnectionErrorOverlay({ message }: { message: string | null }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg text-center max-w-sm shadow-xl">
        <h2 className="text-xl font-bold text-red-600 mb-2">{message}</h2>
        <p className="text-gray-700 mb-4">Спробуйте перевірити інтернет або повторіть підключення.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Повторити спробу</button>
      </div>
    </div>
  );
}
