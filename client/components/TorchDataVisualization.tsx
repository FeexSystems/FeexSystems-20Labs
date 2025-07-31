import { useEffect, useRef, useState } from "react";

interface DataPoint {
  month: string;
  value: number;
  secondary?: number;
}

interface TorchDataVisualizationProps {
  title?: string;
  subtitle?: string;
  data?: DataPoint[];
  animated?: boolean;
}

export function TorchDataVisualization({
  title = "Turn complex data into simple decisions",
  subtitle = "Actionable Insights",
  animated = true,
}: TorchDataVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Sample data similar to Torch template
  const sampleData: DataPoint[] = [
    { month: "JAN", value: 45, secondary: 35 },
    { month: "FEB", value: 38, secondary: 42 },
    { month: "MAR", value: 52, secondary: 38 },
    { month: "APR", value: 61, secondary: 45 },
    { month: "MAY", value: 55, secondary: 48 },
    { month: "JUN", value: 67, secondary: 52 },
    { month: "JUL", value: 73, secondary: 58 },
    { month: "AUG", value: 69, secondary: 61 },
    { month: "SEP", value: 78, secondary: 65 },
    { month: "OCT", value: 82, secondary: 69 },
    { month: "NOV", value: 76, secondary: 72 },
    { month: "DEC", value: 85, secondary: 75 },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart area
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= sampleData.length - 1; i++) {
      const x = padding + (chartWidth / (sampleData.length - 1)) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw month labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "12px 'Google Sans'";
    ctx.textAlign = "center";

    sampleData.forEach((point, index) => {
      const x = padding + (chartWidth / (sampleData.length - 1)) * index;
      ctx.fillText(point.month, x, height - padding + 20);
    });

    // Function to draw smooth curve
    const drawSmoothCurve = (
      points: { x: number; y: number }[],
      color: string,
      opacity: number = 1,
    ) => {
      if (points.length < 2) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1];
        const currentPoint = points[i];
        const nextPoint = points[i + 1];

        if (nextPoint) {
          const cpx = currentPoint.x;
          const cpy = currentPoint.y;
          ctx.quadraticCurveTo(cpx, cpy, currentPoint.x, currentPoint.y);
        } else {
          ctx.lineTo(currentPoint.x, currentPoint.y);
        }
      }

      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    // Calculate points for primary line (orange)
    const primaryPoints = sampleData.map((point, index) => {
      const x = padding + (chartWidth / (sampleData.length - 1)) * index;
      const normalizedValue = (point.value - 30) / (90 - 30); // Normalize between 30-90
      const y = height - padding - normalizedValue * chartHeight;
      return { x, y };
    });

    // Calculate points for secondary line (dashed)
    const secondaryPoints = sampleData.map((point, index) => {
      const x = padding + (chartWidth / (sampleData.length - 1)) * index;
      const normalizedValue = ((point.secondary || 0) - 30) / (90 - 30);
      const y = height - padding - normalizedValue * chartHeight;
      return { x, y };
    });

    // Draw animated lines if animation is enabled
    if (animated) {
      // Primary line (orange) - solid
      const visiblePrimaryPoints = primaryPoints.slice(
        0,
        Math.floor(primaryPoints.length * animationProgress),
      );
      if (visiblePrimaryPoints.length > 1) {
        drawSmoothCurve(visiblePrimaryPoints, "#f59e0b");
      }

      // Secondary line (white) - dashed
      const visibleSecondaryPoints = secondaryPoints.slice(
        0,
        Math.floor(secondaryPoints.length * animationProgress),
      );
      if (visibleSecondaryPoints.length > 1) {
        // Draw dashed line manually
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        visibleSecondaryPoints.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash
      }
    } else {
      // Draw complete lines
      drawSmoothCurve(primaryPoints, "#f59e0b");

      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      secondaryPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw data points
    primaryPoints.forEach((point, index) => {
      if (!animated || index < primaryPoints.length * animationProgress) {
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    secondaryPoints.forEach((point, index) => {
      if (!animated || index < secondaryPoints.length * animationProgress) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [animationProgress, animated]);

  // Animation effect
  useEffect(() => {
    if (!animated) {
      setAnimationProgress(1);
      return;
    }

    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(easeOutCubic);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      animate();
    }, 500); // Start animation after 500ms

    return () => clearTimeout(timer);
  }, [animated]);

  const features = [
    {
      icon: "📊",
      title: "Automated reports",
      description:
        "Save time with automated, scheduled reports. Get the insights you need, delivered straight to your inbox.",
    },
    {
      icon: "📈",
      title: "Trend analysis",
      description:
        "Understand trends in your data effortlessly. Visualize historical data to forecast future performance.",
    },
    {
      icon: "⚡",
      title: "Interactive charts",
      description:
        "Create beautiful, responsive interactive charts. Hover and click for more detailed insights and breakdowns.",
    },
  ];

  return (
    <div className="relative bg-mint-dark rounded-3xl p-8 lg:p-12 text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-mint-green/10 to-mint-neon/5 rounded-3xl"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-mint-green font-medium mb-2">{subtitle}</div>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            {title}
          </h2>
        </div>

        {/* Chart Container */}
        <div className="mb-12">
          <canvas
            ref={canvasRef}
            className="w-full"
            style={{ height: "300px" }}
            aria-label="Interactive data visualization chart"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="space-y-3">
              <div className="text-2xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mint-neon/20 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-mint-green/20 to-transparent rounded-full blur-xl"></div>
    </div>
  );
}
