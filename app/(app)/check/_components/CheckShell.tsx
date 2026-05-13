import CheckPageHeader from "./CheckPageHeader";
import CheckToolGrid from "./CheckToolGrid";

type CheckShellProps = {
  email: string;
};

export default function CheckShell({ email }: CheckShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8">
      <CheckPageHeader email={email} />
      <CheckToolGrid />
    </main>
  );
}
