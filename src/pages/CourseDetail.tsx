import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseHero } from "@/components/CourseHero";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { ScrollytellingWhySection } from "@/components/ScrollytellingWhySection";
import { CohortStrip } from "@/components/CohortStrip";
import { TargetAudienceSection } from "@/components/TargetAudienceSection";
import { InfoSessionCTA } from "@/components/InfoSessionCTA";
import { TrainerCard } from "@/components/TrainerCard";
import { SkillsGrid } from "@/components/SkillsGrid";
import { SyllabusAccordion } from "@/components/SyllabusAccordion";
import { RegistrationForm } from "@/components/RegistrationForm";

interface Course {
  id: string;
  slug: string;
  title: string;
  hero_claims: string[];
  cohort: any;
  target_audience: string[];
  syllabus: any[];
  skills: string[];
  trainer: any;
}

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (!error && data) {
      setCourse(data as Course);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>იტვირთება...</p>
      </div>
    );
  }

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
        claims={course.hero_claims}
        onRegisterClick={scrollToRegistration}
        onInfoSessionClick={scrollToRegistration}
      />
      
      <PartnersMarquee />
      
      <ScrollytellingWhySection />
      
      <CohortStrip cohort={course.cohort} />
      
      <TargetAudienceSection audience={course.target_audience} />
      
      <SyllabusAccordion modules={course.syllabus} courseSlug={course.slug} />
      
      <SkillsGrid skills={course.skills} />
      
      <InfoSessionCTA onRegisterClick={scrollToRegistration} />
      
      <TrainerCard trainer={course.trainer} />
      
      <RegistrationForm />
    </div>
  );
}
