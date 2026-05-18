import PageShell from "@/shared/ui/page-shell";
import CheckPageHeader from "./CheckPageHeader";
import CheckToolGrid from "./CheckToolGrid";

type CheckShellProps = {
  email: string;
};

export default function CheckShell({}: CheckShellProps) {
  return (
    <PageShell maxWidth="lg">
      <CheckPageHeader />
      <CheckToolGrid />
    </PageShell>
  );
}