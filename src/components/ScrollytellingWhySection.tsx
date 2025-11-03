// ScrollytellingWhySection.tsx renders a simple auto-playing carousel for "რატომ Craftory Academy?" section.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepCard {
  title: string;
  description: string;
}

interface ScrollytellingWhySectionProps {
  cards?: StepCard[];
}

export function ScrollytellingWhySection({ cards }: ScrollytellingWhySectionProps) {
  const steps = cards || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % steps.length);
    }, 5000); // Change card every 5 seconds

    return () => clearInterval(interval);
  }, [isDragging]);

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % steps.length);
  };

  const goToPrev = () => {
    setActiveIndex((current) => (current - 1 + steps.length) % steps.length);
  };

  const handleDragEnd = (_event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      goToPrev();
    } else if (info.offset.x < -threshold) {
      goToNext();
    }
    setIsDragging(false);
  };

  return (
    <section className="relative bg-cream overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-2 gap-20 max-w-6xl mx-auto items-center min-h-[600px]">
            {/* Left Column - Heading */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight">
                  რატომ უნდა გახდე ავეჯის კონსტრუქტორი ?
                </h2>
                <div className="mt-6 w-24 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
              </motion.div>
            </div>

            {/* Right Column - Animated Cards */}
            <div className="relative h-[500px] cursor-grab active:cursor-grabbing">
              <AnimatePresence mode="wait">
                <CarouselCard
                  key={activeIndex}
                  step={steps[activeIndex]}
                  index={activeIndex}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold uppercase leading-tight">
              რატომ უნდა გახდე ავეჯის კონსტრუქტორი ?
            </h2>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <MobileStepCard key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CarouselCardProps {
  step: StepCard;
  index: number;
  onDragStart?: () => void;
  onDragEnd?: (event: any, info: any) => void;
}

// CarouselCard renders a simple animated card with fade transition.
function CarouselCard({ step, index, onDragStart, onDragEnd }: CarouselCardProps) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute inset-0 w-full flex items-center"
    >
      <div className="w-full bg-background rounded-3xl p-8 shadow-xl border-2 border-accent/20">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface MobileStepCardProps {
  step: StepCard;
  index: number;
}

// MobileStepCard provides simplified scrolling cards for mobile viewports.
function MobileStepCard({ step, index }: MobileStepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-background rounded-2xl p-6 shadow-medium"
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
