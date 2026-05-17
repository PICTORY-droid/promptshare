import { Card, CardContent, CardDescription } from "@/shared/ui/card";

type DeleteInfoGroup = {
  title: string;
  items: string[];
};

type DeleteInfoSectionProps = {
  title: string;
  description?: string;
  sections: DeleteInfoGroup[];
};

export default function DeleteInfoSection({
  title,
  description,
  sections,
}: DeleteInfoSectionProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <details>
          <summary className="cursor-pointer list-none">
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-800">
                {title}
              </p>
              {description ? (
                <CardDescription>{description}</CardDescription>
              ) : null}
            </div>
          </summary>

          <div className="mt-4 grid gap-4">
            {sections.map((section) => (
              <section key={section.title} className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  {section.title}
                </h2>

                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-600">
                  {section.items.map((item) => (
                    <li key={item} className="break-keep">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </details>
      </CardContent>
    </Card>
  );
}