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

    const validGradeLevels: GradeLevel[] = [
      "elementary",
      "middle_school",
      "high_school",
      "university",
    ];
    const validRubricTypes: RubricType[] = [
      "argumentative",
      "narrative",
      "expository",
      "persuasive",
      "research",
    ];

    if (!validGradeLevels.includes(gradeLevel)) {
      return NextResponse.json(
        { error: "Invalid grade level" },
        { status: 400 },
      );
    }

    if (!validRubricTypes.includes(rubricType)) {
      return NextResponse.json(
        { error: "Invalid rubric type" },
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

    // Reset monthly count if period expired — optimistic lock prevents double-reset
    const periodStart = new Date(profile.current_period_start);
    const now = new Date();
    const daysDiff =
      (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > 30) {
      const { data: resetResult } = await supabase
        .from("profiles")
        .update({
          evaluations_this_month: 0,
          current_period_start: now.toISOString(),
        })
        .eq("id", user.id)
        .eq("current_period_start", profile.current_period_start) // only reset once
        .select("evaluations_this_month")
        .single();

      if (resetResult) {
        profile.evaluations_this_month = 0;
      } else {
        // Another concurrent request already reset the period — use its fresh count
        const { data: freshProfile } = await supabase
          .from("profiles")
          .select("evaluations_this_month")
          .eq("id", user.id)
          .single();
        if (freshProfile) {
          profile.evaluations_this_month = freshProfile.evaluations_this_month;
        }
      }
    }

    // Check usage limit and atomically reserve a slot for free users
    if (profile.plan === "free") {
      if (profile.evaluations_this_month >= 10) {
        return NextResponse.json(
          { error: "Monthly limit reached. Upgrade to Pro." },
          { status: 403 },
        );
      }

      // Optimistic lock: only increment if the count hasn't changed since we read it.
      // This prevents two concurrent requests from both passing the limit check.
      const { data: claimed } = await supabase
        .from("profiles")
        .update({ evaluations_this_month: profile.evaluations_this_month + 1 })
        .eq("id", user.id)
        .eq("evaluations_this_month", profile.evaluations_this_month)
        .select("evaluations_this_month")
        .single();

      if (!claimed) {
        // A concurrent request already modified the count — re-read and check
        const { data: freshProfile } = await supabase
          .from("profiles")
          .select("evaluations_this_month")
          .eq("id", user.id)
          .single();

        if (!freshProfile || freshProfile.evaluations_this_month >= 10) {
          return NextResponse.json(
            { error: "Monthly limit reached. Upgrade to Pro." },
            { status: 403 },
          );
        }

        // Still under limit — increment with the fresh count to reserve the slot
        await supabase
          .from("profiles")
          .update({
            evaluations_this_month: freshProfile.evaluations_this_month + 1,
          })
          .eq("id", user.id);
      }
    }

    // Evaluate with AI — if this fails, roll back the reserved slot for free users
    let results;
    try {
      results = await evaluateEssay(essay, gradeLevel, rubricType);
    } catch (aiErr) {
      console.error("AI evaluation failed:", aiErr);
      if (profile.plan === "free") {
        await supabase
          .from("profiles")
          .update({ evaluations_this_month: profile.evaluations_this_month })
          .eq("id", user.id);
      }
      return NextResponse.json(
        { error: "Evaluation failed. Please try again." },
        { status: 500 },
      );
    }

    // Save evaluation — if this fails, roll back the reserved slot for free users
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
      if (profile.plan === "free") {
        await supabase
          .from("profiles")
          .update({ evaluations_this_month: profile.evaluations_this_month })
          .eq("id", user.id);
      }
      return NextResponse.json(
        { error: "Failed to save evaluation. Please try again." },
        { status: 500 },
      );
    }

    // Increment usage count for pro users (no limit concern, no race risk)
    if (profile.plan === "pro") {
      await supabase
        .from("profiles")
        .update({ evaluations_this_month: profile.evaluations_this_month + 1 })
        .eq("id", user.id);
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error("Evaluation error:", err);
    return NextResponse.json(
      { error: "Evaluation failed. Please try again." },
      { status: 500 },
    );
  }
}
