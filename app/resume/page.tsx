"use client";

import { useState } from "react";

const CHECKLIST_ITEMS = [
  "[본인 경험 입력] 표시된 항목을 모두 직접 채웠는가",
  "수치(기간·규모·성과)가 실제 내 이력과 일치하는가",
  "회사명·직무명·프로젝트명이 정확한가",
  "자소서 내용이 면접에서 질문받았을 때 답할 수 있는가",
  "각 항목이 500자 이상인가 (부족하면 직접 보완)",
];

// 이력서 빈 값 정제 — "기술 스택: , ," 같은 항목 제거
function cleanResumeInput(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      const valueMatch = line.match(/^[-\s]*[^:]+:\s*(.*)$/);
      if (valueMatch) {
        const value = valueMatch[1].replace(/[,\s]/g, "");
        if (!value) return false;
      }
      return true;
    })
    .join("\n");
}

export default function ResumePage() {
  const [jobText, setJobText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false, false]);
  const allChecked = checks.every(Boolean);

  const handleGenerate = async () => {
    if (!jobText.trim()) { setError("채용공고 내용을 입력해주세요."); return; }
    setLoading(true); setError(""); setResume("");
    try {
      const cleanedResume = resumeText.trim() ? cleanResumeInput(resumeText.trim()) : "";
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobText: jobText.trim(),
          resumeText: cleanedResume || undefined,
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
    setJobText(""); setResumeText(""); setUserInfo("");
    setResume(""); setError("");
    setChecks([false, false, false, false, false]);
  };

  const canGenerate = !!jobText.trim() && !loading;

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
          채용공고 + 이력서 텍스트로<br />
          <span style={{ color: "#58a6ff" }}>자소서를 완성하세요</span>
        </h1>
        <p style={{ color: "#8b949e", fontSize: "13px", marginBottom: "32px" }}>
          채용공고와 이력서 내용을 붙여넣으면 AI가 맞춤 자소서를 생성합니다
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* STEP 1 */}
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "10px", padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "#58a6ff", fontWeight: 700, marginBottom: "8px" }}>
                STEP 1 · 채용공고 <span style={{ color: "#f85149" }}>*</span>
              </div>
              <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", padding: "8px 12px", fontSize: "11px", color: "#6e7681", lineHeight: 1.7, marginBottom: "10px" }}>
                📋 사람인·잡코리아 채용공고 페이지에서 텍스트 전체 복사 후 붙여넣기
              </div>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder={"채용공고 내용을 여기에 붙여넣으세요\n\n예:\n[회사명] OO기업\n[직무] 마케터\n[자격요건] ...\n[우대사항] ..."}
                rows={10}
                style={{ width: "100%", background: "#0d1117", border: `1px solid ${jobText ? "#238636" : "#30363d"}`, borderRadius: "8px", color: "#e6edf3", fontSize: "12px", padding: "10px 12px", resize: "vertical", fontFamily: "'Courier New', monospace", boxSizing: "border-box", outline: "none", lineHeight: 1.6 }}
              />
              {jobText && <div style={{ fontSize: "10px", color: "#3fb950", marginTop: "4px" }}>✓ {jobText.length}자 입력됨</div>}
            </div>

            {/* STEP 2 */}
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "10px", padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "#3fb950", fontWeight: 700, marginBottom: "8px" }}>
                STEP 2 · 이력서 <span style={{ color: "#6e7681", fontWeight: "normal" }}>(선택 — 넣을수록 정확도 상승)</span>
              </div>
              <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", padding: "8px 12px", fontSize: "11px", color: "#6e7681", lineHeight: 1.7, marginBottom: "10px" }}>
                📄 학력·경력·프로젝트·기술스택·수치 포함해서 붙여넣기<br />
                <span style={{ color: "#484f58" }}>빈 항목은 자동으로 제외됩니다</span>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder={"이력서 내용을 여기에 붙여넣으세요 (선택)\n\n예:\n[학력] OO대학교 컴퓨터공학과 졸업\n[경력] OO회사 마케터 1년 5개월\n[기술] 구글 스프레드시트, Canva\n[자격증] GAC, AIPD 1급"}
                rows={10}
                style={{ width: "100%", background: "#0d1117", border: `1px solid ${resumeText ? "#238636" : "#30363d"}`, borderRadius: "8px", color: "#e6edf3", fontSize: "12px", padding: "10px 12px", resize: "vertical", fontFamily: "'Courier New', monospace", boxSizing: "border-box", outline: "none", lineHeight: 1.6 }}
              />
              {resumeText && <div style={{ fontSize: "10px", color: "#3fb950", marginTop: "4px" }}>✓ {resumeText.length}자 입력됨</div>}
            </div>

            {/* STEP 3 */}
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#8b949e", fontWeight: 600, marginBottom: "6px" }}>
                STEP 3 · 추가 정보 <span style={{ color: "#6e7681", fontWeight: "normal" }}>(선택)</span>
              </label>
              <textarea
                value={userInfo}
                onChange={(e) => setUserInfo(e.target.value)}
                placeholder={"이력서에 없는 내용 보완\n예: 강조하고 싶은 경험, 특이사항"}
                rows={3}
                style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", color: "#e6edf3", fontSize: "12px", padding: "10px 12px", resize: "vertical", fontFamily: "'Courier New', monospace", boxSizing: "border-box", outline: "none", lineHeight: 1.6 }}
              />
            </div>

            {/* 오류 */}
            {error && (
              <div style={{ background: "#2d1117", border: "1px solid #f85149", borderRadius: "6px", padding: "10px 14px", fontSize: "12px", color: "#f85149" }}>
                ⚠ {error}
                <div style={{ marginTop: "6px", color: "#8b949e", fontSize: "11px" }}>
                  무료 API 한도 초과 시 잠시 후 다시 시도해주세요.
                </div>
              </div>
            )}

            {/* 버튼 */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                style={{ flex: 1, background: canGenerate ? "#238636" : "#21262d", color: canGenerate ? "#fff" : "#6e7681", border: "none", borderRadius: "8px", padding: "13px", fontSize: "14px", fontWeight: 700, cursor: canGenerate ? "pointer" : "not-allowed", fontFamily: "'Courier New', monospace" }}
              >
                {loading ? "⏳ AI 작성 중... (15~30초)" : "자소서 생성하기"}
              </button>
              {(jobText || resume) && (
                <button
                  onClick={handleReset}
                  style={{ background: "transparent", color: "#8b949e", border: "1px solid #30363d", borderRadius: "8px", padding: "13px 16px", fontSize: "12px", cursor: "pointer", fontFamily: "'Courier New', monospace" }}
                >
                  초기화
                </button>
              )}
            </div>

            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "6px", padding: "10px 14px", fontSize: "11px", color: "#6e7681", lineHeight: 1.8 }}>
              💡 생성에는 약 15~30초 소요됩니다<br />🔒 입력 내용은 서버에 저장되지 않습니다
            </div>
          </div>

          {/* 오른쪽 — 결과 */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "#8b949e", fontWeight: 600 }}>생성된 자소서</span>
              {resume && (
                <button
                  onClick={handleCopy}
                  disabled={!allChecked}
                  title={!allChecked ? "체크리스트를 모두 확인 후 복사 가능" : ""}
                  style={{ background: allChecked ? (copied ? "#238636" : "#1f6feb") : "#21262d", color: allChecked ? "#fff" : "#484f58", border: `1px solid ${allChecked ? "transparent" : "#30363d"}`, borderRadius: "6px", padding: "4px 14px", fontSize: "11px", cursor: allChecked ? "pointer" : "not-allowed", fontFamily: "'Courier New', monospace" }}
                >
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
                    AI가 자소서 작성 중...<br />
                    <span style={{ color: "#6e7681", fontSize: "11px" }}>잠시만 기다려주세요</span>
                  </div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : resume ? (
                <pre style={{ margin: 0, fontSize: "12px", lineHeight: 1.8, color: "#e6edf3", whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "'Courier New', monospace" }}>{resume}</pre>
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "#30363d" }}>
                  <div style={{ fontSize: "44px" }}>📝</div>
                  <div style={{ fontSize: "12px", textAlign: "center", lineHeight: 1.7 }}>채용공고를 붙여넣고<br />자소서 생성하기를 누르면<br />맞춤 자소서가 완성됩니다</div>
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
                  <div
                    key={idx}
                    onClick={() => setChecks((prev) => { const next = [...prev]; next[idx] = !next[idx]; return next; })}
                    style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer", padding: "3px 0", color: checks[idx] ? "#3fb950" : "#8b949e", transition: "color 0.15s" }}
                  >
                    <span style={{ width: "14px", height: "14px", flexShrink: 0, border: `1px solid ${checks[idx] ? "#3fb950" : "#30363d"}`, borderRadius: "3px", background: checks[idx] ? "#238636" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", fontSize: "9px", color: "#fff", transition: "all 0.15s" }}>
                      {checks[idx] ? "✓" : ""}
                    </span>
                    <span style={{ fontSize: "11px", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}

                {allChecked && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
                    <button
                      onClick={() => { const blob = new Blob([resume], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "자소서_PromptLab.txt"; a.click(); URL.revokeObjectURL(url); }}
                      style={{ width: "100%", background: "#21262d", color: "#e6edf3", border: "1px solid #30363d", borderRadius: "8px", padding: "11px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Courier New', monospace" }}
                    >
                      📄 자소서 다운로드 (.txt)
                    </button>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => { sessionStorage.setItem("promptlab_resume", resume); window.location.href = "/fit-analysis"; }}
                        style={{ flex: 1, background: "#2d1b00", color: "#e3b341", border: "1px solid #bb690288", borderRadius: "8px", padding: "11px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Courier New', monospace" }}
                      >
                        🔴 지원 핏 분석
                      </button>
                      <button
                        onClick={() => { sessionStorage.setItem("promptlab_resume", resume); window.location.href = "/interview"; }}
                        style={{ flex: 1, background: "#1f6feb", color: "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Courier New', monospace" }}
                      >
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