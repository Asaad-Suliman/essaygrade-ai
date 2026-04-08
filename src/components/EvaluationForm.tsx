'use client';

import { useState } from 'react';
import { EvaluationResult, GradeLevel, RubricType } from '@/types';
import ResultsCard from './ResultsCard';
import { Loader2 } from 'lucide-react';

const GRADE_LEVELS: { value: GradeLevel; label: string }[] = [
  { value: 'elementary', label: 'Elementary School' },
  { value: 'middle_school', label: 'Middle School' },
  { value: 'high_school', label: 'High School' },
  { value: 'university', label: 'University' },
];

const RUBRIC_TYPES: { value: RubricType; label: string }[] = [
  { value: 'argumentative', label: 'Argumentative' },
  { value: 'narrative', label: 'Narrative' },
  { value: 'expository', label: 'Expository' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'research', label: 'Research Paper' },
];

interface EvaluationFormProps {
  userPlan: 'free' | 'pro';
  evaluationsThisMonth: number;
}

export default function EvaluationForm({ userPlan, evaluationsThisMonth }: EvaluationFormProps) {
  const [essay, setEssay] = useState('');
  const [studentName, setStudentName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('high_school');
  const [rubricType, setRubricType] = useState<RubricType>('argumentative');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const atLimit = userPlan === 'free' && evaluationsThisMonth >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (atLimit) { setShowUpgrade(true); return; }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essay, gradeLevel, rubricType, studentName: studentName || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) { setShowUpgrade(true); return; }
        throw new Error(data.error || 'Evaluation failed');
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setEssay('');
    setStudentName('');
  }

  if (showUpgrade) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold text-orange-800">Monthly limit reached</h2>
        <p className="text-orange-700 text-sm">
          You've used all 10 free evaluations this month. Upgrade to Pro for unlimited evaluations.
        </p>
        <a
          href="/pricing"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Upgrade to Pro — $15/month
        </a>
        <button
          onClick={() => setShowUpgrade(false)}
          className="block mx-auto text-sm text-gray-500 hover:text-gray-700 mt-2"
        >
          Go back
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <ResultsCard
        result={result}
        studentName={studentName || undefined}
        gradeLevel={gradeLevel}
        rubricType={rubricType}
        onReset={handleReset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
      {userPlan === 'free' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-sm text-indigo-700">
          Free plan: {evaluationsThisMonth}/10 evaluations used this month.{' '}
          <a href="/pricing" className="font-semibold underline">Upgrade to Pro</a> for unlimited.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student Name (optional)</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g. Jane Smith"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {GRADE_LEVELS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rubric Type</label>
        <select
          value={rubricType}
          onChange={(e) => setRubricType(e.target.value as RubricType)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {RUBRIC_TYPES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Essay Text <span className="text-gray-400 font-normal">({essay.length}/10000 chars)</span>
        </label>
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          minLength={50}
          maxLength={10000}
          required
          rows={12}
          placeholder="Paste the student's essay here..."
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        {essay.length > 0 && essay.length < 50 && (
          <p className="text-xs text-red-500 mt-1">Essay must be at least 50 characters.</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || essay.length < 50}
        className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing essay...
          </>
        ) : (
          'Evaluate Essay'
        )}
      </button>
    </form>
  );
}
