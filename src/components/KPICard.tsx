import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

export const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
}: KPICardProps) => {
  const variantStyles = {
    default: "bg-card",
    success: "bg-gradient-to-br from-success/10 to-success/5 border-success/20",
    warning: "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20",
    destructive: "bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20",
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };

  return (
    <Card className={`p-6 ${variantStyles[variant]} border hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          {trendValue && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend === "up"
                    ? "text-success"
                    : trend === "down"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {trendValue}
              </span>
              <span className="text-xs text-muted-foreground">vs dernier mois</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-background/50 ${iconStyles[variant]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};
