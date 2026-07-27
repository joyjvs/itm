import BannerHome from "@/components/features/Home/Banners";
import SectionProducts from "@/components/features/Home/Section-Products";
import HowItWorks from "@/components/features/Home/Steps";
import MainLayout from "@/components/layout/MainLayout";
import NewOffers from '../../components/features/Home/NewOffers';

const HomePage = () => {
  return (
    <MainLayout>
      <>
        <div className="w-full">
          <BannerHome />
          <HowItWorks />
          <NewOffers/>
          <SectionProducts/>
        </div>
      </>
    </MainLayout>
  );
};

export default HomePage;
