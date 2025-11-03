import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Tour } from '../types';
import { CameraIcon } from './icons/CameraIcon';

interface ScannerProps {
  onScan: (imageData: string) => void;
  isLoading: boolean;
  error: string | null;
  activeTour: Tour | null;
  currentArtworkTitle: string | null;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, isLoading, error, activeTour, currentArtworkTitle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setIsCameraReady(true);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setCameraError("Camera access is required. Please enable it in your browser settings.");
      }
    };
    enableCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isLoading) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const base64Data = dataUrl.split(',')[1];
      onScan(base64Data);
    }
  }, [onScan, isLoading]);
  
  const getTourProgress = () => {
    if (!activeTour) {
      return { nextArtwork: null, progress: 0 };
    }

    const currentIndex = currentArtworkTitle
      ? activeTour.artworks.findIndex(art => art.title === currentArtworkTitle)
      : -1;

    if (currentIndex === -1) {
      // Tour has started, but no valid artwork scanned yet. Show the first one.
      return { nextArtwork: activeTour.artworks[0], progress: 0 };
    }

    if (currentIndex < activeTour.artworks.length - 1) {
      // There is a next artwork.
      return { nextArtwork: activeTour.artworks[currentIndex + 1], progress: currentIndex + 1 };
    }

    // Tour is complete.
    return { nextArtwork: null, progress: activeTour.artworks.length };
  };
  
  const tourProgress = getTourProgress();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black relative text-white">
      <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative z-20 flex flex-col items-center justify-between h-full w-full p-6">
        <div className="w-full">
            {activeTour && (
                <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg mb-4 text-center">
                    <h2 className="text-amber-400 font-bold">{activeTour.title}</h2>
                    {tourProgress.nextArtwork ? (
                        <p className="text-sm mt-1">Next: Find and scan <span className="font-semibold">{tourProgress.nextArtwork.title}</span></p>
                    ) : (
                        <p className="text-sm mt-1 font-semibold text-green-400">Tour Complete!</p>
                    )}
                </div>
            )}
            {error && <div className="bg-red-500/80 text-white p-3 rounded-lg text-center text-sm mb-4">{error}</div>}
        </div>
        
        <div className="w-4/5 h-3/5 border-4 border-dashed border-white/50 rounded-lg flex items-center justify-center">
          {!isCameraReady && !cameraError && <p>Starting camera...</p>}
          {cameraError && <p className="text-center p-4">{cameraError}</p>}
        </div>

        <div className="w-full flex flex-col items-center">
            {isLoading ? (
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400"></div>
                    <p className="mt-4 text-lg">Identifying...</p>
                </div>
            ) : (
                <button
                    onClick={handleCapture}
                    disabled={!isCameraReady || isLoading}
                    className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/80 disabled:opacity-50 transition hover:bg-white/50"
                    aria-label="Scan Artwork"
                >
                    <CameraIcon className="w-10 h-10 text-white"/>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;