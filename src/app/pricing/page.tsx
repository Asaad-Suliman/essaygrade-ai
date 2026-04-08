import PricingCard from '@/components/PricingCard';

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">Simple, transparent pricing</h1>
        <p className="text-lg text-gray-500">
          Start free. Upgrade when you need more.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <PricingCard
          name="Free"
          price="$0"
          description="Perfect for occasional use"
          features={[
            '10 evaluations per month',
            'All rubric types',
            'All grade levels',
            'Grammar, structure & more',
            'Strengths & improvements',
          ]}
          cta="Get Started"
          ctaHref="/signup"
        />
        <PricingCard
          name="Pro"
          price="$15"
          description="For active teachers & educators"
          features={[
            'Unlimited evaluations',
            'All rubric types',
            'All grade levels',
            'Detailed AI feedback',
            'PDF export & download',
          ]}
          cta="Subscribe to Pro"
          ctaHref="/api/checkout"
          highlighted
          isCheckout
        />
      </div>

      <div className="text-center text-sm text-gray-400">
        Cancel anytime. No hidden fees. Secure payments via Stripe.
      </div>
    </div>
  );
}
