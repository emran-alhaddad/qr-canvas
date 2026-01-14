import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Square, Circle, Upload, X, RotateCcw } from "lucide-react";
import { type QRSettings, type ErrorCorrectionLevel, type CornerStyle, type FrameTemplate, errorCorrectionLevels, frameTemplates } from "@/lib/qr-types";
import { useState, useRef } from "react";

interface QRSettingsPanelProps {
  settings: QRSettings;
  onSettingsChange: (settings: Partial<QRSettings>) => void;
  onReset: () => void;
}

export function QRSettingsPanel({ settings, onSettingsChange, onReset }: QRSettingsPanelProps) {
  const [shapesOpen, setShapesOpen] = useState(true);
  const [logoOpen, setLogoOpen] = useState(true);
  const [frameOpen, setFrameOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onSettingsChange({ logoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onSettingsChange({ logoUrl: null });
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <Collapsible open={shapesOpen} onOpenChange={setShapesOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-card p-4 hover-elevate">
          <span className="text-sm font-semibold uppercase tracking-wide">Shape & Color</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${shapesOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 p-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">QR Code Size</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.size]}
                onValueChange={([value]) => onSettingsChange({ size: value })}
                min={128}
                max={512}
                step={32}
                className="flex-1"
                data-testid="slider-qr-size"
              />
              <span className="min-w-[60px] text-sm text-muted-foreground">{settings.size}px</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Error Correction</Label>
            <RadioGroup
              value={settings.errorCorrection}
              onValueChange={(value) => onSettingsChange({ errorCorrection: value as ErrorCorrectionLevel })}
              className="grid grid-cols-4 gap-2"
            >
              {errorCorrectionLevels.map((level) => (
                <div key={level.value} className="relative">
                  <RadioGroupItem
                    value={level.value}
                    id={`ec-${level.value}`}
                    className="peer sr-only"
                    data-testid={`radio-error-correction-${level.value}`}
                  />
                  <Label
                    htmlFor={`ec-${level.value}`}
                    className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 text-center transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover-elevate"
                  >
                    <span className="text-sm font-semibold">{level.label}</span>
                    <span className="text-xs text-muted-foreground">{level.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fg-color" className="text-sm font-medium">Foreground</Label>
              <div className="flex items-center gap-2">
                <div
                  className="h-10 w-10 cursor-pointer rounded-lg border-2"
                  style={{ backgroundColor: settings.foregroundColor }}
                  onClick={() => document.getElementById("fg-color")?.click()}
                />
                <Input
                  id="fg-color"
                  type="color"
                  value={settings.foregroundColor}
                  onChange={(e) => onSettingsChange({ foregroundColor: e.target.value })}
                  className="sr-only"
                  data-testid="input-foreground-color"
                />
                <Input
                  type="text"
                  value={settings.foregroundColor}
                  onChange={(e) => onSettingsChange({ foregroundColor: e.target.value })}
                  className="flex-1 font-mono text-sm uppercase"
                  data-testid="input-foreground-color-text"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bg-color" className="text-sm font-medium">Background</Label>
              <div className="flex items-center gap-2">
                <div
                  className="h-10 w-10 cursor-pointer rounded-lg border-2"
                  style={{ backgroundColor: settings.backgroundColor }}
                  onClick={() => document.getElementById("bg-color")?.click()}
                />
                <Input
                  id="bg-color"
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                  className="sr-only"
                  data-testid="input-background-color"
                />
                <Input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                  className="flex-1 font-mono text-sm uppercase"
                  data-testid="input-background-color-text"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Corner Style</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={settings.cornerStyle === "square" ? "default" : "outline"}
                onClick={() => onSettingsChange({ cornerStyle: "square" as CornerStyle })}
                className="flex items-center gap-2"
                data-testid="button-corner-square"
              >
                <Square className="h-4 w-4" />
                Square
              </Button>
              <Button
                variant={settings.cornerStyle === "rounded" ? "default" : "outline"}
                onClick={() => onSettingsChange({ cornerStyle: "rounded" as CornerStyle })}
                className="flex items-center gap-2"
                data-testid="button-corner-rounded"
              >
                <Circle className="h-4 w-4" />
                Rounded
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={logoOpen} onOpenChange={setLogoOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-card p-4 hover-elevate">
          <span className="text-sm font-semibold uppercase tracking-wide">Logo</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${logoOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 p-4">
          {settings.logoUrl ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={settings.logoUrl}
                  alt="Logo preview"
                  className="h-20 w-20 rounded-lg border-2 object-contain"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -right-2 -top-2 h-6 w-6"
                  onClick={removeLogo}
                  data-testid="button-remove-logo"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Logo Opacity</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.logoOpacity]}
                    onValueChange={([value]) => onSettingsChange({ logoOpacity: value })}
                    min={20}
                    max={100}
                    step={5}
                    className="flex-1"
                    data-testid="slider-logo-opacity"
                  />
                  <span className="min-w-[40px] text-sm text-muted-foreground">{settings.logoOpacity}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => logoInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
              data-testid="dropzone-logo-upload"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium text-primary">Upload Logo</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, or SVG</span>
            </div>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            data-testid="input-logo-upload"
          />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={frameOpen} onOpenChange={setFrameOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-card p-4 hover-elevate">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wide">Frame</span>
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">NEW</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${frameOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 p-4">
          <div className="grid grid-cols-3 gap-2">
            {frameTemplates.map((template) => (
              <Button
                key={template.value}
                variant={settings.frameTemplate === template.value ? "default" : "outline"}
                onClick={() => onSettingsChange({ frameTemplate: template.value as FrameTemplate })}
                className="h-auto py-3 text-xs"
                data-testid={`button-frame-${template.value}`}
              >
                {template.label}
              </Button>
            ))}
          </div>
          {settings.frameTemplate !== "none" && (
            <div className="space-y-2">
              <Label htmlFor="frame-text" className="text-sm font-medium">Frame Text</Label>
              <Input
                id="frame-text"
                value={settings.frameText}
                onChange={(e) => onSettingsChange({ frameText: e.target.value })}
                placeholder="Scan me"
                className="rounded-lg"
                data-testid="input-frame-text"
              />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-card p-4 hover-elevate">
          <span className="text-sm font-semibold uppercase tracking-wide">Advanced</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Scan Tracking</Label>
              <p className="text-xs text-muted-foreground">Track how many times QR is scanned</p>
            </div>
            <Switch
              checked={settings.scanTracking}
              onCheckedChange={(checked) => onSettingsChange({ scanTracking: checked })}
              data-testid="switch-scan-tracking"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Button
        variant="outline"
        onClick={onReset}
        className="w-full gap-2"
        data-testid="button-reset"
      >
        <RotateCcw className="h-4 w-4" />
        Reset All Settings
      </Button>
    </div>
  );
}
