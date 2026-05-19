import Link from "next/link";

type HeaderAuthActionProps = {
  isLoggedIn: boolean;
};

export default function HeaderAuthAction({
  isLoggedIn,
}: HeaderAuthActionProps) {
  return (
    <div className="md:hidden">
      {isLoggedIn ? (
        <Link
          href="/logout"
          className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm"
        >
          로그아웃
        </Link>
      ) : (
        <Link
          href="/login"
          className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm"
        >
          로그인
        </Link>
      )}
    </div>
  );
}