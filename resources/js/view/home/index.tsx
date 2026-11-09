import HeroSection from './hero-section/index.js';
import ValueProps from './value-props/index.js';
import FeaturedShops from './featured-shops/index.js';

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <ValueProps />
      <FeaturedShops />
    </div>
  );
}
