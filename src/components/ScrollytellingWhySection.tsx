import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import lazieriLogo from "@/assets/partners/lazieri-logo.png";
import internaLogo from "@/assets/partners/interna-logo.png";
import ltbLogo from "@/assets/partners/ltb-logo.png";
import kastaLogo from "@/assets/partners/kasta-logo.png";

interface StepCard {
  title: string;
  description: string;
  targetProgress: number;
  logos?: string[];
}

const steps: StepCard[] = [
  {
    title: "ავეჯის კონსტრუქტორი დღითიდღე უფრო და უფრო მოთხოვნადი პროფესია ხდება",
    description: "საქართველოში და მთელ მსოფლიოში ავეჯის ინდუსტრია განვითარების პიკზეა",
    targetProgress: 95,
  },
  {
    title: "კურსის ბოლოს მიიღებ სერთიფიკატს",
    description: "აღიარებული სერთიფიკატი, რომელიც დაგეხმარება კარიერის დაწყებაში",
    targetProgress: 100,
  },
  {
    title: "სტაჟირება პარტნიორ კომპანიებში: Lazieri, Interna",
    description: "გარანტირებული სტაჟირება წამყვან კომპანიებში",
    targetProgress: 85,
    logos: [lazieriLogo, internaLogo],
  },
  {
    title: "ონლაინ სწავლება და პრაქტიკული შეხვედრები: LTB, Kasta",
    description: "თეორიული მასალა ონლაინ და პრაქტიკა პარტნიორ ორგანიზაციებში",
    targetProgress: 90,
    logos: [ltbLogo, kastaLogo],
  },
];

export function ScrollytellingWhySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      const step = Math.min(Math.floor(latest * steps.length), steps.length - 1);
      setActiveStep(step);
    });

    return () => unsubscribe();
  }, [smoothProgress]);

  const navigateStep = (direction: "next" | "prev") => {
    const newStep = direction === "next" 
      ? Math.min(activeStep + 1, steps.length - 1)
      : Math.max(activeStep - 1, 0);
    
    setActiveStep(newStep);
    
    // Scroll to the step
    const stepHeight = window.innerHeight * 0.8;
    const targetScroll = containerRef.current?.offsetTop! + (newStep * stepHeight);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section ref={containerRef} className="relative py-20 bg-cream">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-12 min-h-[400vh]">
            {/* Left Column - Sticky */}
            <div className="sticky top-24 h-fit">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight mb-6">
                  რატომ უნდა გახდე ავეჯის კონსტრუქტორი
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  გაიგე რატომ არის ეს პროფესია შენთვის იდეალური
                </p>
                
                {/* Progress Indicator */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-2xl font-bold text-primary">
                    {activeStep + 1} / {steps.length}
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      style={{
                        width: useTransform(
                          smoothProgress,
                          [0, 1],
                          ["0%", "100%"]
                        ),
                      }}
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3" role="group" aria-label="Step navigation">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateStep("prev")}
                    disabled={activeStep === 0}
                    aria-label="Previous step"
                  >
                    <ChevronUp className="h-4 w-4 mr-1" />
                    წინა
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateStep("next")}
                    disabled={activeStep === steps.length - 1}
                    aria-label="Next step"
                  >
                    შემდეგი
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Scrolling Cards */}
            <div className="relative">
              {steps.map((step, index) => (
                <StepCard
                  key={index}
                  step={step}
                  index={index}
                  activeStep={activeStep}
                  scrollProgress={smoothProgress}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-4">
              რატომ უნდა გახდე ავეჯის კონსტრუქტორი
            </h2>
            <p className="text-lg text-muted-foreground">
              გაიგე რატომ არის ეს პროფესია შენთვის იდეალური
            </p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <MobileStepCard
                key={index}
                step={step}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Screen Reader Announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}
      </div>
    </section>
  );
}

interface StepCardProps {
  step: StepCard;
  index: number;
  activeStep: number;
  scrollProgress: any;
  shouldReduceMotion: boolean | null;
}

function StepCard({ step, index, activeStep, scrollProgress, shouldReduceMotion }: StepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isActive = index <= activeStep;
  const isPast = index < activeStep;

  // Calculate individual card progress
  const stepStart = index / 4;
  const stepEnd = (index + 1) / 4;
  
  const cardProgress = useTransform(
    scrollProgress,
    [stepStart, stepEnd],
    [0, 1]
  );

  const smoothCardProgress = useSpring(cardProgress, {
    stiffness: 100,
    damping: 30,
  });

  const scale = shouldReduceMotion 
    ? 1 
    : useTransform(
        smoothCardProgress,
        [0, 1],
        isPast ? [0.98, 0.98] : [0.95, 1]
      );

  const opacity = shouldReduceMotion
    ? 1
    : useTransform(
        smoothCardProgress,
        [0, 1],
        isPast ? [0.7, 0.7] : [0, 1]
      );

  const y = shouldReduceMotion
    ? index * 120
    : useTransform(
        smoothCardProgress,
        [0, 1],
        [100, index * 120]
      );

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity: isActive ? opacity : 0.3,
        y,
        position: "sticky",
        top: `${100 + index * 120}px`,
      }}
      className="bg-background rounded-2xl p-8 shadow-elevated"
      role="article"
      aria-label={`Step ${index + 1}: ${step.title}`}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-3">{step.title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">მზადყოფნა</span>
            <motion.span className="font-bold text-primary">
              {useTransform(
                smoothCardProgress,
                [0, 1],
                [0, step.targetProgress]
              ).get().toFixed(0)}%
            </motion.span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              style={{
                width: useTransform(
                  smoothCardProgress,
                  [0, 1],
                  ["0%", `${step.targetProgress}%`]
                ),
              }}
            />
          </div>
        </div>

        {/* Partner Logos */}
        {step.logos && (
          <div className="flex gap-3 flex-wrap">
            {step.logos.map((logo, logoIndex) => (
              <div
                key={logoIndex}
                className="px-4 py-2 bg-muted/50 rounded-lg flex items-center"
              >
                <img
                  src={logo}
                  alt="Partner logo"
                  className="h-6 object-contain opacity-60"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface MobileStepCardProps {
  step: StepCard;
  index: number;
  shouldReduceMotion: boolean | null;
}

function MobileStepCard({ step, index, shouldReduceMotion }: MobileStepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setProgress(step.targetProgress);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setProgress(step.targetProgress);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [step.targetProgress, shouldReduceMotion]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-background rounded-2xl p-6 shadow-medium"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold text-sm">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">მზადყოფნა</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Partner Logos */}
        {step.logos && (
          <div className="flex gap-2 flex-wrap">
            {step.logos.map((logo, logoIndex) => (
              <div
                key={logoIndex}
                className="px-3 py-1.5 bg-muted/50 rounded-lg flex items-center"
              >
                <img
                  src={logo}
                  alt="Partner logo"
                  className="h-4 object-contain opacity-60"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
