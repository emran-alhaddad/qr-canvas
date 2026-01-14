import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, QrCode } from "lucide-react";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">QR Code Generator</h1>
            <p className="text-xs text-muted-foreground">Create your QR code for free</p>
          </div>
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
