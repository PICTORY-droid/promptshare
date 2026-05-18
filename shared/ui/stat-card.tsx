import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type StatCardProps = {
  title: string;
  description?: string;
  value: ReactNode;
  helperText?: ReactNode;
};

export default function StatCard({
  title,
  description,
  value,
  helperText,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-semibold text-slate-950">
          {value}
        </div>

        {helperText ? (
          <div className="mt-2 text-sm leading-6 text-slate-600">
            {helperText}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}