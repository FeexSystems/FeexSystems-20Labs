import { useState, useCallback } from "react";
import { SaaSNavigation } from "../components/SaaSNavigation";
import { EnhancedHero } from "../components/EnhancedHero";
import { FeatureShowcase } from "../components/FeatureShowcase";
import { ActionableInsights } from "../components/ActionableInsights";
import { PricingSection } from "../components/PricingSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { CTASections } from "../components/CTASections";
import { SaaSFooter } from "../components/SaaSFooter";
import { LiveChatbot } from "../components/LiveChatbot";
import { InteractiveChatInterface } from "../components/InteractiveChatInterface";

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    
    // Handle dropdown menu items
    const sectionMapping: Record<string, string> = {
      'intelligence': 'features',
      'research': 'features', 
      'security': 'features',
      'devops': 'features',
      'enterprise': 'pricing',
      'startups': 'pricing',
      'developers': 'pricing',
      'consulting': 'pricing',
      'documentation': 'resources',
      'blog': 'resources',
      'case-studies': 'testimonials',
      'support': 'resources'
    };

    const targetSection = sectionMapping[section] || section;
    
    // Smooth scroll to section
    const element = document.getElementById(targetSection);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Enhanced SaaS Navigation */}
      <SaaSNavigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Hero Section */}
      <div id="home">
        <EnhancedHero />
      </div>

      {/* Feature Showcase Section */}
      <div id="features">
        <FeatureShowcase />
      </div>

      {/* Actionable Insights Section */}
      <ActionableInsights />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials & Trust Indicators */}
      <TestimonialsSection />

      {/* Multiple CTA Sections */}
      <CTASections />

      {/* Enhanced Footer */}
      <SaaSFooter />

      {/* Live Chatbot */}
      <LiveChatbot />
    </div>
  );
}
