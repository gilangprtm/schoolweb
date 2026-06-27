import HeroSection from "@/components/home/HeroSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import AchievementHighlight from "@/components/home/AchievementHighlight";
import NewsSection from "@/components/home/NewsSection";
import FacilityHighlight from "@/components/home/FacilityHighlight";
import SPMBBanner from "@/components/home/SPMBBanner";
import LocationSection from "@/components/home/LocationSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <AchievementHighlight />
      <NewsSection />
      <FacilityHighlight />
      <SPMBBanner />
      <LocationSection />
    </>
  );
}
