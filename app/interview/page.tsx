"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Question {
  type: string;
  question: string;
  basis: string;
  answer: string;
  tailQuestion: string;
}

interface InterviewData {
  company: string;
  jobTitle: string;
  companyInfo: string;
  searchedAt: string;
  questions: Question[];
}

const TYPE_COLOR: Record<string, string> = {
  "자소서 기반 꼬리질문": "#58a6ff",
  "직무·회사 적합성": "#3fb950",
  "인성·협업": "#e3b341",
  "AI·변화 적응력": "#f778ba",
};
const TYPE_ICON: Record<string, string> = {
  "자소서 기반 꼬리질문": "📄",
  "직무·회사 적합성": "🏢",
  "인성·협업": "🤝",
  "AI·변화 적응력": "🤖",
};
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function InterviewPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobImage, setJobImage] = useState<File | null>(null);
  const [jobPreview, setJobPreview] = useState<string | null>(null);
  const [data, setData] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("promptlab_resume");
    if (stored) { setResumeText(stored); sessionStorage.removeItem("promptlab_resume"); }
  }, []);

  const handleJobFile = useCallback((file: File) => {
    if (!ALLOWED.includes(file.type)) return;
    if (file.size > 10 * 1024 * 1024) return;
    setJobImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setJobPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 50) { setError("자소서 내용을 입력해주세요. (최소 50자 이상)"); return; }
    setLoading(true); setError(""); setData(null); setOpenIdx(null); setShowAnswer({});
    try {
      setLoadingStep("채용공고 이미지 분석 중...");
      let jobImageBase64: string | undefined;
      let jobMediaType: string | undefined;
      if (jobImage) { jobImageBase64 = await toBase64(jobImage); jobMediaType = jobImage.type; }
      setLoadingStep("자소서와 채용공고 분석해서 질문 생성 중...");
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: resumeText.trim(), jobImageBase64, jobMediaType }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "오류가 발생했습니다."); return; }
      setData(json);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false); setLoadingStep("");
    }
  };

  const handleCopy = async (idx: number, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000); }
    catch { setError("복사 실패."); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "'Courier New', monospace" }}>
      <div style={{ borderBottom: "1px solid #21262d", padding: "14px 24px", display: "flex", alignItems: "center", gap: "10px" }}>
        <a href="/" style={{ color: "#58a6ff", textDecoration: "none", fontSize: "13px" }}>← PromptLab</a>
        <span style={{ color: "#30363d" }}>/</span>
        <span style={{ fontSize: "13px" }}>면접 준비</span>
        <span style={{ background: "#1f6feb", color: "#fff", fontSize: "10px", padding: "2px 8px", borderRadius: "999px", fontWeight: "bold" }}>BETA</span>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px", lineHeight: 1.4 }}>
          채용공고 + 자소서 기반<br /><span style={{ color: "#58a6ff" }}>맞춤 면접 질문</span>
        </h1>
        <p style={{ color: "#8b949e", fontSize: "12px", marginBottom: "24px" }}>채용공고 이미지 + 자소서 → 면접 질문 8개 + 모범답변 생성</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#8b949e", fontWeight: 600, marginBottom: "7px" }}>
              채용공고 이미지 <span style={{ color: "#6e7681", fontWeight: "normal" }}>(선택)</span>
            </div>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handleJobFile(f); }}
              style={{ border: `2px dashed ${drag ? "#58a6ff" : jobPreview ? "#238636" : "#30363d"}`, borderRadius: "8px", background: drag ? "#0d2045" : "#161b22", minHeight: "120px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", position: "relative" }}
            >
              {jobPreview ? (
                <>
                  <img src={jobPreview} alt="채용공고" style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "4px" }} />
                  <div style={{ position: "absolute", top: "6px", right: "6px", background: "#238636", color: "#fff", fontSize: "10px", padding: "2px 7px", borderRadius: "3px" }}>✓ 업로드됨</div>
                  <button onClick={(e) => { e.stopPropagation(); setJobImage(null); setJobPreview(null); }} style={{ position: "absolute", top: "6px", left: "6px", background: "#21262d", color: "#8b949e", border: "1px solid #30363d", borderRadius: "3px", fontSize: "10px", padding: "2px 7px", cursor: "pointer" }}>✕</button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "6px" }}>🔍</div>
                  <div style={{ color: "#8b949e", fontSize: "12px" }}>클릭 또는 드래그</div>
                  <div style={{ color: "#6e7681", fontSize: "10px", marginTop: "2px" }}>업로드 시 채용공고 내용을 분석합니다</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleJobFile(f); }} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
              <span style={{ fontSize: "12px", color: "#8b949e", fontWeight: 600 }}>자소서 내용 <span style={{ color: "#f85149" }}>*</span></span>
              <span style={{ fontSize: "10px", color: resumeText.length > 50 ? "#3fb950" : "#6e7681" }}>{resumeText.length}자</span>
            </div>
            <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder={"직접 작성한 자소서를 텍스트로 붙여넣기 또는 입력하세요"} rows={6}
              style={{ width: "100%", background: "#161b22", border: `1px solid ${resumeText.length > 50 ? "#238636" : "#30363d"}`, borderRadius: "8px", color: "#e6edf3", fontSize: "12px", padding: "11px", resize: "vertical", fontFamily: "'Courier New', monospace", lineHeight: 1.7, boxSizing: "border-box", outline: "none" }} />
          </div>
        </div>

        <div style={{ background: "#2d1b00", border: "1px solid #bb6902", borderRadius: "6px", padding: "9px 13px", fontSize: "11px", color: "#e3b341", lineHeight: 1.7, marginBottom: "14px" }}>
          ⚠ 답변은 자소서에 실제로 쓴 내용만 사용합니다 · <span style={{ color: "#9e7c0a" }}>[수치 직접 입력] 표시는 반드시 실제 수치로 교체</span>
        </div>

        {error && <div style={{ background: "#2d1117", border: "1px solid #f85149", borderRadius: "6px", padding: "10px 14px", fontSize: "12px", color: "#f85149", marginBottom: "14px" }}>⚠ {error}</div>}

        <button onClick={handleGenerate} disabled={loading || resumeText.trim().length < 50}
          style={{ width: "100%", background: loading || resumeText.trim().length < 50 ? "#21262d" : "#238636", color: loading || resumeText.trim().length < 50 ? "#6e7681" : "#fff", border: "none", borderRadius: "8px", padding: "13px", fontSize: "14px", fontWeight: 700, cursor: loading || resumeText.trim().length < 50 ? "not-allowed" : "pointer", fontFamily: "'Courier New', monospace", marginBottom: "24px" }}>
          {loading ? `⏳ ${loadingStep}` : "면접 질문 + 답변 생성하기"}
        </button>

        {data && (
          <div>
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>{data.company} — {data.jobTitle}</div>
              {data.companyInfo && <div style={{ fontSize: "11px", color: "#8b949e", lineHeight: 1.7, marginBottom: "6px" }}><span style={{ color: "#3fb950", fontWeight: 700 }}>📋 채용공고 분석 </span>{data.companyInfo}</div>}
              <div style={{ fontSize: "10px", color: "#6e7681" }}>총 {data.questions.length}개 질문</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                {Object.entries(TYPE_COLOR).map(([type, color]) => (
                  <span key={type} style={{ fontSize: "10px", color, background: `${color}15`, border: `1px solid ${color}44`, borderRadius: "4px", padding: "2px 7px" }}>{TYPE_ICON[type]} {type}</span>
                ))}
              </div>
            </div>

            {data.questions.map((q, idx) => {
              const color = TYPE_COLOR[q.type] || "#8b949e";
              const icon = TYPE_ICON[q.type] || "❓";
              const isOpen = openIdx === idx;
              const answerVisible = showAnswer[idx];
              return (
                <div key={idx} style={{ background: "#161b22", border: `1px solid ${isOpen ? color + "66" : "#21262d"}`, borderRadius: "8px", marginBottom: "9px", overflow: "hidden" }}>
                  <div onClick={() => setOpenIdx(isOpen ? null : idx)} style={{ padding: "13px 15px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ fontSize: "10px", color, background: `${color}15`, border: `1px solid ${color}44`, borderRadius: "4px", padding: "2px 7px", flexShrink: 0, marginTop: "1px" }}>{icon} {q.type}</span>
                    <div style={{ flex: 1, fontSize: "13px", fontWeight: 600, color: "#e6edf3", lineHeight: 1.5 }}>Q{idx + 1}. {q.question}</div>
                    <div style={{ color: "#6e7681", fontSize: "11px", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</div>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop: `1px solid ${color}33`, padding: "14px 15px" }}>
                      {q.basis && <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: "5px", padding: "8px 11px", marginBottom: "12px", fontSize: "11px", color: "#6e7681" }}><span style={{ color: "#8b949e", fontWeight: 700 }}>📌 질문 근거 </span>{q.basis}</div>}
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
                          <span style={{ fontSize: "11px", color: "#3fb950", fontWeight: 700 }}>💬 모범답변</span>
                          <div style={{ display: "flex", gap: "7px" }}>
                            <button onClick={() => setShowAnswer((p) => ({ ...p, [idx]: !p[idx] }))} style={{ background: "#21262d", color: "#8b949e", border: "1px solid #30363d", borderRadius: "4px", padding: "3px 9px", fontSize: "10px", cursor: "pointer", fontFamily: "'Courier New', monospace" }}>{answerVisible ? "숨기기" : "답변 보기"}</button>
                            {answerVisible && <button onClick={() => handleCopy(idx, q.answer)} style={{ background: copiedIdx === idx ? "#238636" : "#21262d", color: copiedIdx === idx ? "#fff" : "#8b949e", border: "1px solid #30363d", borderRadius: "4px", padding: "3px 9px", fontSize: "10px", cursor: "pointer", fontFamily: "'Courier New', monospace" }}>{copiedIdx === idx ? "✓ 복사됨" : "복사"}</button>}
                          </div>
                        </div>
                        {answerVisible
                          ? <div style={{ background: "#0d1117", border: "1px solid #238636", borderRadius: "5px", padding: "11px 13px", fontSize: "12px", lineHeight: 1.8, color: "#cdd9e5" }}>{q.answer}</div>
                          : <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: "5px", padding: "11px 13px", fontSize: "12px", color: "#484f58", textAlign: "center" }}>먼저 스스로 답변해본 후 확인하세요</div>}
                      </div>
                      <div style={{ background: "#0d1f35", border: "1px solid #1f6feb33", borderRadius: "5px", padding: "9px 12px" }}>
                        <div style={{ fontSize: "10px", color: "#58a6ff", fontWeight: 700, marginBottom: "4px" }}>🔗 예상 꼬리질문</div>
                        <div style={{ fontSize: "12px", color: "#8b949e", lineHeight: 1.6 }}>{q.tailQuestion}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "6px", padding: "11px 14px", fontSize: "11px", color: "#6e7681", lineHeight: 1.8, marginTop: "12px" }}>
              💡 답변을 바로 보지 말고 먼저 스스로 말해본 후 확인하세요<br />
              ⚠ [수치 직접 입력] 표시는 반드시 실제 수치로 교체하세요
            </div>
          </div>
        )}
      </div>
    </div>
  );
}