import { Card, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import Link from "next/link";

export default function StatusCard({
  title,
  value,
  description,
  icon,
  href,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardDescription>{title}</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
            <span className="text-sm text-muted-foreground">
              {description}
            </span>
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
      </Card>
    </Link>
  );
}
