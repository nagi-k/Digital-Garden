import Hero from '@/components/sections/Hero';
import FeaturedNav from '@/components/sections/FeaturedNav';
import LatestUpdates from '@/components/sections/LatestUpdates';
import PageTransition from '@/components/layout/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <Hero />
      <FeaturedNav />
      <LatestUpdates />
    </PageTransition>
  );
};

export default Home;
