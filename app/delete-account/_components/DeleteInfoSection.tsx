import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/ui/card";

type DeleteInfoSectionProps = {
  title: string;
  description?: string;
  items: string[];
};

export default function DeleteInfoSection({
  title,
  description,
  items,
}: DeleteInfoSectionProps) {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>

          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-600">
            {items.map((item) => (
              <li key={item} className="break-keep">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}