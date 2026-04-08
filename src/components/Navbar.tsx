'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GraduationCap } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <GraduationCap className="h-6 w-6" />
            EssayGrade AI
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/evaluate" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Evaluate Essay
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
