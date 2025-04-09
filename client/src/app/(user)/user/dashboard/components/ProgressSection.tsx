import React from 'react';
import styles from '../Dashboard.module.css';

interface ProgressSectionProps {
  person: any;
  approvedHours: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ person, approvedHours }) => {
  const calculateDaysRemaining = () => {
    if (!person?.goal_date) return null;
    
    const daysRemaining = Math.max(
      0, 
      Math.ceil(
        (new Date(person.goal_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    
    return daysRemaining;
  };
  
  const formatGoalDate = () => {
    if (!person?.goal_date) return null;
    
    return new Date(person.goal_date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const hourGoal = person?.hour_goal || 90;
  const hoursRemaining = hourGoal - approvedHours;
  const progressPercentage = (approvedHours / hourGoal) * 100;
  const daysRemaining = calculateDaysRemaining();
  const formattedGoalDate = formatGoalDate();

  return (
    <div className={styles.progressSection}>
      <h3 className={styles.progressTitle}>Current Progress</h3>
      <div className={styles.progressCard}>
        <p className={styles.progressText}>
          You are {hoursRemaining} hours away from your goal for this semester.
          {daysRemaining !== null && formattedGoalDate && (
            <span className={styles.daysRemaining}>
              {daysRemaining} days remaining until {formattedGoalDate}
            </span>
          )}
        </p>
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBar} 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
        <div className={styles.progressLabels}>
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection; 