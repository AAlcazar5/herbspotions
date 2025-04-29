import Hero from "@/home/components/Hero";
import FeaturedCollection from "@/home/components/FeaturedCollection";
import ImagesRow from "@/home/components/ImageRow";
import MainSection from "@/home/components/MainSection";

const HomePage = async () => {
  return (
    <div className="mx-auto max-w-full shadow-lg">
      <Hero />
      <FeaturedCollection />
      <ImagesRow />
      <MainSection />
    </div>
  );
};

export default HomePage;

export const metadata = {
  title: "Home Page | Herbs & Potions",
  description: "The homepage, where we have the hero, some featured CBD products, and a description of what our company is about.",
};