import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileImage, FileCode, Image, Loader2, BarChart3 } from "lucide-react";
import QRCode from "qrcode";
import type { QRSettings } from "@/lib/qr-types";

interface QRPreviewProps {
  settings: QRSettings;
}

export function QRPreview({ settings }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const generateQRCode = useCallback(async () => {
    if (!settings.inputValue.trim()) {
      setQrDataUrl(null);
      return;
    }

    setIsGenerating(true);

    try {
      let content = settings.inputValue;

      switch (settings.inputType) {
        case "email":
          content = `mailto:${settings.inputValue}`;
          break;
        case "phone":
          content = `tel:${settings.inputValue}`;
          break;
        case "sms":
          content = `sms:${settings.inputValue}`;
          break;
        case "bitcoin":
          content = `bitcoin:${settings.inputValue}`;
          break;
        case "wifi":
          content = `WIFI:S:${settings.inputValue};;`;
          break;
        default:
          content = settings.inputValue;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const frameSize = settings.frameTemplate !== "none" ? 60 : 0;
      const totalSize = settings.size + frameSize * 2;

      canvas.width = totalSize;
      canvas.height = totalSize + (settings.frameTemplate !== "none" ? 30 : 0);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (settings.frameTemplate !== "none") {
        drawFrame(ctx, settings, totalSize);
      }

      const tempCanvas = document.createElement("canvas");
      await QRCode.toCanvas(tempCanvas, content, {
        width: settings.size,
        margin: 2,
        color: {
          dark: settings.foregroundColor,
          light: settings.backgroundColor,
        },
        errorCorrectionLevel: settings.errorCorrection,
      });

      if (settings.cornerStyle === "rounded") {
        applyRoundedCorners(tempCanvas, settings.foregroundColor, settings.backgroundColor);
      }

      ctx.drawImage(tempCanvas, frameSize, frameSize);

      if (settings.logoUrl) {
        await drawLogo(ctx, settings, frameSize);
      }

      if (settings.frameTemplate !== "none" && settings.frameText) {
        drawFrameText(ctx, settings, totalSize);
      }

      setQrDataUrl(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [settings]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      generateQRCode();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [generateQRCode]);

  const drawFrame = (ctx: CanvasRenderingContext2D, settings: QRSettings, totalSize: number) => {
    const padding = 8;

    ctx.strokeStyle = settings.foregroundColor;
    ctx.lineWidth = 3;

    switch (settings.frameTemplate) {
      case "simple":
        ctx.strokeRect(padding, padding, totalSize - padding * 2, totalSize - padding * 2);
        break;
      case "scanme":
      case "decorative":
        ctx.beginPath();
        ctx.roundRect(padding, padding, totalSize - padding * 2, totalSize - padding * 2 + 30, 12);
        ctx.stroke();
        break;
      case "modern":
        const cornerLength = 20;
        ctx.beginPath();
        ctx.moveTo(padding, padding + cornerLength);
        ctx.lineTo(padding, padding);
        ctx.lineTo(padding + cornerLength, padding);
        ctx.moveTo(totalSize - padding - cornerLength, padding);
        ctx.lineTo(totalSize - padding, padding);
        ctx.lineTo(totalSize - padding, padding + cornerLength);
        ctx.moveTo(totalSize - padding, totalSize - padding - cornerLength + 30);
        ctx.lineTo(totalSize - padding, totalSize - padding + 30);
        ctx.lineTo(totalSize - padding - cornerLength, totalSize - padding + 30);
        ctx.moveTo(padding + cornerLength, totalSize - padding + 30);
        ctx.lineTo(padding, totalSize - padding + 30);
        ctx.lineTo(padding, totalSize - padding - cornerLength + 30);
        ctx.stroke();
        break;
      case "minimal":
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(padding, padding, totalSize - padding * 2, totalSize - padding * 2 + 30);
        ctx.setLineDash([]);
        break;
    }
  };

  const drawFrameText = (ctx: CanvasRenderingContext2D, settings: QRSettings, totalSize: number) => {
    ctx.fillStyle = settings.foregroundColor;
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(settings.frameText, totalSize / 2, totalSize + 15);
  };

  const drawLogo = async (ctx: CanvasRenderingContext2D, settings: QRSettings, frameSize: number) => {
    return new Promise<void>((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const logoSize = settings.size * 0.2;
        const x = frameSize + (settings.size - logoSize) / 2;
        const y = frameSize + (settings.size - logoSize) / 2;

        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);

        ctx.globalAlpha = settings.logoOpacity / 100;
        ctx.drawImage(img, x, y, logoSize, logoSize);
        ctx.globalAlpha = 1;

        resolve();
      };
      img.onerror = () => resolve();
      img.src = settings.logoUrl!;
    });
  };

  const applyRoundedCorners = (
    canvas: HTMLCanvasElement,
    fgColor: string,
    bgColor: string
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const moduleSize = detectModuleSize(data, canvas.width, canvas.height);
    if (moduleSize < 3) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const radius = Math.max(1, moduleSize * 0.3);

    for (let y = 0; y < canvas.height; y += moduleSize) {
      for (let x = 0; x < canvas.width; x += moduleSize) {
        const centerX = x + Math.floor(moduleSize / 2);
        const centerY = y + Math.floor(moduleSize / 2);
        const pixelIndex = (centerY * canvas.width + centerX) * 4;

        if (pixelIndex < data.length && data[pixelIndex] < 128) {
          ctx.fillStyle = fgColor;
          drawRoundedRect(ctx, x, y, moduleSize, moduleSize, radius);
        }
      }
    }
  };

  const detectModuleSize = (data: Uint8ClampedArray, width: number, height: number): number => {
    let minRun = width;
    let currentRun = 0;
    let lastDark = false;

    const midRow = Math.floor(height / 2);

    for (let x = 0; x < width; x++) {
      const idx = (midRow * width + x) * 4;
      const isDark = data[idx] < 128;

      if (isDark === lastDark) {
        currentRun++;
      } else {
        if (currentRun > 0 && currentRun < minRun) {
          minRun = currentRun;
        }
        currentRun = 1;
        lastDark = isDark;
      }
    }

    return Math.max(3, Math.min(minRun, 20));
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  const downloadQR = (format: "png" | "jpg" | "svg") => {
    if (!qrDataUrl && format !== "svg") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let dataUrl: string;
    let filename: string;

    if (format === "svg") {
      const svgContent = generateSVG(canvas);
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      dataUrl = URL.createObjectURL(blob);
      filename = "qrcode.svg";
    } else if (format === "jpg") {
      const jpgCanvas = document.createElement("canvas");
      jpgCanvas.width = canvas.width;
      jpgCanvas.height = canvas.height;
      const jpgCtx = jpgCanvas.getContext("2d");
      if (jpgCtx) {
        jpgCtx.fillStyle = "#ffffff";
        jpgCtx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
        jpgCtx.drawImage(canvas, 0, 0);
      }
      dataUrl = jpgCanvas.toDataURL("image/jpeg", 0.95);
      filename = "qrcode.jpg";
    } else {
      dataUrl = canvas.toDataURL("image/png");
      filename = "qrcode.png";
    }

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();

    if (format === "svg") {
      URL.revokeObjectURL(dataUrl);
    }
  };

  const generateSVG = (canvas: HTMLCanvasElement) => {
    const dataUrl = canvas.toDataURL("image/png");
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${canvas.width}" height="${canvas.height}">
  <image width="${canvas.width}" height="${canvas.height}" xlink:href="${dataUrl}"/>
</svg>`;
  };

  const hasContent = settings.inputValue.trim().length > 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="relative flex items-center justify-center overflow-visible rounded-xl bg-card/50 p-8 backdrop-blur-sm">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className={`transition-opacity duration-300 ${isGenerating ? "opacity-50" : "opacity-100"}`}
            style={{
              maxWidth: "100%",
              height: "auto",
              display: hasContent ? "block" : "none",
            }}
            data-testid="canvas-qr-preview"
          />

          {!hasContent && (
            <div className="flex h-64 w-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
              <div className="grid h-32 w-32 grid-cols-3 grid-rows-3 gap-1 opacity-30">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      i === 0 || i === 2 || i === 6 ? "bg-foreground" : i === 4 ? "bg-muted-foreground" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Enter content to generate<br />your QR code
              </p>
            </div>
          )}

          {isGenerating && hasContent && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>

        {settings.scanTracking && hasContent && (
          <Badge className="absolute -top-2 right-4 gap-1 bg-primary">
            <BarChart3 className="h-3 w-3" />
            Tracking Enabled
          </Badge>
        )}
      </Card>

      <div className="flex w-full flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => downloadQR("png")}
            disabled={!hasContent || isGenerating}
            className="gap-2"
            data-testid="button-download-png"
          >
            <Image className="h-4 w-4" />
            PNG
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadQR("jpg")}
            disabled={!hasContent || isGenerating}
            className="gap-2"
            data-testid="button-download-jpg"
          >
            <FileImage className="h-4 w-4" />
            JPG
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadQR("svg")}
            disabled={!hasContent || isGenerating}
            className="gap-2"
            data-testid="button-download-svg"
          >
            <FileCode className="h-4 w-4" />
            SVG
          </Button>
        </div>

        <Button
          onClick={() => downloadQR("png")}
          disabled={!hasContent || isGenerating}
          className="w-full gap-2"
          size="lg"
          data-testid="button-download-main"
        >
          <Download className="h-5 w-5" />
          Download QR Code
        </Button>
      </div>
    </div>
  );
}
