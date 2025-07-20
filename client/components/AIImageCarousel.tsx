import { useState, useEffect } from "react";

interface CarouselImage {
  id: string;
  url: string;
  title: string;
  description: string;
  aiModel: string;
}

export function AIImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // AI-generated images (placeholder URLs - replace with actual generated images)
  const carouselImages: CarouselImage[] = [
    {
      id: "ai-refinery",
      url: "/images/ai-refinery.jpg",
      title: "FeexSystems AI Refinery",
      description:
        "A futuristic facility with glowing neural networks and holographic displays showcasing our AI development process.",
      aiModel: "Generated with Flux.1 Aurora",
    },
    {
      id: "cyberpunk-city",
      url: "/images/cyberpunk-city.jpg",
      title: "Cyberpunk Innovation Hub",
      description:
        "A neon-lit cityscape representing the future of technology with FeexSystems at the forefront of digital transformation.",
      aiModel: "Generated with Flux.1 Aurora",
    },
    {
      id: "neural-network",
      url: "/images/neural-network.jpg",
      title: "3D Neural Network Visualization",
      description:
        "A stunning visualization of interconnected AI nodes representing our advanced machine learning algorithms.",
      aiModel: "Generated with Flux.1 Aurora",
    },
    {
      id: "data-flow",
      url: "/images/data-flow.jpg",
      title: "Data Flow Architecture",
      description:
        "Dynamic data streams and processing pipelines showcasing our DevOps and data engineering capabilities.",
      aiModel: "Generated with Flux.1 Aurora",
    },
    {
      id: "security-grid",
      url: "/images/security-grid.jpg",
      title: "Cybersecurity Matrix",
      description:
        "A secure digital fortress representing our ethical hacking and cybersecurity expertise.",
      aiModel: "Generated with Flux.1 Aurora",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentImage = carouselImages[currentIndex];

  return (
    <div
      className="relative w-full max-w-4xl mx-auto bg-card border border-border rounded-lg overflow-hidden"
      style={{
        boxShadow: "0 0 20px rgba(0, 170, 255, 0.1)",
      }}
      role="region"
      aria-label="AI-generated image carousel"
    >
      {/* Main Image Display */}
      <div className="relative h-96 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselImages.map((image, index) => (
            <div
              key={image.id}
              className="w-full h-full flex-shrink-0 relative"
            >
              {/* Placeholder for AI-generated image */}
              <div
                className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(45deg, 
                    rgba(0, 170, 255, 0.1) 0%, 
                    rgba(255, 102, 0, 0.1) 50%, 
                    rgba(0, 255, 0, 0.1) 100%)`,
                }}
              >
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {image.title}
                  </h3>
                  <p className="text-sm text-muted-foreground italic">
                    AI-Generated Placeholder
                  </p>
                </div>
              </div>

              {/* Overlay with image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                <p className="text-sm opacity-90 mb-2">{image.description}</p>
                <p className="text-xs opacity-70">{image.aiModel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Auto-play Toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
        >
          {isAutoPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="bg-card/50 p-4">
        <div className="flex justify-center space-x-2 mb-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="text-center">
          <h4 className="text-sm font-semibold text-foreground mb-1">
            {currentImage.title}
          </h4>
          <p className="text-xs text-muted-foreground">
            {currentIndex + 1} of {carouselImages.length} •{" "}
            {currentImage.aiModel}
          </p>
        </div>
      </div>

      {/* AI Generation Info */}
      <div className="bg-primary/10 border-t border-primary/20 p-4">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-primary font-medium">AI-Generated Content</span>
          <span className="text-muted-foreground">
            • Images created using advanced AI models • Showcasing FeexSystems
            vision
          </span>
        </div>
      </div>
    </div>
  );
}
