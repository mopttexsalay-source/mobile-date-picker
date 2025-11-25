'use client';

import MobileDateRangePicker from '@/components/MobileDateRangePicker';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Mobile Date Range Picker
          </h1>
          <p className="text-gray-600">
            Smooth, native-like calendar for mobile devices
          </p>
        </div>

        <MobileDateRangePicker />
      </div>
    </div>
  );
}
