import HeroSection from "../components/HeroSection";
import CategoryGrid from "../components/CategoryGrid";
import WhyChooseSection from "../components/WhyChooseSection";
import BrandsMakers from "../components/BrandsMakers";
import Articles from "../components/Articles";
import Testimonials from "../components/Testimonials";
import FeaturedProducts from "../components/FeaturedProducts";
import NearbyServices from "../components/NearbyServices";
import FeaturesBar from "../components/FeaturesBar";
import TractorShowcase from "../components/TractorShowcase";
import EnquiryModal from '../components/EnquiryModal';
import BrandModelFilter from "../components/BrandModelFilter";
import AgriProductSection from "../components/AgriProductSection";
import TrustCounter from "../components/TrustCounter";
import PromoBanners from "../components/PromoBanners";

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturesBar />
      <BrandsMakers />
      <TractorShowcase />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandModelFilter />
      <PromoBanners />
      <AgriProductSection />
      {/* <NearbyServices /> */}
      <TrustCounter />
      <WhyChooseSection />
      {/* <Articles /> */}
      <Testimonials />
       <EnquiryModal />
    </>
  );
};

export default Home;