import Hero from '@/components/sections/Hero';
import FeaturedNav from '@/components/sections/FeaturedNav';
import PageTransition from '@/components/layout/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <Hero />
      <FeaturedNav />
    </PageTransition>
  );
};

export default Home;
