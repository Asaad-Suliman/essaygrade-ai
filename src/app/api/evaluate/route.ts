import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluateEssay } from "@/lib/claude";
import { GradeLevel, RubricType } from "@/types";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { essay, gradeLevel, rubricType, studentName } = body as {
      essay: string;
      gradeLevel: GradeLevel;
      rubricType: RubricType;
      studentName?: string;
    };

    if (!essay || essay.length < 50) {
      return NextResponse.json(
        { error: "Essay must be at least 50 characters" },
        { status: 400 },
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Reset monthly count if period expired
    const periodStart = new Date(profile.current_period_start);
    const now = new Date();
    const daysDiff =
      (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > 30) {
      await supabase
        .from("profiles")
        .update({
          evaluations_this_month: 0,
          current_period_start: now.toISOString(),
        })
        .eq("id", user.id);
      profile.evaluations_this_month = 0;
    }

    // Check usage limit
    if (profile.plan === "free" && profile.evaluations_this_month >= 10) {
      return NextResponse.json(
        { error: "Monthly limit reached. Upgrade to Pro." },
        { status: 403 },
      );
    }

    // Evaluate with Claude
    const results = await evaluateEssay(essay, gradeLevel, rubricType);

    // Save evaluation
    const { error: insertError } = await supabase.from("evaluations").insert({
      user_id: user.id,
      essay_text: essay,
      grade_level: gradeLevel,
      rubric_type: rubricType,
      student_name: studentName || null,
      results,
    });

    if (insertError) {
      console.error("Failed to save evaluation:", insertError);
    }

    // Increment usage count
    await supabase
      .from("profiles")
      .update({ evaluations_this_month: profile.evaluations_this_month + 1 })
      .eq("id", user.id);

    return NextResponse.json(results);
  } catch (err) {
    console.error("Evaluation error:", err);
    return NextResponse.json(
      { error: "Evaluation failed. Please try again." },
      { status: 500 },
    );
  }
}
