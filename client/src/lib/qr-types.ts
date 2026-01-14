export type InputType = "url" | "text" | "email" | "phone" | "bitcoin" | "wifi" | "sms" | "vcard";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type CornerStyle = "square" | "rounded";

export type FrameTemplate = "none" | "simple" | "scanme" | "decorative" | "modern" | "minimal";

export interface QRSettings {
  inputType: InputType;
  inputValue: string;
  size: number;
  errorCorrection: ErrorCorrectionLevel;
  foregroundColor: string;
  backgroundColor: string;
  cornerStyle: CornerStyle;
  logoUrl: string | null;
  logoOpacity: number;
  frameTemplate: FrameTemplate;
  frameText: string;
  scanTracking: boolean;
}

export const defaultQRSettings: QRSettings = {
  inputType: "url",
  inputValue: "",
  size: 256,
  errorCorrection: "M",
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
  cornerStyle: "square",
  logoUrl: null,
  logoOpacity: 100,
  frameTemplate: "none",
  frameText: "Scan me",
  scanTracking: false,
};

export const inputTypeConfig: Record<InputType, { label: string; placeholder: string; icon: string }> = {
  url: { label: "URL", placeholder: "https://example.com", icon: "Link" },
  text: { label: "Text", placeholder: "Enter your text here...", icon: "Type" },
  email: { label: "Email", placeholder: "email@example.com", icon: "Mail" },
  phone: { label: "Phone", placeholder: "+1 234 567 8900", icon: "Phone" },
  bitcoin: { label: "Bitcoin", placeholder: "Bitcoin address", icon: "Bitcoin" },
  wifi: { label: "WiFi", placeholder: "Network name", icon: "Wifi" },
  sms: { label: "SMS", placeholder: "Phone number", icon: "MessageSquare" },
  vcard: { label: "vCard", placeholder: "Contact name", icon: "User" },
};

export const errorCorrectionLevels: { value: ErrorCorrectionLevel; label: string; description: string }[] = [
  { value: "L", label: "Low", description: "7% recovery" },
  { value: "M", label: "Medium", description: "15% recovery" },
  { value: "Q", label: "High", description: "25% recovery" },
  { value: "H", label: "Highest", description: "30% recovery" },
];

export const frameTemplates: { value: FrameTemplate; label: string }[] = [
  { value: "none", label: "None" },
  { value: "simple", label: "Simple" },
  { value: "scanme", label: "Scan Me" },
  { value: "decorative", label: "Decorative" },
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
];
