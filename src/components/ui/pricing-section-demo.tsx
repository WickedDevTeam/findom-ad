
"use client"

import { Check, ChevronRight, CreditCard, Crown, ExternalLink, Heart, Shield, ShoppingCart, Stars } from "lucide-react"
import { SinglePricingCard, type Testimonial } from "@/components/ui/single-pricing-card"

export function PricingSectionDemo() {
  const features = [
    "Modern Next.js 14 App Router",
    "TypeScript and Tailwind CSS",
    "Supabase Auth Integration",
    "Database Tables and Schema",
    "Responsive Dashboard Layout",
    "50+ UI Components",
    "Dark Mode Support",
    "Authentication Flows",
    "SEO Optimized",
    "Performance Optimized",
    "Email Templates",
    "Premium Support",
  ].map((text) => ({ text }))

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Full Stack Developer",
      company: "TechFlow",
      content:
        "This starter template saved me weeks of setup time. The Supabase integration is flawless, and the UI components are beautiful and easy to customize. Worth every penny!",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Sarah Miller",
      role: "Frontend Engineer",
      company: "DesignHub",
      content:
        "I've used many starter templates, but this one stands out for its clean architecture and attention to detail. The TypeScript support is excellent, and the documentation is comprehensive.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateLabs",
      content:
        "Our team was able to launch our MVP in record time thanks to this template. The authentication flow and user management features worked right out of the box. Highly recommended!",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "CreativeCraft",
      content:
        "The dark mode implementation is perfect, and the components are accessible by default. As a designer, I appreciate the attention to detail and the clean, modern aesthetic.",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 5,
      name: "David Park",
      role: "CTO",
      company: "StartupForge",
      content:
        "We evaluated several starter templates for our new project, and this one was by far the most complete. The code quality is excellent, and the structure makes it easy to extend.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      id: 6,
      name: "Olivia Martinez",
      role: "Product Owner",
      company: "InnovateX",
      content:
        "After evaluating several solutions, we chose this one for its flexibility and robust feature set. The onboarding process was smooth, and our team was productive from day one.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden flex justify-center" id="pricing">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 mb-4 rounded-full border border-findom-purple/20 shadow-sm">
            <CreditCard className="mr-1 h-3.5 w-3.5 text-findom-purple" />
            <span className="text-xs font-medium">Simple Pricing</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-white">
            One template, endless possibilities
          </h2>
          <p className="max-w-[700px] text-findom-purple/80 md:text-xl/relaxed">
            Everything you need to build your next great SaaS application
          </p>
        </div>

        <SinglePricingCard
          badge={{
            icon: Crown,
            text: "Premium Template",
          }}
          title="Next.js Starter Template"
          subtitle="Build your next SaaS application with this premium starter template"
          price={{
            current: "$69.99",
            original: "$99.99",
            discount: "30% Off",
          }}
          benefits={[
            {
              text: "One-time payment, lifetime updates",
              icon: Check,
            },
            {
              text: "30-day money-back guarantee",
              icon: Shield,
            },
            {
              text: "Created by developers for developers",
              icon: Heart,
            },
          ]}
          features={features}
          featuresIcon={Check}
          featuresBadge={{
            icon: Stars,
            text: "All Features",
          }}
          primaryButton={{
            text: "Purchase Template",
            icon: ShoppingCart,
            chevronIcon: ChevronRight,
          }}
          secondaryButton={{
            text: "Live Demo",
            icon: ExternalLink,
            href: "#",
          }}
          testimonials={testimonials}
          testimonialRotationSpeed={5000}
        />
      </div>
    </section>
  )
}

export default PricingSectionDemo;
