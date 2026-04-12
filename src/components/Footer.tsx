import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-indigo-600 font-bold text-lg"
            >
              <GraduationCap className="h-5 w-5" />
              EssayGrade AI
            </Link>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              AI-powered essay evaluation for modern educators.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="/pricing" className="hover:text-indigo-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/evaluate" className="hover:text-indigo-600">
                    Evaluate
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-indigo-600">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Account
              </h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="/login" className="hover:text-indigo-600">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-indigo-600">
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} EssayGrade AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
