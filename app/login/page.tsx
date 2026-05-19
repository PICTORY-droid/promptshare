import LoginForm from "./_components/LoginForm.client";

export default function LoginPage() {
  return (
    <main className="flex h-[calc(100dvh-4.5rem)] items-center bg-slate-50 px-4 pb-20 pt-2 sm:h-auto sm:py-12">
      <section className="mx-auto w-full max-w-md">
        <LoginForm />
      </section>
    </main>
  );
}