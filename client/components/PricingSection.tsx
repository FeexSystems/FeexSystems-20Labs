import { useState } from "react";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for individuals and small teams getting started",
      monthlyPrice: 29,
      annualPrice: 24,
      features: [
        "Up to 3 team members",
        "10 AI-powered analyses per month",
        "Basic dashboard",
        "Email support",
        "API access",
        "Basic integrations"
      ],
      limitations: [
        "Limited to 1GB storage",
        "Basic analytics only"
      ],
      popular: false,
      color: "gray"
    },
    {
      id: "professional",
      name: "Professional",
      description: "Ideal for growing teams and businesses",
      monthlyPrice: 79,
      annualPrice: 65,
      features: [
        "Up to 25 team members",
        "Unlimited AI analyses",
        "Advanced dashboard & reports",
        "Priority support",
        "Full API access",
        "All integrations",
        "Custom workflows",
        "Advanced security features",
        "SSO integration"
      ],
      limitations: [],
      popular: true,
      color: "mint-green"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations with advanced needs",
      monthlyPrice: 299,
      annualPrice: 249,
      features: [
        "Unlimited team members",
        "Unlimited everything",
        "Custom dashboard builder",
        "24/7 dedicated support",
        "White-label options",
        "Custom integrations",
        "Advanced AI training",
        "Compliance certifications",
        "On-premise deployment",
        "Custom SLA"
      ],
      limitations: [],
      popular: false,
      color: "deepmind-blue"
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (billingCycle === "annually") {
      const monthlyCost = plan.monthlyPrice * 12;
      const annualCost = plan.annualPrice * 12;
      const savings = Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
      return savings;
    }
    return 0;
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-mint-dark to-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-torch-orange/20 rounded-full text-torch-orange font-medium mb-6">
            <span className="w-2 h-2 bg-torch-orange rounded-full mr-2 animate-pulse"></span>
            Pricing Plans
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Choose the perfect plan for
            <span className="text-transparent bg-clip-text bg-gradient-torch"> your business</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Start free and scale as you grow. All plans include our core AI features with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-torch-orange text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                billingCycle === "annually"
                  ? "bg-torch-orange text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-1 bg-success rounded-full text-xs text-white">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-500 ${
                plan.popular
                  ? "border-torch-orange shadow-2xl shadow-torch-orange/20 scale-105"
                  : "border-white/10 hover:border-white/20"
              } ${
                hoveredPlan === plan.id ? "transform scale-105 shadow-2xl" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-torch px-6 py-2 rounded-full text-sm font-semibold text-white shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold">${getPrice(plan)}</span>
                    <span className="text-gray-400 ml-2">/{billingCycle === "monthly" ? "month" : "month"}</span>
                  </div>
                  {billingCycle === "annually" && (
                    <div className="text-sm text-success mt-2">
                      Save {getSavings(plan)}% annually
                    </div>
                  )}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-torch text-white hover:shadow-lg transform hover:scale-105"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  {plan.popular ? "Start Free Trial" : "Get Started"}
                </button>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg mb-4">What's included:</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-500 text-sm">{limitation}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Need a custom solution?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We offer custom enterprise plans with dedicated support, advanced security features, 
              and tailored integrations for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-torch text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Contact Sales
              </button>
              <button className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes, all plans include a 14-day free trial with full access to features."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and wire transfers for enterprise plans."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee for all annual plans."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="font-semibold mb-3">{faq.question}</h4>
                <p className="text-gray-300 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
