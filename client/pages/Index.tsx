import { VRHeader } from "../components/VRHeader";
import { ThreeGlobe } from "../components/ThreeGlobe";
import { AboutSection } from "../components/AboutSection";
import { CapabilitiesSection } from "../components/CapabilitiesSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <VRHeader />

      {/* Hero Section with 3D Background */}
      <div className="relative h-screen flex flex-col justify-center items-center text-center">
        <ThreeGlobe />
        <div className="relative z-10 max-w-4xl px-5">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            FeexSystems: Refining AI for the Universe
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed mb-8 text-muted-foreground">
            Pioneering AI-powered web applications and software with expertise
            in DevOps, full-stack development, and ethical hacking. We transform
            raw ideas into intelligent, secure, and scalable solutions.
          </p>
          <a
            href="#contact"
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Discover Our Work
          </a>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="bg-background">
        <AboutSection />
        <CapabilitiesSection />
        <ContactSection />
      </div>

      <Footer />
    </div>
  );
}
