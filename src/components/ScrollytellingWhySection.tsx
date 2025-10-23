import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const navigateStep = (direction: "next" | "prev") => {
    const newStep = direction === "next" 
      ? Math.min(activeStep + 1, steps.length - 1)
      : Math.max(activeStep - 1, 0);
    
    setActiveStep(newStep);
  };

  return (
    <section className="relative py-20 bg-cream overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Sticky */}
            <div className="sticky top-24 self-start">
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
                      initial={{ width: 0 }}
                      animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
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

            {/* Right Column - Stacking Cards */}
            <div className="relative min-h-[700px]">
              {steps.map((step, index) => (
                <DesktopStepCard
                  key={index}
                  step={step}
                  index={index}
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
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

interface DesktopStepCardProps {
  step: StepCard;
  index: number;
  activeStep: number;
  setActiveStep: (step: number) => void;
  shouldReduceMotion: boolean | null;
}

function DesktopStepCard({ step, index, activeStep, setActiveStep, shouldReduceMotion }: DesktopStepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { amount: 0.5 });
  const isPassed = index <= activeStep;

  useEffect(() => {
    if (isInView && !shouldReduceMotion) {
      setActiveStep(index);
    }
  }, [isInView, index, setActiveStep, shouldReduceMotion]);

  // Rotation angles for stacking effect
  const rotations = [2, -1.5, 1, -2];
  const rotation = isPassed ? rotations[index % rotations.length] : 0;
  
  // Calculate stacking offset - each card moves down and slightly right
  const offsetY = isPassed ? index * 20 : 0;
  const offsetX = isPassed ? index * 8 : 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      animate={{
        opacity: isPassed ? 1 : 0,
        y: isPassed ? offsetY : 100,
        x: offsetX,
        scale: isPassed ? 1 : 0.95,
        rotate: rotation,
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: shouldReduceMotion ? 0 : index * 0.15 
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: index,
      }}
      className="bg-background rounded-3xl p-8 shadow-lg border-4 border-accent/40"
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
            <motion.span
              className="font-bold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: isPassed ? 1 : 0 }}
            >
              {step.targetProgress}%
            </motion.span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: isPassed ? `${step.targetProgress}%` : '0%' }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
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
  const isInView = useInView(cardRef, { once: true, amount: 0.5 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setProgress(step.targetProgress);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, step.targetProgress]);

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
