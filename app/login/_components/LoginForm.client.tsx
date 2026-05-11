import GoogleLoginButton from "./GoogleLoginButton";
import LoginDivider from "./LoginDivider";
import MagicLinkLoginForm from "./MagicLinkLoginForm.client";

export default function LoginForm() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-500">
            PromptLab Login
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            로그인
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Google 계정으로 바로 로그인하거나, 이메일 매직링크로 로그인할 수 있습니다.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <GoogleLoginButton />
          <LoginDivider />
          <MagicLinkLoginForm />
        </div>
      </div>
    </div>
  );
}
