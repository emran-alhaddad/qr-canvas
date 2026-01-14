import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type InputType, inputTypeConfig } from "@/lib/qr-types";
import { Upload } from "lucide-react";
import { useCallback, useRef } from "react";

interface QRInputFieldProps {
  inputType: InputType;
  value: string;
  onChange: (value: string) => void;
  onFileUpload?: (file: File) => void;
}

export function QRInputField({ inputType, value, onChange, onFileUpload }: QRInputFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const config = inputTypeConfig[inputType];

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (inputType === "text") {
    return (
      <div className="space-y-2">
        <Label htmlFor="qr-input" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Your Content
        </Label>
        <Textarea
          id="qr-input"
          placeholder={config.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] resize-none rounded-lg border-2 focus:border-primary"
          data-testid="input-qr-content"
        />
        <p className="text-xs text-muted-foreground">
          Your QR Code will be generated automatically
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="qr-input" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {config.label}
        </Label>
        <Input
          id="qr-input"
          type={inputType === "email" ? "email" : inputType === "phone" ? "tel" : "text"}
          placeholder={config.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 rounded-lg border-2 focus:border-primary"
          data-testid="input-qr-content"
        />
        <p className="text-xs text-muted-foreground">
          Your QR Code will be generated automatically
        </p>
      </div>

      <div className="relative">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
          data-testid="dropzone-file-upload"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium text-primary">
            Upload any file
          </span>
          <span className="text-xs text-muted-foreground">
            (.jpg, .pdf, .mp3, .docx, .pptx)
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.pdf,.mp3,.mp4,.docx,.pptx"
          onChange={handleFileChange}
          className="hidden"
          data-testid="input-file-upload"
        />
      </div>
    </div>
  );
}
