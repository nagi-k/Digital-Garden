import Hero from '@/components/sections/Hero';
import FeaturedNav from '@/components/sections/FeaturedNav';
import RidingMap from '@/components/sections/RidingMap';
import PageTransition from '@/components/layout/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <Hero />
      <FeaturedNav />
      <RidingMap />
    </PageTransition>
  );
};

export default Home;
