import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';

// lightgallery styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-video.css";

// videojs styles
import "video.js/dist/video-js.css";
import "@videojs/themes/dist/fantasy/index.css";

import styles from "../styles/VideoGallery.module.css";


export default function VideoGallery() {
    return (
        <div className={styles.mediaGrid}>
            <LightGallery
            download={false}
            speed={500}
            plugins={[lgVideo]}
            videojs={true}
            videojsTheme="vjs-theme-fantasy"
            >
            <a className={styles.mediaItem} href="https://placekitten.com/800/400">
                <img alt="img1" src="http://placekitten.com/g/400/400" />
            </a>
            <a className={styles.mediaItem} href="https://placekitten.com/800/400">
                <img alt="img1" src="http://placekitten.com/g/400/400" />
            </a>
            <a className={styles.mediaItem} href="https://placekitten.com/800/400">
                <img alt="img1" src="http://placekitten.com/g/400/400" />
            </a>
            <a className={styles.mediaItem} href="https://placekitten.com/800/400">
                <img alt="img1" src="http://placekitten.com/g/400/400" />
            </a>
            <a className={styles.mediaItem} 
                data-lg-size="1280-720"
                data-src="//https://youtu.be/WZFIo4yj17c"
                data-poster="https://img.youtube.com/vi/egyIeygdS_E/maxresdefault.jpg"
                data-sub-html="<h4>Visual Soundscapes - Mountains | Planet Earth II | BBC America</h4><p>On the heels of Planet Earth II's record-breaking Emmy nominations, BBC America presents stunning visual soundscapes from the series' amazing habitats.</p>"
            >
                <img
                    width="300"
                    height="100"
                    className={styles.mediaItemImg} 
                    src="https://img.youtube.com/vi/egyIeygdS_E/maxresdefault.jpg"
                />
            </a>
           </LightGallery>
       </div>
    );
}
