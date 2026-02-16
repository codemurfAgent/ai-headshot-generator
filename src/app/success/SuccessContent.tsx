'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [headshots, setHeadshots] = useState<string[]>([]);

  useEffect(() => {
    if (sessionId) {
      // Verify payment and get headshots
      fetch(`/api/verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setHeadshots(data.headshots || []);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full text-center"
      >
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            <p className="text-purple-200">Verifying payment...</p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-purple-200 mb-8">
              Your professional headshots are ready to download
            </p>

            {headshots.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {headshots.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                      <Image src={url} alt={`Headshot ${i + 1}`} fill className="object-cover" />
                      <a
                        href={url}
                        download={`headshot-${i + 1}.png`}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="w-8 h-8 text-white" />
                      </a>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-purple-300">
                  Click on any headshot to download
                </p>
              </>
            ) : (
              <p className="text-purple-300">
                Your headshots are being processed. You will receive them via email shortly.
              </p>
            )}
          </>
        )}
      </motion.div>
    </main>
  );
}
