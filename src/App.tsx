import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Syllabus from "./pages/Syllabus";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import AdminLeads from "./pages/AdminLeads";
import AdminCourses from "./pages/AdminCourses";
import AdminPartners from "./pages/AdminPartners";
import CourseManage from "./pages/CourseManage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourseView from "./pages/StudentCourseView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname.startsWith('/auth');
  const isStudentRoute = location.pathname.startsWith('/student');

  useEffect(() => {
    const body = document.body;
    if (isAdminRoute) {
      body.classList.add("admin-layout");
    } else {
      body.classList.remove("admin-layout");
    }

    return () => {
      body.classList.remove("admin-layout");
    };
  }, [isAdminRoute]);

  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main-content" className="skip-link">
        გადადით მთავარ შიგთავსზე
      </a>
      {!isAdminRoute && !isAuthRoute && !isStudentRoute && <Header />}
      <main id="main-content" className={isAdminRoute || isAuthRoute || isStudentRoute ? "" : "flex-grow"}>
        <div className={isAdminRoute ? "admin-layout" : ""}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/syllabus/:slug" element={<Syllabus />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute requiredRole="admin"><AdminCourses /></ProtectedRoute>} />
          <Route path="/admin/leads" element={<ProtectedRoute requiredRole="admin"><AdminLeads /></ProtectedRoute>} />
          <Route path="/admin/partners" element={<ProtectedRoute requiredRole="admin"><AdminPartners /></ProtectedRoute>} />
          <Route path="/admin/courses/:id" element={<ProtectedRoute requiredRole="admin"><CourseManage /></ProtectedRoute>} />
          <Route path="/student/dashboard" element={<ProtectedRoute requiredRole="user"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/courses/:slug" element={<ProtectedRoute requiredRole="user"><StudentCourseView /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
      </main>
      {!isAdminRoute && !isAuthRoute && !isStudentRoute && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
