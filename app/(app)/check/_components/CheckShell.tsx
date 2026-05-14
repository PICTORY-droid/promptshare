import CheckPageHeader from "./CheckPageHeader";
import CheckToolGrid from "./CheckToolGrid";

type CheckShellProps = {
  email: string;
};

export default function CheckShell({ email }: CheckShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4 sm:px-6 sm:py-6">
      <CheckPageHeader email={email} />
      <CheckToolGrid />
    </main>
  );
}