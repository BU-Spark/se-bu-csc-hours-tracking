import React from 'react';
import styles from '../Dashboard.module.css';

interface StatsGridProps {
  stats: {
    approvedHours: number;
    pendingHours: number;
    upcomingHours: number;
    totalEvents: number;
  };
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <section className={styles.statsSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <h3>You Completed</h3>
          <p className={styles.statValue}>{stats.approvedHours}h</p>
          <p className={styles.statLabel}>this semester</p>
        </div>
        <div className={styles.statsCard}>
          <h3>You Attended</h3>
          <p className={styles.statValue}>{stats.totalEvents}</p>
          <p className={styles.statLabel}>Events this semester</p>
        </div>
        <div className={styles.statsCard}>
          <h3>You Submitted</h3>
          <p className={styles.statValue}>{stats.pendingHours}</p>
          <p className={styles.statLabel}>Service Opportunities</p>
        </div>
      </div>
    </section>
  );
};

export default StatsGrid; 