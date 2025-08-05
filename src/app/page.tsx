'use client';

import React from 'react';
import WelcomeSection from './components/home/WelcomeSection';
import FeaturedGamesSection from './components/home/FeaturedGamesSection';
import LatestArticlesSection from './components/home/LatestArticlesSection';
import CommunityAnnouncementsSection, { AnnouncementData } from './components/home/CommunityAnnouncementsSection';
// import QuickActionsSection from './components/home/QuickActionsSection';
import styles from './page.module.css';

const Home: React.FC = () => {
  const handleViewAllArticles = () => {
    // Navigate to articles page or show all articles
    console.log('View all articles clicked');
  };

  const handleAnnouncementClick = (announcement: AnnouncementData) => {
    // Handle announcement click
    console.log('Announcement clicked:', announcement);
  };

  // const handleActionClick = (action: any) => {
  //   // Handle quick action click
  //   console.log('Quick action clicked:', action);
  // };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <WelcomeSection />
        <FeaturedGamesSection />
        <LatestArticlesSection 
          onViewAllClick={handleViewAllArticles}
        />
        <CommunityAnnouncementsSection 
          onAnnouncementClick={handleAnnouncementClick}
        />
        {/* <QuickActionsSection 
          onActionClick={handleActionClick}
        /> */}
      </main>
    </div>
  );
};

export default Home;
