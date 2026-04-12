import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EvaluationForm from "@/components/EvaluationForm";

export default async function EvaluatePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, evaluations_this_month")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Evaluate Essay</h1>
        <p className="text-sm text-gray-500 mt-1">
          Paste a student essay to receive instant AI-powered rubric-based
          feedback.
        </p>
      </div>
      <EvaluationForm
        userPlan={profile?.plan ?? "free"}
        evaluationsThisMonth={profile?.evaluations_this_month ?? 0}
      />
    </div>
  );
}
