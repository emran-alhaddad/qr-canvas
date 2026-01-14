import { Button } from "@/components/ui/button";
import { type InputType, inputTypeConfig } from "@/lib/qr-types";
import { Link, Type, Mail, Phone, Bitcoin, Wifi, MessageSquare, User } from "lucide-react";

const iconMap = {
  Link,
  Type,
  Mail,
  Phone,
  Bitcoin,
  Wifi,
  MessageSquare,
  User,
};

interface InputTypeSelectorProps {
  value: InputType;
  onChange: (type: InputType) => void;
}

export function InputTypeSelector({ value, onChange }: InputTypeSelectorProps) {
  const types = Object.entries(inputTypeConfig) as [InputType, typeof inputTypeConfig[InputType]][];

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Input Type
      </label>
      <div className="grid grid-cols-4 gap-2">
        {types.map(([type, config]) => {
          const Icon = iconMap[config.icon as keyof typeof iconMap];
          const isActive = value === type;
          
          return (
            <Button
              key={type}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(type)}
              data-testid={`button-input-type-${type}`}
              className={`flex flex-col items-center gap-1 h-auto py-3 transition-all ${
                isActive ? "" : "hover-elevate"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium">{config.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
