"use client";

import { EvaluationResult } from "@/types";
import ScoreRadial from "./ScoreRadial";
import { gradeBackground } from "@/lib/utils";
import { CheckCircle, ArrowUpCircle, Download } from "lucide-react";
import dynamic from "next/dynamic";

const PDFDownloadButton = dynamic(
  () => import("./PDFReport").then((m) => m.PDFDownloadButton),
  {
    ssr: false,
    loading: () => (
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm">
        <Download className="h-4 w-4" /> Loading PDF...
      </button>
    ),
  },
);

interface ResultsCardProps {
  result: EvaluationResult;
  studentName?: string;
  gradeLevel: string;
  rubricType: string;
  onReset: () => void;
}

export default function ResultsCard({
  result,
  studentName,
  gradeLevel,
  rubricType,
  onReset,
}: ResultsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">
            Evaluation Results
          </h2>
          {studentName && (
            <p className="text-indigo-200 text-sm mt-0.5">
              Student: {studentName}
            </p>
          )}
        </div>
        <span
          className={`text-2xl font-bold px-4 py-1 rounded-xl ${gradeBackground(result.overall_grade)}`}
        >
          {result.overall_grade}
        </span>
      </div>

      <div className="p-6 space-y-8">
        {/* Scores */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Scores
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreRadial score={result.grammar_score} label="Grammar" />
            <ScoreRadial score={result.structure_score} label="Structure" />
            <ScoreRadial
              score={result.argumentation_score}
              label="Argumentation"
            />
            <ScoreRadial
              score={result.critical_thinking_score}
              label="Critical Thinking"
            />
          </div>
        </div>

        {/* Feedback */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Detailed Feedback
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {result.detailed_feedback}
          </p>
        </div>

        {/* Strengths */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Strengths
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((strength, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {result.improvements.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <ArrowUpCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
          <PDFDownloadButton
            result={result}
            studentName={studentName}
            gradeLevel={gradeLevel}
            rubricType={rubricType}
          />
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Evaluate Another
          </button>
        </div>
      </div>
    </div>
  );
}
