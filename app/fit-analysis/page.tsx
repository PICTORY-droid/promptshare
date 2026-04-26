"use client";

import { useState, useEffect } from "react";

interface Category { name: string; score: number; feedback: string; improve: string; }
interface RedFlag { type: string; severity: "high" | "medium" | "low"; description: string; hrPerspective: string; fix: string; }
interface Strength { type: string; description: string; hrPerspective: string; }
interface FitData { totalScore: number; grade: string; gradeLabel: string; categories: Category[]; redFlags: RedFlag[]; strengths: Strength[]; summary: string; }

function parseSections(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  const parts = text.split(/(?=\n?\d+\.\s)/);
  for (const part of parts) {
    const match = part.match(/^\n?(\d+)\.\s+(.+?)(?:\n)([\s\S]*)/);
    if (match) { result[match[2].trim()] = match[3].trim(); }
  }
  const headerMatch = text.match(/^([\s\S]*?)(?=\n?\d+\.)/);
  if (headerMatch) result["__header__"] = headerMatch[1].trim();
  return result;
}

function rebuildText(original: string, sections: Record<string, string>): string {
  let result = original;
  for (const [name, body] of Object.entries(sections)) {
    if (name === "__header__") continue;
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sectionRegex = new RegExp(`(\\d+\\.\\s+${escapedName}\\s*\\n)([\\s\\S]*?)(?=\\n\\d+\\.\\s|$)`, "m");
    result = result.replace(sectionRegex, `$1${body}\n`);
  }
  return result.trim();
}

function guessSectionFromFlag(flag: RedFlag): string {
  const d = (flag.description + " " + flag.type).toLowerCase();
  if (d.includes("지원 동기") || d.includes("지원동기")) return "지원 동기";
  if (d.includes("성장") || d.includes("과정")) return "성장 과정";
  if (d.includes("직무") || d.includes("역량") || d.includes("기술")) return "직무 역량";
  if (d.includes("포부") || d.includes("입사 후")) return "입사 후 포부";
  return "";
}

const SEVERITY_COLOR = {
  high: { bg: "#2d1117", border: "#f85149", text: "#f85149", label: "주의 필요" },
  medium: { bg: "#2d1b00", border: "#e3b341", text: "#e3b341", label: "보완 권장" },
  low: { bg: "#0d1f35", border: "#58a6ff", text: "#58a6ff", label: "참고" },
};

const GRADE_COLOR: Record<string, { bg: string; border: string; text: string }> = {
  S: { bg: "#0d2218", border: "#3fb950", text: "#3fb950" },
  A: { bg: "#0d2218", border: "#3fb950", text: "#3fb950" },
  B: { bg: "#2d1b00", border: "#e3b341", text: "#e3b341" },
  C: { bg: "#2d1117", border: "#f0883e", text: "#f0883e" },
  D: { bg: "#2d1117", border: "#f85149", text: "#f85149" },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#3fb950" : score >= 60 ? "#e3b341" : "#f85149";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ flex: 1, height: "6px", background: "#21262d", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontSize: "13px", fontWeight: 700, color, minWidth: "36px", textAlign: "right" }}>{score}</span>
    </div>
  );
}

export default function FitAnalysisPage() {
  const [resumeText, setResumeText] = useState("");
  const [data, setData] = useState<FitData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFlag, setOpenFlag] = useState<number | null>(null);
  const [openStrength, setOpenStrength] = useState<number | null>(null);
  const [rewriteState, setRewriteState] = useState<Record<number, string>>({});
  const [rewrittenText, setRewrittenText] = useState<string>("");
  const [highlightedSections, setHighlightedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = sessionStorage.getItem("promptlab_resume");
    if (stored) { setResumeText(stored); sessionStorage.removeItem("promptlab_resume"); }
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 50) { setError("자소서/이력서 내용을 입력해주세요. (최소 50자 이상)"); return; }
    setLoading(true); setError(""); setData(null); setRewriteState({}); setRewrittenText(""); setHighlightedSections(new Set());
    try {
      const res = await fetch("/api/fit-analysis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeText: resumeText.trim() }) });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "오류가 발생했습니다."); return; }
      setData(json);
      setRewrittenText(resumeText.trim());
    } catch { setError("네트워크 오류가 발생했습니다."); }
    finally { setLoading(false); }
  };

  const handleRewriteFlag = async (flagIdx: number) => {
    if (!data || !rewrittenText) return;
    const flag = data.redFlags[flagIdx];
    const sectionName = guessSectionFromFlag(flag);
    const sections = parseSections(rewrittenText);
    const sectionText = sectionName ? sections[sectionName] : rewrittenText;
    if (!sectionText) { setRewriteState((p) => ({ ...p, [flagIdx]: "error" })); return; }
    setRewriteState((p) => ({ ...p, [flagIdx]: "loading" }));
    try {
      const res = await fetch("/api/rewrite-redflag", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sectionText, sectionName, flagType: flag.type, flagDescription: flag.description, flagFix: flag.fix }) });
      const json = await res.json();
      if (!res.ok) { setRewriteState((p) => ({ ...p, [flagIdx]: "error" })); return; }
      const updatedSections = { ...sections, [sectionName]: json.rewritten };
      const newText = sectionName ? rebuildText(rewrittenText, updatedSections) : json.rewritten;
      setRewrittenText(newText);
      setRewriteState((p) => ({ ...p, [flagIdx]: "done" }));
      if (sectionName) setHighlightedSections((prev) => new Set([...prev, sectionName]));
    } catch { setRewriteState((p) => ({ ...p, [flagIdx]: "error" })); }
  };

  const handleCopyRewritten = async () => {
    try { await navigator.clipboard.writeText(rewrittenText); }
    catch { setError("복사 실패. 직접 선택 후 복사해주세요."); }
  };

  const gradeColor = data ? (GRADE_COLOR[data.grade] || GRADE_COLOR["D"]) : null;
  const hasAnyRewrite = Object.values(rewriteState).some((s) => s === "done");

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "'Courier New', monospace" }}>
      <div style={{ borderBottom: "1px solid #21262d", padding: "14px 24px", display: "flex", alignItems: "center", gap: "10px" }}>
        <a href="/" style={{ color: "#58a6ff", textDecoration: "none", fontSize: "13px" }}>← PromptLab</a>
        <span style={{ color: "#30363d" }}>/</span>
        <span style={{ fontSize: "13px" }}>지원 핏 분석</span>
        <span style={{ background: "#1f6feb", color: "#fff", fontSize: "10px", padding: "2px 8px", borderRadius: "999px", fontWeight: "bold" }}>BETA</span>
        <span style={{ marginLeft: "auto", fontSize: "10px", color: "#e3b341", background: "#2d1b00", border: "1px solid #bb690244", borderRadius: "4px", padding: "2px 8px" }}>👁 인사담당자 시선으로 분석</span>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px", lineHeight: 1.4 }}>
          내 지원서를<br /><span style={{ color: "#58a6ff" }}>인사담당자 눈으로 먼저 확인하세요</span>
        </h1>
        <p style={{ color: "#8b949e", fontSize: "12px", marginBottom: "6px" }}>ATS 스코어링 기준 + 실제 HR 담당자 평가 항목 기반 · 레드플래그를 제출 전에 확인</p>
        <div style={{ fontSize: "11px", color: "#6e7681", marginBottom: "24px", padding: "8px 12px", background: "#161b22", border: "1px solid #21262d", borderRadius: "5px" }}>
          📌 채점 기준: ATS 키워드 매칭 / 경험 수치화 / 직무 적합도 / 문서 완성도
        </div>

        <div style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
            <span style={{ fontSize: "12px", color: "#8b949e", fontWeight: 600 }}>자소서 / 이력서 내용 <span style={{ color: "#f85149" }}>*</span></span>
            <span style={{ fontSize: "10px", color: resumeText.length > 50 ? "#3fb950" : "#6e7681" }}>{resumeText.length}자</span>
          </div>
          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder={"직접 작성한 자소서/이력서를 텍스트로 붙여넣기 또는 입력하세요"} rows={8}
            style={{ width: "100%", background: "#161b22", border: `1px solid ${resumeText.length > 50 ? "#238636" : "#30363d"}`, borderRadius: "8px", color: "#e6edf3", fontSize: "12px", padding: "12px", resize: "vertical", fontFamily: "'Courier New', monospace", lineHeight: 1.7, boxSizing: "border-box", outline: "none" }} />
        </div>

        {error && <div style={{ background: "#2d1117", border: "1px solid #f85149", borderRadius: "6px", padding: "10px 14px", fontSize: "12px", color: "#f85149", marginBottom: "14px" }}>⚠ {error}</div>}

        <button onClick={handleAnalyze} disabled={loading || resumeText.trim().length < 50}
          style={{ width: "100%", background: loading || resumeText.trim().length < 50 ? "#21262d" : "#1f6feb", color: loading || resumeText.trim().length < 50 ? "#6e7681" : "#fff", border: "none", borderRadius: "8px", padding: "13px", fontSize: "14px", fontWeight: 700, cursor: loading || resumeText.trim().length < 50 ? "not-allowed" : "pointer", fontFamily: "'Courier New', monospace", marginBottom: "32px" }}>
          {loading ? "⏳ 분석 중... (15~30초)" : "지원 핏 분석 시작"}
        </button>

        {data && gradeColor && (
          <div>
            <div style={{ background: "#161b22", border: `1px solid ${gradeColor.border}44`, borderRadius: "10px", padding: "20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ textAlign: "center", minWidth: "90px" }}>
                <div style={{ fontSize: "48px", fontWeight: 900, color: gradeColor.text, lineHeight: 1 }}>{data.grade}</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: gradeColor.text }}>{data.totalScore}</div>
                <div style={{ fontSize: "10px", color: "#6e7681", marginTop: "2px" }}>/ 100</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: gradeColor.text, marginBottom: "6px" }}>{data.gradeLabel}</div>
                <div style={{ fontSize: "12px", color: "#8b949e", lineHeight: 1.7 }}>{data.summary}</div>
              </div>
            </div>

            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#8b949e", fontWeight: 700, marginBottom: "14px" }}>📊 항목별 점수</div>
              {data.categories.map((cat, idx) => (
                <div key={idx} style={{ marginBottom: idx < data.categories.length - 1 ? "14px" : 0 }}>
                  <div style={{ fontSize: "12px", color: "#e6edf3", marginBottom: "5px" }}>{cat.name}</div>
                  <ScoreBar score={cat.score} />
                  <div style={{ fontSize: "11px", color: "#6e7681", marginTop: "4px", lineHeight: 1.6 }}>{cat.feedback}</div>
                  {cat.improve && <div style={{ fontSize: "10px", color: "#3fb950", marginTop: "3px" }}>→ {cat.improve}</div>}
                </div>
              ))}
            </div>

            {data.redFlags && data.redFlags.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "12px", color: "#f85149", fontWeight: 700 }}>🔴 레드플래그</span>
                  <span style={{ fontSize: "10px", color: "#6e7681", background: "#21262d", borderRadius: "4px", padding: "2px 7px" }}>인사담당자가 주의 깊게 보는 항목</span>
                  <span style={{ fontSize: "10px", color: "#f85149" }}>{data.redFlags.length}개 발견</span>
                </div>
                {data.redFlags.map((flag, idx) => {
                  const sc = SEVERITY_COLOR[flag.severity] || SEVERITY_COLOR.low;
                  const isOpen = openFlag === idx;
                  const rs = rewriteState[idx] || "idle";
                  const sectionName = guessSectionFromFlag(flag);
                  return (
                    <div key={idx} style={{ background: sc.bg, border: `1px solid ${rs === "done" ? "#3fb95066" : sc.border + "55"}`, borderRadius: "7px", marginBottom: "8px", overflow: "hidden", transition: "border-color 0.3s" }}>
                      <div onClick={() => setOpenFlag(isOpen ? null : idx)} style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "10px", color: sc.text, background: `${sc.border}22`, border: `1px solid ${sc.border}55`, borderRadius: "3px", padding: "2px 7px", flexShrink: 0 }}>{sc.label}</span>
                        <span style={{ flex: 1, fontSize: "12px", fontWeight: 600, color: "#e6edf3" }}>{flag.type}</span>
                        {rs === "done" && <span style={{ fontSize: "10px", color: "#3fb950", background: "#0d2218", border: "1px solid #23863644", borderRadius: "4px", padding: "2px 7px", marginRight: "4px" }}>✓ 수정 완료</span>}
                        {rs === "loading" && <span style={{ fontSize: "10px", color: "#e3b341", background: "#2d1b00", border: "1px solid #bb690244", borderRadius: "4px", padding: "2px 7px", marginRight: "4px" }}>⏳ 수정 중...</span>}
                        <span style={{ color: "#6e7681", fontSize: "11px" }}>{isOpen ? "▲" : "▼"}</span>
                      </div>
                      {isOpen && (
                        <div style={{ borderTop: `1px solid ${sc.border}33`, padding: "12px 14px" }}>
                          <div style={{ fontSize: "11px", color: "#cdd9e5", lineHeight: 1.7, marginBottom: "8px" }}><strong style={{ color: sc.text }}>발견된 내용 </strong>{flag.description}</div>
                          <div style={{ background: "#0d1117", border: `1px solid ${sc.border}33`, borderRadius: "5px", padding: "9px 12px", marginBottom: "8px" }}>
                            <div style={{ fontSize: "10px", color: sc.text, fontWeight: 700, marginBottom: "3px" }}>👁 인사담당자 시선</div>
                            <div style={{ fontSize: "11px", color: "#8b949e", lineHeight: 1.6 }}>{flag.hrPerspective}</div>
                          </div>
                          <div style={{ fontSize: "11px", color: "#3fb950", marginBottom: "12px" }}>→ 개선 방법: {flag.fix}</div>
                          {rs !== "done" ? (
                            <button onClick={(e) => { e.stopPropagation(); handleRewriteFlag(idx); }} disabled={rs === "loading"}
                              style={{ width: "100%", background: rs === "loading" ? "#21262d" : "#2d1b00", color: rs === "loading" ? "#6e7681" : "#e3b341", border: `1px solid ${rs === "loading" ? "#30363d" : "#bb690288"}`, borderRadius: "6px", padding: "9px", fontSize: "12px", fontWeight: 700, cursor: rs === "loading" ? "not-allowed" : "pointer", fontFamily: "'Courier New', monospace" }}>
                              {rs === "loading" ? "⏳ 해당 부분 수정 중..." : rs === "error" ? "⚠ 재시도" : `🔧 "${sectionName || "해당 부분"}"만 다시 작성`}
                            </button>
                          ) : (
                            <div style={{ background: "#0d2218", border: "1px solid #23863644", borderRadius: "6px", padding: "9px 12px", fontSize: "11px", color: "#3fb950", textAlign: "center" }}>✅ 수정 완료 — 아래 수정된 자소서에서 확인하세요</div>
                          )}
                          {rs === "error" && <div style={{ fontSize: "10px", color: "#f85149", marginTop: "6px" }}>섹션을 특정하지 못했습니다. "1. 지원 동기" 형식인지 확인해주세요.</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {hasAnyRewrite && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#3fb950", fontWeight: 700 }}>✅ 수정된 자소서 <span style={{ fontSize: "10px", color: "#6e7681", fontWeight: "normal", marginLeft: "8px" }}>수정된 섹션만 초록 하이라이트 · 다운로드 시 일반 텍스트</span></span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={handleCopyRewritten} style={{ background: "#21262d", color: "#8b949e", border: "1px solid #30363d", borderRadius: "5px", padding: "4px 12px", fontSize: "11px", cursor: "pointer", fontFamily: "'Courier New', monospace" }}>복사</button>
                    <button onClick={() => { const blob = new Blob([rewrittenText], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "자소서_수정본_PromptLab.txt"; a.click(); URL.revokeObjectURL(url); }} style={{ background: "#238636", color: "#fff", border: "none", borderRadius: "5px", padding: "4px 12px", fontSize: "11px", cursor: "pointer", fontFamily: "'Courier New', monospace" }}>📄 다운로드</button>
                  </div>
                </div>
                <div style={{ background: "#161b22", border: "1px solid #23863666", borderRadius: "8px", padding: "16px", fontSize: "12px", lineHeight: 1.8, fontFamily: "'Courier New', monospace", maxHeight: "480px", overflow: "auto" }}>
                  {(() => {
                    const lines = rewrittenText.split("\n");
                    let currentSection = "";
                    return lines.map((line, i) => {
                      const headerMatch = line.match(/^\d+\.\s+(.+)/);
                      if (headerMatch) currentSection = headerMatch[1].trim();
                      const isHighlighted = highlightedSections.has(currentSection);
                      return (
                        <div key={i} style={{ background: isHighlighted ? "#0a2a0a" : "transparent", borderLeft: isHighlighted ? "3px solid #3fb950" : "3px solid transparent", paddingLeft: isHighlighted ? "10px" : "0px", color: isHighlighted ? "#aff5b4" : "#e6edf3", marginBottom: line === "" ? "6px" : "0", transition: "background 0.3s", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                          {line || "\u00A0"}
                        </div>
                      );
                    });
                  })()}
                </div>
                <div style={{ fontSize: "10px", color: "#6e7681", marginTop: "6px" }}>⚠ 수정된 내용을 반드시 직접 검토 후 사용하세요.</div>
              </div>
            )}

            {data.strengths && data.strengths.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "12px", color: "#3fb950", fontWeight: 700 }}>🟢 강점</span>
                  <span style={{ fontSize: "10px", color: "#6e7681", background: "#21262d", borderRadius: "4px", padding: "2px 7px" }}>인사담당자가 긍정적으로 볼 항목</span>
                </div>
                {data.strengths.map((s, idx) => {
                  const isOpen = openStrength === idx;
                  return (
                    <div key={idx} style={{ background: "#0d2218", border: "1px solid #23863644", borderRadius: "7px", marginBottom: "8px", overflow: "hidden" }}>
                      <div onClick={() => setOpenStrength(isOpen ? null : idx)} style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ flex: 1, fontSize: "12px", fontWeight: 600, color: "#3fb950" }}>{s.type}</span>
                        <span style={{ color: "#6e7681", fontSize: "11px" }}>{isOpen ? "▲" : "▼"}</span>
                      </div>
                      {isOpen && (
                        <div style={{ borderTop: "1px solid #23863633", padding: "12px 14px" }}>
                          <div style={{ fontSize: "11px", color: "#cdd9e5", lineHeight: 1.7, marginBottom: "8px" }}>{s.description}</div>
                          <div style={{ background: "#0d1117", border: "1px solid #23863333", borderRadius: "5px", padding: "9px 12px" }}>
                            <div style={{ fontSize: "10px", color: "#3fb950", fontWeight: 700, marginBottom: "3px" }}>👁 인사담당자 시선</div>
                            <div style={{ fontSize: "11px", color: "#8b949e", lineHeight: 1.6 }}>{s.hrPerspective}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "6px", padding: "12px 14px", fontSize: "11px", color: "#6e7681", lineHeight: 1.8 }}>
              📌 채점 기준: ATS 키워드 매칭, 경험 수치화, 직무 적합도, 문서 완성도<br />
              ⚠ AI 분석 결과입니다. 실제 채용 결과와 다를 수 있습니다.<br />
              🔧 레드플래그 수정 후 재분석을 권장합니다.
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              <button onClick={() => { sessionStorage.setItem("promptlab_resume", rewrittenText || resumeText); window.location.href = "/interview"; }}
                style={{ flex: 1, background: "#1f6feb", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'Courier New', monospace" }}>
                🎯 면접 질문 준비하기 →
              </button>
              <button onClick={() => { setData(null); setRewriteState({}); setRewrittenText(""); setHighlightedSections(new Set()); }}
                style={{ background: "transparent", color: "#8b949e", border: "1px solid #30363d", borderRadius: "8px", padding: "12px 16px", fontSize: "12px", cursor: "pointer", fontFamily: "'Courier New', monospace" }}>
                다시 분석
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}