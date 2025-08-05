'use client';

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './CommunityAnnouncementsSection.module.css';

export interface AnnouncementData {
  id: string;
  title: string;
  text: string;
  icon: string;
  url?: string;
}

interface CommunityAnnouncementsSectionProps {
  className?: string;
  announcements?: AnnouncementData[];
  onAnnouncementClick?: (announcement: AnnouncementData) => void;
}

const CommunityAnnouncementsSection: React.FC<CommunityAnnouncementsSectionProps> = ({ 
  className,
  announcements,
  onAnnouncementClick
}) => {
  const t = useTranslations('HomePage');

  // Default announcement data if none provided
  const defaultAnnouncements: AnnouncementData[] = [
    {
      id: '1',
      title: t('announcementTitle1'),
      text: t('announcementText1'),
      icon: '📅',
      url: '#'
    },
    {
      id: '2',
      title: t('announcementTitle2'),
      text: t('announcementText2'),
      icon: '🏆',
      url: '#'
    }
  ];

  const displayAnnouncements = announcements || defaultAnnouncements;

  const handleAnnouncementClick = (announcement: AnnouncementData) => {
    if (onAnnouncementClick) {
      onAnnouncementClick(announcement);
    } else if (announcement.url && announcement.url !== '#') {
      window.open(announcement.url, '_blank');
    }
  };

  return (
    <section className={`${styles.announcements} ${className || ''}`}>
      <h2 className={styles.sectionTitle}>{t('communityAnnouncements')}</h2>
      {displayAnnouncements.map((announcement) => (
        <div 
          key={announcement.id} 
          className={styles.announcement}
          onClick={() => handleAnnouncementClick(announcement)}
          style={{ 
            cursor: (onAnnouncementClick || (announcement.url && announcement.url !== '#')) 
              ? 'pointer' 
              : 'default' 
          }}
        >
          <div className={styles.announcementIcon}>{announcement.icon}</div>
          <div className={styles.announcementContent}>
            <h3 className={styles.announcementTitle}>{announcement.title}</h3>
            <p className={styles.announcementText}>{announcement.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CommunityAnnouncementsSection;