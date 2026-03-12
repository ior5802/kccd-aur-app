import { useState } from "react";

const STRATEGIC_GOALS = [
  "Goal 1: Student Success & Equity",
  "Goal 2: Academic Quality & Innovation",
  "Goal 3: College Engagement & Partnerships",
  "Goal 4: Compliance & Governance",
  "Goal 5: Organizational Effectiveness",
  "Goal 6: Fiscal Sustainability",
  "Goal 7: Vision 2030 – Workforce & Community"
];

const THEME_AREAS = [
  "Compliance & Governance",
  "Decision Support & Strategy",
  "College Engagement",
  "Fiscal Sustainability",
  "Student Success",
  "Operational Excellence"
];

const DEPARTMENTS = [
  "Institutional Research & Reporting (IRR)",
  "Human Resources",
  "Fiscal Services",
  "Information Technology",
  "Student Services",
  "Academic Affairs",
  "Facilities & Operations",
  "Chancellor's Office"
];

const COLLEGES = ["Bakersfield College (BC)", "Cerro Coso (CC)", "Porterville College (PC)", "District Office"];

const YEAR_TYPE = new Date().getFullYear() % 2 === 1 ? "full" : "abbreviated";

const SECTIONS_FULL = [1,2,3,4,5,6,7];
const SECTIONS_ABBREV = [1,2,3,"4B",7];

const sectionLabels = {
  1: "Executive Summary",
  2: "Accomplishments & Impact",
  3: "Strategic Goals 2025–2027",
  4: "Staffing & Fiscal Plan",
  "4B": "New Resource Requests",
  5: "Special Projects & Software",
  6: "Support for Colleges",
  7: "Conclusion & Forward Strategy"
};

const initialForm = {
  department: "",
  submitterName: "",
  submitterTitle: "",
  submissionYear: new Date().getFullYear(),
  yearType: YEAR_TYPE,
  // Section 1
  executiveSummary: "",
  strategicInitiatives: [],
  pastInvestmentImpact: "",
  // Section 2
  majorProjects: [{ title: "", results: "", strategicGoal: "" }],
  serviceEnhancements: "",
  caseExamples: "",
  kpis: [{ name: "", metric: "" }],
  // Section 3
  strategicGoalsRoadmap: [{ goal: "", description: "", timeline: "", alignment: "", theme: "" }],
  // Section 4
  currentStaffingOverview: "",
  gapAnalysis: "",
  growthPlan: "",
  impactsIfUnmet: "",
  ongoingCommitments: [{ category: "", description: "", cost: "", notes: "" }],
  newResourceRequests: [{ request: "", amount: "", justification: "", alignment: "", priority: "Medium" }],
  // Section 5
  oneTimeSoftwareNeeds: [{ item: "", cost: "", benefit: "", sustainability: "" }],
  infrastructurePlanning: "",
  pilotInitiatives: "",
  // Section 6
  collegeSupport: [{ serviceType: "", description: "", collegesServed: [], outcomes: "" }],
  transparencyStatement: "",
  // Section 7
  visionStatement: "",
  fiscalSummary: "",
  partnershipInvitation: "",
  forwardGoals: [{ unit: "", priority: "", focus: "" }],
  // Feedback
  feedbackQuestions: "",
  feedbackClarifications: "",
  feedbackConcerns: "",
  feedbackReviewed: false,
  feedbackReviewDate: ""
};

function Tag({ children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red: "bg-red-50 text-red-700 border-red-200"
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
}

function SectionHeader({ number, title, badge }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-slate-100">
      <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
        {number}
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-800 leading-tight">{title}</h2>
        {badge && <Tag color="blue">{badge}</Tag>}
      </div>
    </div>
  );
}

function Field({ label, hint, children, required }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";
const textareaCls = `${inputCls} resize-none`;
const selectCls = `${inputCls} cursor-pointer`;

function DynamicRows({ label, hint, rows, setRows, fields, addLabel }) {
  const add = () => setRows([...rows, Object.fromEntries(fields.map(f => [f.key, f.default ?? ""]))]);
  const remove = i => setRows(rows.filter((_, idx) => idx !== i));
  const update = (i, key, val) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [key]: val };
    setRows(updated);
  };
  return (
    <div className="mb-5">
      {label && <p className="text-sm font-semibold text-slate-700 mb-2">{label}</p>}
      {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-slate-300 hover:text-red-400 text-lg leading-none">×</button>
            <div className="grid grid-cols-1 gap-3 pr-6">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea rows={2} className={textareaCls} value={row[f.key] || ""} onChange={e => update(i, f.key, e.target.value)} placeholder={f.placeholder || ""} />
                  ) : f.type === "select" ? (
                    <select className={selectCls} value={row[f.key] || ""} onChange={e => update(i, f.key, e.target.value)}>
                      <option value="">Select…</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "multiselect" ? (
                    <div className="flex flex-wrap gap-2">
                      {f.options.map(o => (
                        <label key={o} className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
                          <input type="checkbox" checked={(row[f.key] || []).includes(o)}
                            onChange={e => {
                              const cur = row[f.key] || [];
                              update(i, f.key, e.target.checked ? [...cur, o] : cur.filter(x => x !== o));
                            }} className="accent-indigo-600" />
                          {o}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input type="text" className={inputCls} value={row[f.key] || ""} onChange={e => update(i, f.key, e.target.value)} placeholder={f.placeholder || ""} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
        <span className="text-lg leading-none">+</span> {addLabel || "Add Row"}
      </button>
    </div>
  );
}

function NavDot({ active, done, onClick, label }) {
  return (
    <button onClick={onClick} title={label}
      className={`w-3 h-3 rounded-full transition-all duration-200 ${active ? "bg-indigo-600 scale-125" : done ? "bg-indigo-300" : "bg-slate-200 hover:bg-slate-300"}`} />
  );
}

export default function AURApp() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0); // 0 = cover, 1-7 = sections, 8 = feedback, 9 = review
  const [submitted, setSubmitted] = useState(false);

  const activeSections = YEAR_TYPE === "full" ? SECTIONS_FULL : SECTIONS_ABBREV;
  const totalSteps = activeSections.length + 3; // cover + sections + feedback + review

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setArr = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const stepLabels = ["Cover", ...activeSections.map(s => sectionLabels[s]), "Feedback", "Review & Submit"];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">AUR Submitted!</h1>
          <p className="text-slate-500 mb-1">{form.department}</p>
          <p className="text-slate-400 text-sm mb-6">Submitted by {form.submitterName} · {form.submissionYear}</p>
          <Tag color="green">{form.yearType === "full" ? "Full AUR – All 7 Sections" : "Abbreviated Update"}</Tag>
          <div className="mt-8 p-4 bg-slate-50 rounded-xl text-left text-sm text-slate-600">
            <p className="font-semibold text-slate-700 mb-2">Next Steps:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Review compiled at Chancellor's Cabinet</li>
              <li>College feedback due within 30 days</li>
              <li>Department response required by noted date</li>
            </ul>
          </div>
          <button onClick={() => { setSubmitted(false); setStep(0); setForm(initialForm); }}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
            Start New AUR
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    // Cover page
    if (step === 0) return (
      <div>
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">Kern Community College District</div>
          <h1 className="text-3xl font-bold mb-1">Annual Unit Review</h1>
          <p className="text-indigo-200 text-sm">Strategic Accountability & Planning Document</p>
          <div className="mt-4 flex gap-2">
            <Tag color="purple">{new Date().getFullYear()}</Tag>
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
              {YEAR_TYPE === "full" ? "Full AUR – All 7 Sections" : "Abbreviated Update – Even Year"}
            </span>
          </div>
        </div>
        <Field label="Department / Service Unit" required>
          <select className={selectCls} value={form.department} onChange={e => set("department", e.target.value)}>
            <option value="">Select department…</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Submitter Name" required>
            <input type="text" className={inputCls} value={form.submitterName} onChange={e => set("submitterName", e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Title / Role">
            <input type="text" className={inputCls} value={form.submitterTitle} onChange={e => set("submitterTitle", e.target.value)} placeholder="e.g., Director of IR" />
          </Field>
        </div>
        <Field label="Submission Year">
          <input type="number" className={inputCls} value={form.submissionYear} onChange={e => set("submissionYear", e.target.value)} />
        </Field>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <span className="font-bold">Submission Cycle:</span> {YEAR_TYPE === "full"
            ? "This is an odd year — a Full AUR with all 7 sections is required."
            : "This is an even year — an Abbreviated Update (Sections 1, 2, 3, 4B, and 7) is required."}
        </div>
      </div>
    );

    // Section 1: Executive Summary
    if (step === 1) return (
      <div>
        <SectionHeader number={1} title="Executive Summary" badge="Narrative-Based" />
        <Field label="Department Strategic Role & Vision" hint="Frame the department's role, major accomplishments, and vision for the next planning cycle. Emphasize districtwide impact." required>
          <textarea rows={5} className={textareaCls} value={form.executiveSummary} onChange={e => set("executiveSummary", e.target.value)} placeholder="Describe your department's strategic role and vision…" />
        </Field>
        <Field label="Strategic Initiatives Supported" hint="Select all district strategic initiatives this department actively supports.">
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            {STRATEGIC_GOALS.map(g => (
              <label key={g} className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer hover:text-indigo-700">
                <input type="checkbox" className="accent-indigo-600"
                  checked={form.strategicInitiatives.includes(g)}
                  onChange={e => set("strategicInitiatives", e.target.checked
                    ? [...form.strategicInitiatives, g]
                    : form.strategicInitiatives.filter(x => x !== g))} />
                {g}
              </label>
            ))}
          </div>
        </Field>
        <Field label="How Past Investments Improved College-Level Service" hint="Reflect on how resources from prior cycles delivered impact.">
          <textarea rows={3} className={textareaCls} value={form.pastInvestmentImpact} onChange={e => set("pastInvestmentImpact", e.target.value)} placeholder="Describe outcomes from prior investments…" />
        </Field>
      </div>
    );

    // Section 2: Accomplishments & Impact
    if (step === 2) return (
      <div>
        <SectionHeader number={2} title="Narrative of Key Accomplishments & Impact" />
        <DynamicRows
          label="Major Projects Completed"
          hint="Include results and strategic impact for each project."
          rows={form.majorProjects}
          setRows={v => setArr("majorProjects", v)}
          fields={[
            { key: "title", label: "Project Title", placeholder: "e.g., Deploy iData Cookbook" },
            { key: "results", label: "Results & Impact", type: "textarea", placeholder: "Describe outcomes…" },
            { key: "strategicGoal", label: "Strategic Goal Alignment", type: "select", options: STRATEGIC_GOALS }
          ]}
          addLabel="Add Project"
        />
        <Field label="Service Enhancements" hint="e.g., Expansion of service scope, improved delivery, new capabilities.">
          <textarea rows={3} className={textareaCls} value={form.serviceEnhancements} onChange={e => set("serviceEnhancements", e.target.value)} placeholder="Describe service enhancements this cycle…" />
        </Field>
        <DynamicRows
          label="Key Performance Indicators (KPIs)"
          rows={form.kpis}
          setRows={v => setArr("kpis", v)}
          fields={[
            { key: "name", label: "KPI Name", placeholder: "e.g., MIS Submission Accuracy" },
            { key: "metric", label: "Result / Metric", placeholder: "e.g., On time for all submissions" }
          ]}
          addLabel="Add KPI"
        />
        <Field label="Case Examples" hint="Short narratives from colleges or district showing how services informed decisions.">
          <textarea rows={3} className={textareaCls} value={form.caseExamples} onChange={e => set("caseExamples", e.target.value)} placeholder="e.g., 'Bakersfield College used our enrollment dashboard to…'" />
        </Field>
      </div>
    );

    // Section 3: Strategic Goals
    if (step === 3) return (
      <div>
        <SectionHeader number={3} title="Strategic Goals & Priority Areas 2025–2027" badge="Roadmap Format" />
        <p className="text-sm text-slate-500 mb-5">Present as a roadmap. Group goals thematically: Compliance & Governance, Decision Support & Strategy, College Engagement.</p>
        <DynamicRows
          rows={form.strategicGoalsRoadmap}
          setRows={v => setArr("strategicGoalsRoadmap", v)}
          fields={[
            { key: "goal", label: "Department Goal", placeholder: "e.g., Strengthen Data Governance" },
            { key: "description", label: "Description", type: "textarea", placeholder: "What will be accomplished…" },
            { key: "timeline", label: "Timeline", placeholder: "e.g., FY 2025" },
            { key: "alignment", label: "Strategic Goal Alignment", type: "select", options: STRATEGIC_GOALS },
            { key: "theme", label: "Thematic Area", type: "select", options: THEME_AREAS }
          ]}
          addLabel="Add Goal"
        />
      </div>
    );

    // Section 4: Staffing & Fiscal
    if (step === 4) return (
      <div>
        <SectionHeader number={4} title="Staffing & Fiscal Sustainability Plan" />
        <Field label="Current Staffing Overview" hint="Describe current staffing structure and capacity.">
          <textarea rows={3} className={textareaCls} value={form.currentStaffingOverview} onChange={e => set("currentStaffingOverview", e.target.value)} placeholder="Describe current team structure…" />
        </Field>
        <Field label="Gap Analysis" hint="What current staffing cannot support — be specific.">
          <textarea rows={3} className={textareaCls} value={form.gapAnalysis} onChange={e => set("gapAnalysis", e.target.value)} placeholder="Describe gaps in capacity or capability…" />
        </Field>
        <Field label="Growth Plan" hint="Roles needed (e.g., Senior Analyst, Data Scientist). Tie to district initiatives.">
          <textarea rows={3} className={textareaCls} value={form.growthPlan} onChange={e => set("growthPlan", e.target.value)} placeholder="Describe planned staffing growth…" />
        </Field>
        <Field label="Impacts if Resource Needs are Unmet">
          <textarea rows={2} className={textareaCls} value={form.impactsIfUnmet} onChange={e => set("impactsIfUnmet", e.target.value)} placeholder="Describe operational or strategic risk…" />
        </Field>
        <div className="mt-6">
          <p className="text-sm font-bold text-slate-700 mb-1">4A. Ongoing Off-the-Top Commitments</p>
          <DynamicRows
            rows={form.ongoingCommitments}
            setRows={v => setArr("ongoingCommitments", v)}
            fields={[
              { key: "category", label: "Category", placeholder: "e.g., Software, Staffing, Contracts" },
              { key: "description", label: "Description", placeholder: "e.g., Tableau, Invoke, iData" },
              { key: "cost", label: "Cost", placeholder: "$XX,XXX" },
              { key: "notes", label: "Notes", placeholder: "e.g., Supports all colleges" }
            ]}
            addLabel="Add Commitment"
          />
        </div>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
          <strong>Note:</strong> All new resource requests must demonstrate districtwide benefit. College-only projects are not supported through this process.
        </div>
        <div className="mt-6">
          <p className="text-sm font-bold text-slate-700 mb-1">4B. New Resource Requests</p>
          <DynamicRows
            rows={form.newResourceRequests}
            setRows={v => setArr("newResourceRequests", v)}
            fields={[
              { key: "request", label: "Request", placeholder: "e.g., Senior Research Analyst" },
              { key: "amount", label: "Amount", placeholder: "$XX,XXX" },
              { key: "justification", label: "Justification", type: "textarea", placeholder: "Why is this needed?" },
              { key: "alignment", label: "Goal Alignment", type: "select", options: STRATEGIC_GOALS },
              { key: "priority", label: "Priority", type: "select", options: ["High", "Medium", "Low"], default: "Medium" }
            ]}
            addLabel="Add Request"
          />
        </div>
      </div>
    );

    // Section 5: Special Projects & Software
    if (step === 5) return (
      <div>
        <SectionHeader number={5} title="Special Projects & Software Budget Planning" badge="New Phase" />
        <DynamicRows
          label="One-Time Software Needs"
          hint="e.g., Invoke Clarity, Tableau licenses, post-Cognos reporting tools"
          rows={form.oneTimeSoftwareNeeds}
          setRows={v => setArr("oneTimeSoftwareNeeds", v)}
          fields={[
            { key: "item", label: "Software / Tool", placeholder: "e.g., Invoke Clarity" },
            { key: "cost", label: "Estimated Cost", placeholder: "$XX,XXX" },
            { key: "benefit", label: "Benefit", type: "textarea", placeholder: "Describe expected benefit…" },
            { key: "sustainability", label: "Sustainability Strategy", placeholder: "How will this be maintained long-term?" }
          ]}
          addLabel="Add Software Need"
        />
        <Field label="Infrastructure Planning" hint="Planning for new reporting tools post-Cognos, system migrations, etc.">
          <textarea rows={3} className={textareaCls} value={form.infrastructurePlanning} onChange={e => set("infrastructurePlanning", e.target.value)} placeholder="Describe infrastructure planning needs…" />
        </Field>
        <Field label="Pilot Initiatives Requiring Investment">
          <textarea rows={3} className={textareaCls} value={form.pilotInitiatives} onChange={e => set("pilotInitiatives", e.target.value)} placeholder="e.g., Departmental dashboard curation pilot…" />
        </Field>
      </div>
    );

    // Section 6: College Support
    if (step === 6) return (
      <div>
        <SectionHeader number={6} title="Support for Colleges & District Accountability" />
        <DynamicRows
          label="College Support Services"
          hint="Highlight how your department supports each college."
          rows={form.collegeSupport}
          setRows={v => setArr("collegeSupport", v)}
          fields={[
            { key: "serviceType", label: "Service Type", placeholder: "e.g., Research Support, Training" },
            { key: "description", label: "Description", type: "textarea", placeholder: "Describe the service…" },
            { key: "collegesServed", label: "Colleges Served", type: "multiselect", options: COLLEGES, default: [] },
            { key: "outcomes", label: "Outcomes", placeholder: "e.g., $X in grants secured" }
          ]}
          addLabel="Add Service"
        />
        <Field label="Transparency, Accuracy & Compliance Statement" hint="How does your department ensure accountability in service delivery?">
          <textarea rows={3} className={textareaCls} value={form.transparencyStatement} onChange={e => set("transparencyStatement", e.target.value)} placeholder="Describe your accountability mechanisms…" />
        </Field>
      </div>
    );

    // Section 7: Conclusion
    if (step === 7) return (
      <div>
        <SectionHeader number={7} title="Conclusion & Forward Strategy" />
        <Field label="Strategic Vision Statement for the Year" hint="The theme for the coming cycle — what you want to accomplish." required>
          <textarea rows={3} className={textareaCls} value={form.visionStatement} onChange={e => set("visionStatement", e.target.value)} placeholder="e.g., 'Becoming a data-informed district through accessible, timely, and trusted research.'" />
        </Field>
        <DynamicRows
          label="Forward Goals Table"
          rows={form.forwardGoals}
          setRows={v => setArr("forwardGoals", v)}
          fields={[
            { key: "unit", label: "Goal / Activity", placeholder: "e.g., Expand Tableau training" },
            { key: "priority", label: "Linked Strategic Priority", type: "select", options: STRATEGIC_GOALS },
            { key: "focus", label: "Year-Specific Focus", placeholder: "e.g., 2025: Data coaching initiative" }
          ]}
          addLabel="Add Forward Goal"
        />
        <Field label="Summary of Fiscal Asks & Connection to Vision" hint="How do your resource requests tie to delivering on the vision?">
          <textarea rows={3} className={textareaCls} value={form.fiscalSummary} onChange={e => set("fiscalSummary", e.target.value)} placeholder="Summarize how fiscal requests enable the vision…" />
        </Field>
        <Field label="Invitation to Partner in Accountability with Colleges">
          <textarea rows={2} className={textareaCls} value={form.partnershipInvitation} onChange={e => set("partnershipInvitation", e.target.value)} placeholder="e.g., We invite college partners to engage with us on…" />
        </Field>
      </div>
    );

    // Feedback
    if (step === activeSections.length + 1) return (
      <div>
        <SectionHeader number="✉" title="Feedback & College Review" />
        <p className="text-sm text-slate-500 mb-6">Space for colleges to respond. Department leaders will respond to feedback compiled at Chancellor's Cabinet.</p>
        <Field label="Questions from Colleges">
          <textarea rows={3} className={textareaCls} value={form.feedbackQuestions} onChange={e => set("feedbackQuestions", e.target.value)} placeholder="List any questions received from college partners…" />
        </Field>
        <Field label="Clarifications">
          <textarea rows={3} className={textareaCls} value={form.feedbackClarifications} onChange={e => set("feedbackClarifications", e.target.value)} placeholder="Note clarifications needed or provided…" />
        </Field>
        <Field label="Concerns">
          <textarea rows={3} className={textareaCls} value={form.feedbackConcerns} onChange={e => set("feedbackConcerns", e.target.value)} placeholder="Document any concerns raised…" />
        </Field>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="accent-indigo-600 mt-1" checked={form.feedbackReviewed} onChange={e => set("feedbackReviewed", e.target.checked)} />
            <div>
              <p className="text-sm font-semibold text-slate-700">All feedback reviewed and responded to</p>
              {form.feedbackReviewed && (
                <input type="date" className={`${inputCls} mt-2 w-48`} value={form.feedbackReviewDate} onChange={e => set("feedbackReviewDate", e.target.value)} />
              )}
            </div>
          </label>
        </div>
      </div>
    );

    // Review
    if (step === activeSections.length + 2) return (
      <div>
        <SectionHeader number="✓" title="Review & Submit" />
        <div className="space-y-3 mb-6">
          {[
            ["Department", form.department],
            ["Submitter", `${form.submitterName}${form.submitterTitle ? ` · ${form.submitterTitle}` : ""}`],
            ["Year", form.submissionYear],
            ["Submission Type", form.yearType === "full" ? "Full AUR (All 7 Sections)" : "Abbreviated Update"],
            ["Strategic Initiatives", form.strategicInitiatives.length > 0 ? form.strategicInitiatives.join(", ") : "None selected"],
            ["Major Projects", form.majorProjects.filter(p => p.title).length],
            ["Strategic Goals", form.strategicGoalsRoadmap.filter(g => g.goal).length],
            ["Resource Requests", form.newResourceRequests.filter(r => r.request).length],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-start py-2 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-500">{k}</span>
              <span className="text-sm text-slate-800 text-right max-w-xs">{v || <span className="text-slate-300 italic">Not provided</span>}</span>
            </div>
          ))}
        </div>
        {(!form.department || !form.submitterName) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-4">
            Please complete required fields: Department and Submitter Name (on the Cover page).
          </div>
        )}
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-800 mb-6">
          By submitting, this AUR will be compiled and reviewed at Chancellor's Cabinet. College partners will receive 30 days to provide feedback.
        </div>
      </div>
    );
  };

  const maxStep = activeSections.length + 2;
  const isLastStep = step === maxStep;

  const sectionStep = step > 0 && step <= activeSections.length ? activeSections[step - 1] : null;
  const isAbbrevAndSkipped = YEAR_TYPE === "abbreviated" && sectionStep && ![1,2,3,"4B",7].includes(sectionStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">KCCD</span>
          <span className="text-xs text-slate-400 ml-2">Annual Unit Review</span>
        </div>
        <div className="flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <NavDot key={i} active={step === i} done={step > i} onClick={() => setStep(i)} label={label} />
          ))}
        </div>
        <div className="text-xs text-slate-400">Step {step + 1} of {totalSteps}</div>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-start justify-center p-6 pt-8">
        <div className="w-full max-w-2xl">
          {/* Step label */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-widest">{stepLabels[step]}</span>
            {YEAR_TYPE === "abbreviated" && step > 0 && (
              <Tag color="amber">Even Year – Abbreviated</Tag>
            )}
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition">
              ← Back
            </button>
            {isLastStep ? (
              <button
                onClick={() => form.department && form.submitterName && setSubmitted(true)}
                disabled={!form.department || !form.submitterName}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 transition">
                Submit AUR ✓
              </button>
            ) : (
              <button
                onClick={() => setStep(s => Math.min(maxStep, s + 1))}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition">
                Continue →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
