import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { BasicVideos } from '../components/BasicVideos';
import { TrendingVideos } from '../components/TrendingVideos';
export default function Home() {
  return (
    <>
      <Head>
        <title>De Tok</title>
        <meta
          name="description"
          content="Viral videos live for long time, other die!"
        />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <div>
            <div className={styles.title}>
              <span className={`${styles.titleWord} ${styles.word2}`}>
                De Tok
              </span>
            </div>
            <div className={styles.tagline}>
              <span className={`${styles.titleWord} ${styles.word2}`}>
                Trend-And-Earn{' '}
              </span>
              <span className={`${styles.titleWord} ${styles.word1}`}>
                Rewarding Content Providers
              </span>
              <span className={`${styles.titleWord} ${styles.word2}`}>
                {' '}
                Die{' '}
              </span>
              <span className={`${styles.titleWord} ${styles.word1}`}>
                Immortalising Viral Videos
              </span>
            </div>
          </div>
          <div className={styles.hero}>{/* <Image src={hero} /> */}</div>
        </main>
        <div className={styles.collections}>
          {/* Free Video Showcase */}
          <div className={styles.collection}>
            <TrendingVideos />
          </div>
          {/* Paid Video Showcase */}
          <div className={styles.collection}>
            <BasicVideos />
          </div>
        </div>
      </div>
    </>
  );
}
