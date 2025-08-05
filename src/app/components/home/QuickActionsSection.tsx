'use client';

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './QuickActionsSection.module.css';

interface ActionData {
  id: string;
  icon: string;
  text: string;
  onClick?: () => void;
  url?: string;
}

interface QuickActionsSectionProps {
  className?: string;
  actions?: ActionData[];
  onActionClick?: (action: ActionData) => void;
}

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ 
  className,
  actions,
  onActionClick
}) => {
  const t = useTranslations('HomePage');

  // Default action data if none provided
  const defaultActions: ActionData[] = [
    {
      id: 'search',
      icon: '🔍',
      text: t('search'),
      url: '/search'
    },
    {
      id: 'members',
      icon: '👥',
      text: t('members'),
      url: '/members'
    },
    {
      id: 'favorites',
      icon: '⭐',
      text: t('favorites'),
      url: '/favorites'
    },
    {
      id: 'stats',
      icon: '📊',
      text: t('stats'),
      url: '/stats'
    }
  ];

  const displayActions = actions || defaultActions;

  const handleActionClick = (action: ActionData) => {
    if (onActionClick) {
      onActionClick(action);
    } else if (action.onClick) {
      action.onClick();
    } else if (action.url) {
      if (action.url.startsWith('http')) {
        window.open(action.url, '_blank');
      } else {
        window.location.href = action.url;
      }
    }
  };

  return (
    <section className={`${styles.quickActions} ${className || ''}`}>
      <h2 className={styles.sectionTitle}>{t('quickActions')}</h2>
      <div className={styles.actionGrid}>
        {displayActions.map((action) => (
          <button
            key={action.id}
            className={styles.actionButton}
            onClick={() => handleActionClick(action)}
          >
            <span className={styles.actionIcon}>{action.icon}</span>
            <span className={styles.actionText}>{action.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActionsSection;