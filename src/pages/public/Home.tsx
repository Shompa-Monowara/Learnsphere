import {
  Categories,
  CtaBanner,
  Faq,
  Features,
  FeaturedCourses,
  Hero,
  HowItWorks,
  Instructors,
  Newsletter,
  PricingPreview,
  Stats,
  Testimonials,
  TrustedBy,
} from "@/features/home"

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Categories />
      <FeaturedCourses />
      <Instructors />
      <Stats />
      <Testimonials />
      <PricingPreview />
      <Faq />
      <Newsletter />
      <CtaBanner />
    </>
  )
}