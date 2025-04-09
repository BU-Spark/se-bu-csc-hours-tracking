import React from 'react';
import styles from '../Dashboard.module.css';

const FeaturedCards: React.FC = () => {
  return (
    <div className={styles.featuredCards}>
      <div className={styles.card}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a79c10b2df66d06f7d3afd2a1fb0673833d6e9120738075e3f0ec116a0ce9b6b" 
          alt="CSC Programs" 
          className={styles.cardImage} 
        />
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>CSC Programs</h3>
          <a href="#" className={styles.cardLink}>Learn More</a>
        </div>
      </div>
      <div className={styles.card}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/824021eddd5d093bf5256b71a125e5b62b481665715b72c63f8ac770f3fcb06b" 
          alt="Join the CSC" 
          className={styles.cardImage} 
        />
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>Join the CSC</h3>
          <a href="#" className={styles.cardLink}>Learn More</a>
        </div>
      </div>
      <div className={styles.card}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b45508b446396513217812dc9ed04a322366668c0644f412be05d0d877cab59b" 
          alt="Newsletter" 
          className={styles.cardImage} 
        />
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>Newsletter</h3>
          <a href="#" className={styles.cardLink}>Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCards; 