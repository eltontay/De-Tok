import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>De-Tok</title>
        <meta
          name="description"
          content="Viral videos live for long time, other die!"
        />
        <Image src="./video.png" alt="De-Tok Logo" />
      </Head>

      <main className={styles.main}>
        <div>
          <div className={styles.title}>
            <span className={`${styles.titleWord} ${styles.word2}`}>
              De-Tok
            </span>
          </div>
          <div className={styles.tagline}>
            <span className={`${styles.titleWord} ${styles.word2}`}>
              Trend-And-Earn{' '}
            </span>
            <span className={`${styles.titleWord} ${styles.word1}`}>
              Rewarding Content Providers
            </span>
            <span className={`${styles.titleWord} ${styles.word2}`}> Die </span>
            <span className={`${styles.titleWord} ${styles.word1}`}>
              Immortalising Viral Videos
            </span>
          </div>
          {/* Free Video Showcase */}
          <div className={styles.section}></div>
          {/* Paid Video Showcase */}
          <div className={styles.section}></div>
        </div>

        <div className={styles.hero}>{/* <Image src={hero} /> */}</div>
      </main>

      <footer className={styles.footer}>
        <span>Powered by {''}</span>
        <span>
          <Image
            src="/filecoin.png"
            alt="FileCoin Logo"
            width={20}
            height={20}
          />
        </span>
        <button className={styles.button}>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/eltontay/De-Tok"
          >
            Read Docs
          </a>
        </button>
      </footer>
    </div>
  );
}
