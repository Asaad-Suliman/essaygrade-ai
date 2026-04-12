import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Evaluation } from "@/types";
import { formatDate, gradeBackground } from "@/lib/utils";
import { PlusCircle, FileText } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: evaluations }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("evaluations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const evals = (evaluations as Evaluation[]) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
          </p>
        </div>
        <Link
          href="/evaluate"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          New Evaluation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            Plan
          </p>
          <p className="text-xl font-bold text-gray-900 capitalize">
            {profile?.plan ?? "free"}
          </p>
          {profile?.plan === "free" && (
            <Link
              href="/pricing"
              className="text-xs text-indigo-600 hover:underline"
            >
              Upgrade to Pro →
            </Link>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            This Month
          </p>
          <p className="text-xl font-bold text-gray-900">
            {profile?.evaluations_this_month ?? 0}
            {profile?.plan === "free" && (
              <span className="text-sm font-normal text-gray-400"> / 10</span>
            )}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            Total Evaluations
          </p>
          <p className="text-xl font-bold text-gray-900">{evals.length}</p>
        </div>
      </div>

      {/* Evaluations list */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Past Evaluations
        </h2>
        {evals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-4">
            <FileText className="h-10 w-10 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">No evaluations yet</p>
            <p className="text-sm text-gray-400">
              Start by evaluating your first student essay.
            </p>
            <Link
              href="/evaluate"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4" /> Evaluate an Essay
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {evals.map((ev) => (
              <details key={ev.id} className="group">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors list-none">
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={`text-sm font-bold px-2.5 py-1 rounded-lg ${gradeBackground(ev.results.overall_grade)}`}
                    >
                      {ev.results.overall_grade}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {ev.student_name || "Unnamed Student"}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {ev.grade_level.replace("_", " ")} · {ev.rubric_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right flex-shrink-0">
                    <span className="text-xs text-gray-400">
                      {formatDate(ev.created_at)}
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform text-xs">
                      ▼
                    </span>
                  </div>
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Grammar", val: ev.results.grammar_score },
                      { label: "Structure", val: ev.results.structure_score },
                      {
                        label: "Argumentation",
                        val: ev.results.argumentation_score,
                      },
                      {
                        label: "Critical Thinking",
                        val: ev.results.critical_thinking_score,
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-white rounded-xl p-3 text-center border border-gray-100"
                      >
                        <p className="text-lg font-bold text-gray-900">
                          {s.val}
                          <span className="text-xs text-gray-400">/10</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {ev.results.detailed_feedback}
                  </p>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
