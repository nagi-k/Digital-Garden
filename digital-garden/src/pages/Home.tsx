import Hero from '@/components/sections/Hero';
import FeaturedNav from '@/components/sections/FeaturedNav';
import LatestUpdates from '@/components/sections/LatestUpdates';
import RidingMap from '@/components/sections/RidingMap';
import PageTransition from '@/components/layout/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <Hero />
      <FeaturedNav />
      <LatestUpdates />
      <RidingMap />
    </PageTransition>
  );
};

export default Home;
