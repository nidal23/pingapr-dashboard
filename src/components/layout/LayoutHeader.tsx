import { ThemeToggle } from "../theme/ThemeToggle";

interface LayoutHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function LayoutHeader({ title, subtitle, actions }: LayoutHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6">
      <div>
        {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {actions}
      </div>
    </div>
  );
}
