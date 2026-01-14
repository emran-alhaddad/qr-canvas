import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { InputTypeSelector } from "@/components/input-type-selector";
import { QRInputField } from "@/components/qr-input-field";
import { QRSettingsPanel } from "@/components/qr-settings-panel";
import { QRPreview } from "@/components/qr-preview";
import { type QRSettings, type InputType, defaultQRSettings } from "@/lib/qr-types";

export default function Home() {
  const [settings, setSettings] = useState<QRSettings>(defaultQRSettings);

  const handleSettingsChange = useCallback((newSettings: Partial<QRSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const handleInputTypeChange = useCallback((type: InputType) => {
    setSettings((prev) => ({
      ...prev,
      inputType: type,
      inputValue: "",
    }));
  }, []);

  const handleReset = useCallback(() => {
    setSettings(defaultQRSettings);
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSettings((prev) => ({
        ...prev,
        inputValue: `File: ${file.name}`,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,1fr] lg:gap-8">
          <div className="order-2 space-y-6 lg:order-1">
            <Card className="overflow-hidden rounded-xl border-0 bg-gradient-to-br from-card/80 to-card/40 p-6 shadow-xl backdrop-blur-lg">
              <div className="space-y-6">
                <InputTypeSelector
                  value={settings.inputType}
                  onChange={handleInputTypeChange}
                />

                <QRInputField
                  inputType={settings.inputType}
                  value={settings.inputValue}
                  onChange={(value) => handleSettingsChange({ inputValue: value })}
                  onFileUpload={handleFileUpload}
                />
              </div>
            </Card>

            <Card className="overflow-hidden rounded-xl border-0 bg-gradient-to-br from-card/80 to-card/40 p-0 shadow-xl backdrop-blur-lg">
              <QRSettingsPanel
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onReset={handleReset}
              />
            </Card>
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-visible rounded-xl border-0 bg-gradient-to-br from-card/80 to-card/40 p-6 shadow-xl backdrop-blur-lg">
              <div className="mb-4 text-center">
                <h2 className="text-lg font-semibold">QR Code Preview</h2>
                <p className="text-sm text-muted-foreground">Changes appear in real-time</p>
              </div>
              <QRPreview settings={settings} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
