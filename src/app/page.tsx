import Link from 'next/link';
import { Brain, FileText, Download, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
            Grade Essays in Seconds,
            <br />
            <span className="text-indigo-200">Not Hours</span>
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            AI-powered rubric-based feedback that helps teachers evaluate student writing instantly.
            Detailed scores, strengths, improvements, and PDF reports.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-indigo-500 text-white rounded-xl font-semibold text-lg hover:bg-indigo-400 transition-colors"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-indigo-300 text-sm">10 free evaluations/month · No credit card required</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to evaluate essays
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Feedback',
                description:
                  'Powered by Claude, the most advanced AI available. Get nuanced, constructive feedback tailored to grade level and rubric type.',
              },
              {
                icon: FileText,
                title: 'Rubric-Based Scoring',
                description:
                  'Score essays on Grammar, Structure, Argumentation, and Critical Thinking. Supports 5 rubric types across all grade levels.',
              },
              {
                icon: Download,
                title: 'PDF Reports',
                description:
                  'Generate professional PDF reports for each evaluation. Share with students, parents, or administrators in seconds.',
              },
            ].map((feature) => (
              <div key={feature.title} className="flex flex-col items-start gap-4 p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Paste the Essay', desc: 'Copy and paste any student essay into our evaluation tool. Select the grade level and rubric type.' },
              { step: '2', title: 'AI Analyzes', desc: 'Our AI evaluates the essay against your chosen rubric in seconds, scoring 4 key dimensions.' },
              { step: '3', title: 'Download Report', desc: 'Review detailed feedback, scores, strengths, and improvements. Export a PDF report instantly.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-2xl p-6 text-left space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <div className="text-3xl font-bold text-gray-900">$0</div>
              <ul className="space-y-2 text-sm text-gray-600">
                {['10 evaluations/month', 'All rubric types', 'All grade levels', 'Basic feedback'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-600 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center py-2 px-4 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                Get Started
              </Link>
            </div>
            <div className="bg-indigo-600 rounded-2xl p-6 text-left space-y-4 text-white">
              <h3 className="text-lg font-semibold">Pro</h3>
              <div className="text-3xl font-bold">$15<span className="text-lg font-normal text-indigo-200">/mo</span></div>
              <ul className="space-y-2 text-sm text-indigo-100">
                {['Unlimited evaluations', 'All rubric types', 'All grade levels', 'PDF export'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-200 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block text-center py-2 px-4 bg-white text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors">
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
