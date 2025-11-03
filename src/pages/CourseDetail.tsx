import { useParams, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
import { EnrollmentButton, EnrollmentButtonHandle } from "@/components/EnrollmentButton";
import { CourseInfoSessionDialog } from "@/components/CourseInfoSessionDialog";
import { SEO } from "@/components/SEO";

interface CohortInfo {
  startDate: string;
  duration: string;
  sessionsCount: string;
  format: string;
}

interface SyllabusModule {
  module: number;
  title: string;
  topics: string[];
}

interface Trainer {
  name: string;
  title: string;
  credentials: string;
  bio: string;
  image: string;
}

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  image_url?: string;
  hero_claims: string[];
  cohort: CohortInfo | null;
  target_audience: string[];
  syllabus: SyllabusModule[];
  skills: string[];
  trainer: Trainer | null;
}

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInfoSessionOpen, setIsInfoSessionOpen] = useState(false);
  const enrollmentButtonRef = useRef<EnrollmentButtonHandle>(null);
  const handleInfoSessionOpen = () => setIsInfoSessionOpen(true);

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadCourse = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (!error && data) {
      setCourse(data as unknown as Course);
      checkEnrollment(data.id);
    }
    setLoading(false);
  };

  const checkEnrollment = async (courseId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.subtitle || course.title,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Craftory Academy",
      "url": "https://craftoryacademy.ge"
    },
    "url": `https://craftoryacademy.ge/courses/${course.slug}`,
    "courseCode": course.slug,
    "offers": {
      "@type": "Offer",
      "price": course.price || 0,
      "priceCurrency": "GEL"
    },
    ...(course.trainer && {
      "instructor": {
        "@type": "Person",
        "name": course.trainer.name,
        "jobTitle": course.trainer.title
      }
    }),
    ...(course.cohort && {
      "coursePrerequisites": course.target_audience?.join(", "),
      "educationalLevel": "Professional"
    })
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "მთავარი",
        "item": "https://craftoryacademy.ge/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "კურსები",
        "item": "https://craftoryacademy.ge/courses"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": course.title,
        "item": `https://craftoryacademy.ge/courses/${course.slug}`
      }
    ]
  };

  return (
    <>
      <SEO
        title={`${course.title} - Craftory Academy`}
        description={course.subtitle || `გაეცანი ${course.title} - პროფესიული ტრენინგი Craftory Academy-ში`}
        keywords={[
          course.title,
          "ავეჯის კონსტრუირება",
          "AutoCAD",
          "კურსი საქართველოში",
          ...(course.skills || [])
        ]}
        canonical={`/courses/${course.slug}`}
        ogImage={course.image_url || "/logo.png"}
        type="product"
        structuredData={structuredData}
        additionalStructuredData={[breadcrumbStructuredData]}
      />
      <div className="min-h-screen">
      <CourseHero
        claims={course.hero_claims}
        onRegisterClick={() => enrollmentButtonRef.current?.openPayment()}
        onInfoSessionClick={handleInfoSessionOpen}
        primaryCtaLabel={isLoggedIn ? "კურსის შეძენა" : "დარეგისტრირდი ახლავე"}
      />
      
      <PartnersMarquee />
      
      <ScrollytellingWhySection />
      
      {course.cohort && <CohortStrip cohort={course.cohort} />}
      
      {/* Enrollment Section */}
      <section className="py-12 bg-background border-y">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold uppercase mb-4">{course.title}</h2>
          <p className="text-xl text-muted-foreground mb-8">{course.subtitle}</p>
          <EnrollmentButton
            ref={enrollmentButtonRef}
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
      
      <InfoSessionCTA onRegisterClick={handleInfoSessionOpen} />
      
      <TrainerCard trainer={course.trainer} />
      <CourseInfoSessionDialog
        open={isInfoSessionOpen}
        onOpenChange={setIsInfoSessionOpen}
        courseTitle={course.title}
        courseId={course.id}
      />
    </div>
    </>
  );
}
