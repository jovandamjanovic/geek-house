'use client';

import React from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './FeaturedGamesSection.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface GameData {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  players: string;
  duration: string;
}

interface FeaturedGamesSectionProps {
  className?: string;
  games?: GameData[];
}

const FeaturedGamesSection: React.FC<FeaturedGamesSectionProps> = ({ 
  className,
  games 
}) => {
  const t = useTranslations('HomePage');

  // Default game data if none provided - expanded for better carousel demo
  const defaultGames: GameData[] = [
    {
      id: '1',
      title: 'FANTASY QUEST',
      description: t('fantasyDescription'),
      image: '/gh_large.png',
      rating: 4.8,
      players: '2-4',
      duration: '60-90min'
    },
    {
      id: '2',
      title: 'SPACE COLONIES',
      description: 'Build and manage colonies across different planets in this strategic space exploration game.',
      image: '/gh_large.png',
      rating: 4.6,
      players: '1-5',
      duration: '45-75min'
    },
    {
      id: '3',
      title: 'MEDIEVAL TRADE',
      description: 'Become a merchant in medieval Europe, trading goods and building your commercial empire.',
      image: '/gh_large.png',
      rating: 4.7,
      players: '2-6',
      duration: '90-120min'
    },
    {
      id: '4',
      title: 'CYBER WARFARE',
      description: 'Lead your faction in a dystopian future where technology and strategy determine survival.',
      image: '/gh_large.png',
      rating: 4.5,
      players: '2-4',
      duration: '75-100min'
    },
    {
      id: '5',
      title: 'OCEAN EXPLORERS',
      description: 'Dive deep into the mysteries of the ocean and discover ancient treasures and sea creatures.',
      image: '/gh_large.png',
      rating: 4.9,
      players: '1-4',
      duration: '30-60min'
    }
  ];

  const displayGames = games || defaultGames;

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false
        }
      }
    ]
  };

  return (
    <section className={`${styles.featured} ${className || ''}`}>
      <h2 className={styles.sectionTitle}>{t('featuredGames')}</h2>
      <div className={styles.carouselContainer}>
        <Slider {...carouselSettings}>
          {displayGames.map((game) => (
            <div key={game.id} className={styles.slideWrapper}>
              <div className={styles.gameCard}>
                <Image
                  src={game.image}
                  alt={game.title}
                  width={120}
                  height={120}
                  className={styles.gameImage}
                />
                <div className={styles.gameInfo}>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <p className={styles.gameDescription}>{game.description}</p>
                  <div className={styles.gameStats}>
                    <span>⭐ {game.rating}</span>
                    <span>👥 {game.players}</span>
                    <span>⏰ {game.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FeaturedGamesSection;