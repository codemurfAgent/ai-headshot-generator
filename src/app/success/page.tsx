'use client';

import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-purple-200">Loading...</p>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
