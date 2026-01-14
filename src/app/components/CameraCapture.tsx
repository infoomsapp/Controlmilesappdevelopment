// CameraCapture - Mandatory camera capture for odometer start photo

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Camera, X, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onCapture: (photoDataUrl: string, odometerReading: number) => void;
  onCancel?: () => void;
  mode?: 'start' | 'end';
  minimumReading?: number;
}

export function CameraCapture({ onCapture, onCancel, mode = 'start', minimumReading }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [odometerReading, setOdometerReading] = useState('');
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError(false);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError(true);
      toast.error('Unable to access camera. Please allow camera access.');
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }

  function capturePhoto() {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedPhoto(dataUrl);
        stopCamera();
      }
    }
  }

  function retakePhoto() {
    setCapturedPhoto(null);
    startCamera();
  }

  function handleConfirm() {
    if (!capturedPhoto) {
      toast.error('You must take a photo of the odometer');
      return;
    }

    const reading = parseFloat(odometerReading);
    if (!reading || reading <= 0) {
      toast.error('Please enter a valid odometer reading');
      return;
    }

    // Validate minimum reading for end mode
    if (isEndMode && minimumReading && reading < minimumReading) {
      toast.error(`Odometer reading must be greater than or equal to ${minimumReading.toFixed(1)}`);
      return;
    }

    onCapture(capturedPhoto, reading);
  }

  const isEndMode = mode === 'end';
  const title = isEndMode ? '📸 End of Shift Photo Required' : '📸 Start of Shift Photo Required';
  const description = isEndMode 
    ? 'Capture odometer reading at end of shift' 
    : 'Capture odometer reading at start of shift';
  const instruction = isEndMode
    ? 'You must take a clear photo of your odometer using the camera to END YOUR SHIFT. This is mandatory legal evidence for IRS audits.'
    : 'You must take a clear photo of your odometer using the camera BEFORE starting GPS tracking. This is mandatory legal evidence for IRS audits.';

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              {onCancel && !isEndMode && (
                <Button variant="ghost" size="icon" onClick={onCancel}>
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Instructions */}
            <Card className={isEndMode ? "bg-red-50 border-red-300" : "bg-yellow-50 border-yellow-300"}>
              <CardContent className="pt-4 pb-4 flex gap-3">
                <AlertCircle className={`h-5 w-5 ${isEndMode ? 'text-red-600' : 'text-yellow-600'} flex-shrink-0 mt-0.5`} />
                <div className={`text-sm ${isEndMode ? 'text-red-900' : 'text-yellow-900'}`}>
                  <p className="font-semibold mb-1">⚠️ IRS Audit Requirement</p>
                  <p>{instruction}</p>
                  {minimumReading && (
                    <p className="mt-2 font-semibold">
                      📊 Starting odometer: {minimumReading.toFixed(1)} miles
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Camera/Photo Display */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {cameraError ? (
                <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                  <div>
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">Unable to access camera</p>
                    <p className="text-sm opacity-75">Please allow camera access in your browser settings</p>
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={startCamera}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : capturedPhoto ? (
                <img
                  src={capturedPhoto}
                  alt="Captured odometer"
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-4 border-white/50 rounded-lg w-3/4 h-3/4" />
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
                    Align the odometer within the frame
                  </div>
                </>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Controls */}
            {!cameraError && !capturedPhoto && (
              <Button
                className="w-full"
                size="lg"
                onClick={capturePhoto}
                disabled={!stream}
              >
                <Camera className="mr-2 h-5 w-5" />
                Capture Odometer Photo
              </Button>
            )}

            {/* Photo Confirmation */}
            {capturedPhoto && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="odometer-reading" className="text-base">
                    Odometer Reading *
                  </Label>
                  <Input
                    id="odometer-reading"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 12345.6"
                    value={odometerReading}
                    onChange={(e) => setOdometerReading(e.target.value)}
                    className="text-lg"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500">
                    Enter exactly what you see in the photo
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={retakePhoto}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Retake Photo
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!odometerReading}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                </div>
              </>
            )}

            {/* Legal Notice */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              🔒 Photo stored locally and included in audit reports
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}