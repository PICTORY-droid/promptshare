"use client";

import { useState, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ImageSlot {
  file: File | null;
  preview: string | null;
  base64: string | null;
  mediaType: string | null;
}

const emptySlot = (): ImageSlot => ({ file: null, preview: null, base64: null, mediaType: null });
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_ALL = [...ALLOWED_IMAGE, "application/pdf"];

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function pdfToBase64(file: File): Promise<{ base64: string; preview: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx, viewport }).promise;
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  const base64 = dataUrl.split(",")[1];
  return { base64, preview: dataUrl };
}

function ImageSlotBox({ slot, label, required, badge, onFile, onClear, converting }: {
  slot: ImageSlot; label: string; required?: boolean; badge?: string;
  onFile: (f: File) => void; onClear: () => void; converting?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const handle = useCallback((file: File) => {
    if (!ALLOWED_ALL.includes(file.type)) return;
    if (file.size > 20 * 1024 * 1024) return;
    onFile(file);
  }, [onFile]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "#8b949e", fontWeight: 600 }}>
          {label} {required && <span style={{ color: "#f85149" }}>*</span>}
        </span>
        {badge && (
          <span style={{ fontSize: "10px", background: "#1f6feb22", color: "#58a6ff", border: "1px solid #1f6feb55", borderRadius: "4px", padding: "1px 6px" }}>
            {badge}
          </span>
        )}
        {slot.file && (
          <button onClick={onClear} style={{ marginLeft: "auto", background: "none", border: "none", color: "#6e7681", fontSize: "11px", cursor: "pointer" }}>
            ✕ 제거
          </button>
        )}
      </div>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handle(f); }}
        style={{ border: `2px dashed ${drag ? "#58a6ff" : slot.file ? "#238636" : "#30363d"}`, borderRadius: "8px", background: drag ? "#0d2045" : "#161b22", minHeight: "110px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", transition: "all 0.2s", position: "relative" }}
      >
        {converting ? (
          <div style={{ textAlign: "center", padding: "16px" }}>
            <div style={{ fontSize: "20px", marginBottom: "6px" }}>⏳</div>
            <div style={{ color: "#58a6ff", fontSize: "12px" }}>PDF 변환 중...</div>
          </div>
        ) : slot.preview ? (
          <>
            <img src={slot.preview} alt={label} style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "4px" }} />
            <div style={{ position: "absolute", top: "6px", right: "6px", background: "#238636", color: "#fff", fontSize: "10px", padding: "2px 7px", borderRadius: "4px" }}>✓ 완료</div>
            {slot.file?.type === "application/pdf" && (
              <div style={{ position: "absolute", top: "6px", left: "6px", background: "#1f6feb", color: "#fff", fontSize: "10px", padding: "2px 7px", borderRadius: "4px" }}>PDF</div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px" }}>
            <div style={{ fontSize: "24px", marginBottom: "6px" }}>{required ? "📋" : "🖼️"}</div>
            <div style={{ color: "#8b949e", fontSize: "12px" }}>클릭 또는 드래그</div>
            <div style={{ color: "#6e7681", fontSize: "10px", marginTop: "2px" }}>JPG · PNG · WEBP · PDF · 최대 20MB</div>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }} />
    </div>
  );
}

const CHECKLIST_ITEMS = [
  "[본인 경험 입력] 표시된 항목을 모두 직접 채웠는가",
  "수치(기간·규모·성과)가 실제 내 이력과 일치하는가",
  "회사명·직무명·프로젝트명이 정확한가",
  "자소서 내용이 면접에서 질문받았을 때 답할 수 있는가",
  "각 항목이 500자 이상인가 (부족하면 직접 보완)",
];

export default function ResumePage() {
  const [jobSlot, setJobSlot] = useState<ImageSlot>(emptySlot());
  const [resumeSlots, setResumeSlots] = useState<ImageSlot[]>([emptySlot(), emptySlot(), emptySlot()]);
  const [userInfo, setUserInfo] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false, false]);
  const [convertingIdx, setConvertingIdx] = useState<number | null>(null);
  const [convertingJob, setConvertingJob] = useState(false);
  const allChecked = checks.every(Boolean);

  const processFile = async (file: File): Promise<{ preview: string; base64: string; mediaType: string }> => {
    if (file.type === "application/pdf") {
      const { base64, preview } = await pdfToBase64(file);
      return { preview, base64, mediaType: "image/jpeg" };
    } else {
      const base64 = await toBase64(file);
      const preview = URL.createObjectURL(file);
      return { preview, base64, mediaType: file.type };
    }
  };

  const setResumeFile = useCallback(async (idx: number, file: File) => {
    setConvertingIdx(idx);
    try {
      const { preview, base64, mediaType } = await processFile(file);
      setResumeSlots((prev) => {
        const next = [...prev];
        next[idx] = { file, preview, base64, mediaType };
        return next;
      });
    } finally {
      setConvertingIdx(null);
    }
  }, []);

  const clearResumeSlot = useCallback((idx: number) => {
    setResumeSlots((prev) => { const next = [...prev]; next[idx] = emptySlot(); return next; });
  }, []);

  const setJobFile = useCallback(async (file: File) => {
    setConvertingJob(true);
    try {
      const { preview, base64, mediaType } = await processFile(file);
      setJobSlot({ file, preview, base64, mediaType });
      setResume("");
    } finally {
      setConvertingJob(false);
    }
  }, []);

  const handleGenerate = async () => {
    if (!jobSlot.file) { setError("채용공고 이미지를 먼저 업로드해주세요."); return; }
    setLoading(true); setError(""); setResume("");
    try {
      const filledSlots = resumeSlots.filter((s) => s.file !== null && s.base64 !== null);
      const resumeImages = filledSlots.map((s) => ({ base64: s.base64!, mediaType: s.mediaType! }));
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobImageBase64: jobSlot.base64,
          jobMediaType: jobSlot.mediaType,
          resumeImages: resumeImages.length > 0 ? resumeImages : undefined,
          userInfo: userInfo.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "오류가 발생했습니다."); return; }
      setResume(data.resume);
      setChecks([false, false, false, false, false]);
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(resume); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setError("복사 실패. 직접 선택 후 복사해주세요."); }
  };

  const handleReset = () => {
    setJobSlot(emptySlot()); setResumeSlots([emptySlot(), emptySlot(), emptySlot()]);
    setUserInfo(""); setResume(""); setError("");
    setChecks([false, false, false, false, false]);
  };

  const resumeFilled = resumeSlots.filter((s) => s.file).length;
  const canGenerate = !!jobSlot.file && !loading && !convertingJob && convertingIdx === null;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "'Courier New', monospace" }}>
      <div style={{ borderBottom: "1px solid #21262d", padding: "14px 24px", display: "flex", alignItems: "center", gap: "10px" }}>
        <a href="/" style={{ color: "#58a6ff", textDecoration: "none", fontSize: "13px" }}>← PromptLab</a>
        <span style={{ color: "#30363d" }}>/</span>
        <span style={{ fontSize: "13px" }}>자소서 생성기</span>
        <span style={{ background: "#1f6feb", color: "#fff", fontSize: "10px", padding: "2px 8px", borderRadius: "999px", fontWeight: "bold" }}>BETA</span>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "36px 24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "6px", lineHeight: 1.4 }}>
          채용공고 + 이력서 사진으로<br />
          <span style={{ color: "#58a6ff" }}>자소서를 완성하세요</span>
        </h1>
        <p style={{ color: "#8b949e", fontSize: "13px", marginBottom: "32px" }}>
          채용공고 캡처 1장 + 이력서 캡처 최대 3장 → AI가 맞춤 자소서 생성
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "10px", padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "#58a6ff", fontWeight: 700, marginBottom: "12px" }}>STEP 1 · 채용공고</div>
              <ImageSlotBox slot={jobSlot} label="채용공고 이미지" required converting={convertingJob} onFile={setJobFile} onClear={() => { setJobSlot(emptySlot()); setResume(""); }} />
            </div>

            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", color: "#3fb950", fontWeight: 700 }}>
                  STEP 2 · 이력서 <span style={{ color: "#6e7681", fontWeight: "normal" }}>(선택 · 1~3장 자유)</span>
                </div>
                {resumeFilled > 0 && <span style={{ fontSize: "11px", color: "#3fb950" }}>{resumeFilled}장 업로드됨</span>}
              </div>
              <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", padding: "10px 12px", fontSize: "11px", color: "#6e7681", lineHeight: 1.7, marginBottom: "14px" }}>
                📱 사람인/잡코리아/알바몬 이력서 → <strong style={{ color: "#8b949e" }}>PDF 또는 이미지로 업로드</strong><br />
                📄 PDF는 자동으로 이미지로 변환됩니다
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[0, 1, 2].map((idx) => (
                  <ImageSlotBox key={idx} slot={resumeSlots[idx]} label={`이력서 ${idx + 1}번`} badge={idx === 0 ? "상단" : idx === 1 ? "중단" : "하단"} converting={convertingIdx === idx} onFile={(f) => setResumeFile(idx, f)} onClear={() => clearResumeSlot(idx)} />
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#8b949e", fontWeight: 600, marginBottom: "6px" }}>
                STEP 3 · 추가 정보 <span style={{ color: "#6e7681", fontWeight: "normal" }}>(선택)</span>
              </label>
              <textarea value={userInfo} onChange={(e) => setUserInfo(e.target.value)} placeholder={"이력서에 없는 내용 보완\n예: 희망 연봉, 지원 이유, 강조할 경험"} rows={3}
                style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", color: "#e6edf3", fontSize: "12px", padding: "10px 12px", resize: "vertical", fontFamily: "'Courier New', monospace", boxSizing: "border-box", outline: "none", lineHeight: 1.6 }} />
            </div>

            {error && (
              <div style={{ background: "#2d1117", border: "1px solid #f85149", borderRadius: "6px", padding: "10px 14px", fontSize: "12px", color: "#f85149" }}>
                ⚠ {error}
                <div style={{ marginTop: "6px", color: "#8b949e", fontSize: "11px" }}>
                  현재 무료 API 제공. 잠시 후 다시 시도해주세요.
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleGenerate} disabled={!canGenerate}
                style={{ flex: 1, background: canGenerate ? "#238636" : "#21262d", color: canGenerate ? "#fff" : "#6e7681", border: "none", borderRadius: "8px", padding: "13px", fontSize: "14px", fontWeight: 700, cursor: canGenerate ? "pointer" : "not-allowed", fontFamily: "'Courier New', monospace" }}>
                {loading ? `⏳ AI 분석 중... (이미지 ${1 + resumeFilled}장)` : resumeFilled > 0 ? `자소서 생성 (공고 + 이력서 ${resumeFilled}장)` : "자소서 생성하기"}
              </button>
              {(jobSlot.file || resume) && (
                <button onClick={handleReset} style={{ background: "transparent", color: "#8b949e", border: "1px solid #30363d", borderRadius: "8px", padding: "13px 16px", fontSize: "12px", cursor: "pointer", fontFamily: "'Courier New', monospace" }}>초기화</button>
              )}
            </div>

            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "6px", padding: "10px 14px", fontSize: "11px", color: "#6e7681", lineHeight: 1.8 }}>
              💡 생성에는 약 20~40초 소요됩니다<br />🔒 이미지는 서버에 저장되지 않습니다
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "#8b949e", fontWeight: 600 }}>생성된 자소서</span>
              {resume && (
                <button onClick={handleCopy} disabled={!allChecked} title={!allChecked ? "체크리스트를 모두 확인 후 복사 가능" : ""}
                  style={{ background: allChecked ? (copied ? "#238636" : "#1f6feb") : "#21262d", color: allChecked ? "#fff" : "#484f58", border: `1px solid ${allChecked ? "transparent" : "#30363d"}`, borderRadius: "6px", padding: "4px 14px", fontSize: "11px", cursor: allChecked ? "pointer" : "not-allowed", fontFamily: "'Courier New', monospace" }}>
                  {!allChecked ? "🔒 체크 후 복사 가능" : copied ? "✓ 복사됨" : "복사"}
                </button>
              )}
            </div>

            <div style={{ background: "#2d1b00", border: "1px solid #bb6902", borderRadius: "6px", padding: "10px 14px", fontSize: "11px", color: "#e3b341", lineHeight: 1.7, marginBottom: "8px" }}>
              ⚠ <strong>반드시 확인하세요</strong><br />
              AI가 생성한 초안입니다. 수치·경험·회사명·날짜 등 모든 사실관계를 직접 검토·수정하세요.<br />
              <span style={{ color: "#9e7c0a" }}>[본인 경험 입력] 항목은 반드시 직접 채워주세요.</span>
            </div>

            <div style={{ flex: 1, background: "#161b22", border: `1px solid ${resume ? "#238636" : "#21262d"}`, borderRadius: "8px", padding: "16px", minHeight: "540px", overflow: "auto", position: "relative" }}>
              {loading ? (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", border: "3px solid #21262d", borderTop: "3px solid #58a6ff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <div style={{ color: "#8b949e", fontSize: "13px", textAlign: "center" }}>
                    이미지 {1 + resumeFilled}장 분석 중...<br />
                    <span style={{ color: "#6e7681", fontSize: "11px" }}>{resumeFilled > 0 ? `이력서 ${resumeFilled}장 합산 처리 중` : "채용공고 분석 중"}</span>
                  </div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : resume ? (
                <pre style={{ margin: 0, fontSize: "12px", lineHeight: 1.8, color: "#e6edf3", whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "'Courier New', monospace" }}>{resume}</pre>
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "#30363d" }}>
                  <div style={{ fontSize: "44px" }}>📝</div>
                  <div style={{ fontSize: "12px", textAlign: "center", lineHeight: 1.7 }}>채용공고 이미지를 업로드하고<br />이력서 캡처를 추가하면<br />맞춤 자소서가 생성됩니다</div>
                </div>
              )}
            </div>

            {resume && (
              <div style={{ marginTop: "10px", background: allChecked ? "#0d2218" : "#0d1f35", border: `1px solid ${allChecked ? "#23863666" : "#1f6feb44"}`, borderRadius: "6px", padding: "12px 14px", fontSize: "11px", color: "#8b949e", lineHeight: 1.8, transition: "all 0.3s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ color: allChecked ? "#3fb950" : "#58a6ff", fontWeight: 700, fontSize: "12px" }}>
                    {allChecked ? "✅ 확인 완료 — 아래 버튼을 선택하세요" : "📋 제출 전 체크리스트 (모두 체크해야 다음 단계 가능)"}
                  </div>
                  <div style={{ fontSize: "10px", color: "#6e7681" }}>{checks.filter(Boolean).length} / {CHECKLIST_ITEMS.length}</div>
                </div>
                {CHECKLIST_ITEMS.map((item, idx) => (
                  <div key={idx} onClick={() => setChecks((prev) => { const next = [...prev]; next[idx] = !next[idx]; return next; })}
                    style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer", padding: "3px 0", color: checks[idx] ? "#3fb950" : "#8b949e", transition: "color 0.15s" }}>
                    <span style={{ width: "14px", height: "14px", flexShrink: 0, border: `1px solid ${checks[idx] ? "#3fb950" : "#30363d"}`, borderRadius: "3px", background: checks[idx] ? "#238636" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", fontSize: "9px", color: "#fff", transition: "all 0.15s" }}>
                      {checks[idx] ? "✓" : ""}
                    </span>
                    <span style={{ fontSize: "11px", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}

                {allChecked && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
                    <button onClick={() => { const blob = new Blob([resume], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "자소서_PromptLab.txt"; a.click(); URL.revokeObjectURL(url); }}
                      style={{ width: "100%", background: "#21262d", color: "#e6edf3", border: "1px solid #30363d", borderRadius: "8px", padding: "11px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Courier New', monospace" }}>
                      📄 자소서 다운로드 (.txt)
                    </button>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => { sessionStorage.setItem("promptlab_resume", resume); window.location.href = "/fit-analysis"; }}
                        style={{ flex: 1, background: "#2d1b00", color: "#e3b341", border: "1px solid #bb690288", borderRadius: "8px", padding: "11px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Courier New', monospace" }}>
                        🔴 지원 핏 분석
                      </button>
                      <button onClick={() => { sessionStorage.setItem("promptlab_resume", resume); window.location.href = "/interview"; }}
                        style={{ flex: 1, background: "#1f6feb", color: "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Courier New', monospace" }}>
                        🎯 면접 질문·답변 →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}