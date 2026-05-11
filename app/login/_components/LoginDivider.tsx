export default function LoginDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-semibold text-slate-400">
        또는 이메일 링크
      </span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
