import Link from 'next/link';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  isCheckout?: boolean;
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  ctaHref,
  highlighted = false,
  isCheckout = false,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl p-8 flex flex-col gap-6 ${
        highlighted
          ? 'bg-indigo-600 text-white shadow-xl ring-2 ring-indigo-600'
          : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
      }`}
    >
      <div>
        <h3 className={`text-lg font-semibold ${highlighted ? 'text-white' : 'text-gray-900'}`}>
          {name}
        </h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-4xl font-bold">{price}</span>
          {price !== '$0' && (
            <span className={`text-sm ${highlighted ? 'text-indigo-200' : 'text-gray-500'}`}>
              /month
            </span>
          )}
        </div>
        <p className={`mt-2 text-sm ${highlighted ? 'text-indigo-200' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check
              className={`h-4 w-4 mt-0.5 flex-shrink-0 ${highlighted ? 'text-indigo-200' : 'text-indigo-600'}`}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {isCheckout ? (
        <form action={ctaHref} method="POST">
          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-colors ${
              highlighted
                ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {cta}
          </button>
        </form>
      ) : (
        <Link
          href={ctaHref}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-sm text-center transition-colors ${
            highlighted
              ? 'bg-white text-indigo-600 hover:bg-indigo-50'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {cta}
        </Link>
      )}
    </div>
  );
}
