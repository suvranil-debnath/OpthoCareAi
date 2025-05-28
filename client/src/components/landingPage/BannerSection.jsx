import React from 'react';
import banner from '../../assets/banner.png';
import './BannerSection.css';

const BannerSection = () => (
  <section className="banner-section">
    <img src={banner} alt="BetterSight Banner" className="banner-image" />
  </section>
);

export default BannerSection;