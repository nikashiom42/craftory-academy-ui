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
import { EnrollmentButton } from "@/components/EnrollmentButton";

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
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
  const [isEnrolled, setIsEnrolled] = useState(false);

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
      checkEnrollment(data.id);
    }
    setLoading(false);
  };

  const checkEnrollment = async (courseId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("course_enrollments")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    setIsEnrolled(!!data);
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

  return (
    <div className="min-h-screen">
      <CourseHero
        claims={course.hero_claims}
        onRegisterClick={() => {}}
        onInfoSessionClick={() => {}}
      />
      
      <PartnersMarquee />
      
      <ScrollytellingWhySection />
      
      <CohortStrip cohort={course.cohort} />
      
      {/* Enrollment Section */}
      <section className="py-12 bg-background border-y">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold uppercase mb-4">{course.title}</h2>
          <p className="text-xl text-muted-foreground mb-8">{course.subtitle}</p>
          <EnrollmentButton
            courseId={course.id}
            courseTitle={course.title}
            price={course.price || 0}
            isEnrolled={isEnrolled}
          />
        </div>
      </section>
      
      <TargetAudienceSection audience={course.target_audience} />
      
      <SyllabusAccordion modules={course.syllabus} courseSlug={course.slug} />
      
      <SkillsGrid skills={course.skills} />
      
      <InfoSessionCTA onRegisterClick={() => {}} />
      
      <TrainerCard trainer={course.trainer} />
    </div>
  );
}
