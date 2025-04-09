import React from 'react';
import styles from '../Dashboard.module.css';

interface DashboardHeaderProps {
  name?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ name }) => {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.greeting}>Hey, {name}</h1>
        <p className={styles.date}>
          Today is {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric' 
          })}
        </p>
      </div>
      <div className={styles.notificationIcon}>
        <img src="/notification-icon.png" alt="Notifications" />
      </div>
    </header>
  );
};

export default DashboardHeader; 