"use client";

import { EvaluationResult } from "@/types";
import { Download } from "lucide-react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#1f2937",
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#4f46e5",
    marginBottom: 4,
  },
  subtitle: { fontSize: 12, color: "#6b7280", marginBottom: 20 },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 4,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  scoreBox: {
    width: "22%",
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  scoreNumber: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#4f46e5" },
  scoreLabel: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  grade: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#4f46e5",
    textAlign: "center",
    marginBottom: 4,
  },
  bullet: { flexDirection: "row", gap: 6, marginBottom: 4 },
  bulletDot: { color: "#4f46e5", fontFamily: "Helvetica-Bold" },
  body: { lineHeight: 1.6, color: "#374151" },
});

interface PDFDocProps {
  result: EvaluationResult;
  studentName?: string;
  gradeLevel: string;
  rubricType: string;
}

function PDFDoc({ result, studentName, gradeLevel, rubricType }: PDFDocProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>EssayGrade AI — Evaluation Report</Text>
        <Text style={styles.subtitle}>
          {studentName ? `Student: ${studentName} · ` : ""}
          {gradeLevel} · {rubricType}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Grade</Text>
          <Text style={styles.grade}>{result.overall_grade}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scores</Text>
          <View style={styles.scoreRow}>
            {[
              { label: "Grammar", val: result.grammar_score },
              { label: "Structure", val: result.structure_score },
              { label: "Argumentation", val: result.argumentation_score },
              {
                label: "Critical Thinking",
                val: result.critical_thinking_score,
              },
            ].map((s) => (
              <View key={s.label} style={styles.scoreBox}>
                <Text style={styles.scoreNumber}>{s.val}</Text>
                <Text style={styles.scoreLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Feedback</Text>
          <Text style={styles.body}>{result.detailed_feedback}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strengths</Text>
          {result.strengths.map((s, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.body}>{s}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Areas for Improvement</Text>
          {result.improvements.map((s, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.body}>{s}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export function PDFDownloadButton({
  result,
  studentName,
  gradeLevel,
  rubricType,
}: PDFDocProps) {
  const fileName = studentName
    ? `${studentName.replace(/\s+/g, "_")}_evaluation.pdf`
    : "essay_evaluation.pdf";

  return (
    <PDFDownloadLink
      document={
        <PDFDoc
          result={result}
          studentName={studentName}
          gradeLevel={gradeLevel}
          rubricType={rubricType}
        />
      }
      fileName={fileName}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
    >
      {({ loading }) => (
        <>
          <Download className="h-4 w-4" />
          {loading ? "Generating PDF..." : "Download PDF"}
        </>
      )}
    </PDFDownloadLink>
  );
}
