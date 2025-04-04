import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-wide text-slate-900">
          {heading}
        </h1>
        {text && <p className="text-slate-500">{text}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <Link href="/admin/settings">
          <Button variant="outline">Settings</Button>
        </Link>
      </div>
    </div>
  );
}
