import { useParams, Navigate } from "react-router-dom";
import { academyConfig } from "@/config/academy";
import { CourseHero } from "@/components/CourseHero";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { WhySection } from "@/components/WhySection";
import { CohortStrip } from "@/components/CohortStrip";
import { TargetAudienceSection } from "@/components/TargetAudienceSection";
import { InfoSessionCTA } from "@/components/InfoSessionCTA";
import { TrainerCard } from "@/components/TrainerCard";
import { SkillsGrid } from "@/components/SkillsGrid";
import { SyllabusAccordion } from "@/components/SyllabusAccordion";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function CourseDetail() {
  const { slug } = useParams();
  const course = academyConfig.courses.find(c => c.slug === slug);

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const scrollToRegistration = () => {
    const element = document.getElementById("registration");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <CourseHero
        claims={course.heroClaims}
        onRegisterClick={scrollToRegistration}
        onInfoSessionClick={scrollToRegistration}
      />
      
      <PartnersMarquee />
      
      <WhySection points={course.whyPoints} />
      
      <CohortStrip cohort={course.cohort} />
      
      <TargetAudienceSection audience={course.targetAudience} />
      
      <InfoSessionCTA onRegisterClick={scrollToRegistration} />
      
      <TrainerCard trainer={course.trainer} />
      
      <SkillsGrid skills={course.skills} />
      
      <SyllabusAccordion modules={course.syllabus} courseSlug={course.slug} />
      
      <RegistrationForm />
    </div>
  );
}
