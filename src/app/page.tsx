'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [headshots, setHeadshots] = useState<Array<{ style: string; url: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setHeadshots([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10000000, // 10MB
  });

  const generateHeadshots = async () => {
    if (!uploadedImage) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: uploadedImage }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }
      
      setHeadshots(data.headshots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            AI Headshot Generator
          </h1>
          <p className="text-xl text-purple-200 mb-2">
            Turn any selfie into a professional headshot in 30 seconds
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">4 styles • Instant delivery • $19</span>
          </div>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {!uploadedImage ? (
              <div
                key="upload"
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                  ${isDragActive 
                    ? 'border-purple-400 bg-purple-500/20' 
                    : 'border-purple-500/50 bg-white/5 hover:bg-white/10 hover:border-purple-400'
                  }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? 'Drop your photo here' : 'Upload your selfie'}
                </h3>
                <p className="text-purple-300 text-sm">
                  Drag & drop or click to select • JPG, PNG, WebP
                </p>
              </div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Preview */}
                <div className="relative rounded-2xl overflow-hidden bg-white/10 p-4">
                  <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={uploadedImage}
                        alt="Your photo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Photo uploaded successfully!
                      </h3>
                      <p className="text-purple-300 text-sm mb-4">
                        Click generate to create your professional headshots
                      </p>
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="text-sm text-purple-400 hover:text-purple-300 underline"
                      >
                        Choose different photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                {!headshots.length && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateHeadshots}
                    disabled={isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl
                      disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating your headshots...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Professional Headshots
                      </>
                    )}
                  </motion.button>
                )}

                {/* Error */}
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center">
                    {error}
                  </div>
                )}

                {/* Results */}
                {headshots.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-white text-center">
                      Your Professional Headshots
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {headshots.map((headshot, i) => (
                        <div key={i} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden bg-white/10 relative">
                            <Image
                              src={headshot.url}
                              alt={headshot.style}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-center text-sm text-purple-300 mt-2">{headshot.style}</p>
                          
                          {/* Watermark overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                            <span className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-full">
                              PREVIEW
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment CTA */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-center">
                      <h4 className="text-2xl font-bold text-white mb-2">
                        Unlock Your Headshots
                      </h4>
                      <p className="text-purple-100 mb-4">
                        Pay $19 to download all 4 high-resolution headshots
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-purple-600 font-bold px-8 py-3 rounded-xl
                          hover:bg-purple-50 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Get All 4 Headshots - $19
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mt-12 text-purple-300 text-sm"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            30-second generation
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Professional quality
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Instant download
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Secure payment
          </div>
        </motion.div>
      </div>
    </main>
  );
}
