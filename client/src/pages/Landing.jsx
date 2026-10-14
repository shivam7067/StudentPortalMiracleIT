import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import CoursesSection from '../components/CoursesSection';
import JourneySection from '../components/JourneySection';
import PlacementSection from '../components/PlacementSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleOpenPortal = () => {
    if (isAuthenticated) {
      if (role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Sticky & Responsive Navbar */}
      <Navbar onOpenPortalModal={handleOpenPortal} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero onOpenPortalModal={handleOpenPortal} />

        {/* 2. Stats & Trust Section */}
        <StatsSection />

        {/* 3. About Section */}
        <AboutSection onOpenPortalModal={handleOpenPortal} />

        {/* 4. Features Section (15 Core Cards) */}
        <FeaturesSection />

        {/* 5. Courses Section */}
        <CoursesSection />

        {/* 6. 4-Step Learning Journey Section */}
        <JourneySection />

        {/* 7. Placement & Hiring Drives Section */}
        <PlacementSection onOpenPortalModal={handleOpenPortal} />

        {/* 8. Student Success / Testimonial Section */}
        <TestimonialsSection />

        {/* 9. Final Call to Action Section */}
        <CTASection onOpenPortalModal={handleOpenPortal} />
      </main>

      {/* Professional Footer */}
      <Footer onOpenPortalModal={handleOpenPortal} />
    </div>
  );
}
