export default function SafeCheckEmptyResult() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-800">
        아직 검사 전입니다.
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        프롬프트를 입력하고 검사하기를 누르세요.
      </p>
    </div>
  );
}