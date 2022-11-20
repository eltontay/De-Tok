import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// import plugins if you need
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";

// lightgallery styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-video.css";

// videojs styles
import "video.js/dist/video-js.css";
import "@videojs/themes/dist/fantasy/index.css";

import styles from "../styles/VideoGallery.module.css";

import { VideoComponent } from "./VideoComponent";

export default function VideoGallery({ cids }) {
  console.log(cids);

  const url =
    "https://bafybeidtig7gruy5yirxjhbp675apd3qkrr6soawhh7bhpj7l4sdp7pawe.ipfs.w3s.link/ipfs/bafybeidtig7gruy5yirxjhbp675apd3qkrr6soawhh7bhpj7l4sdp7pawe/sample-5s.mp4";
  const type = "video/mp4";

  return (
    <div className="p-4">
      <LightGallery
        elementClassNames="flex flex-row flex-wrap gap-4"
        download={false}
        speed={500}
        plugins={[lgVideo]}
        videojs={true}
        videojsTheme="vjs-theme-fantasy"
      >
        {/* {videos.map((video)=>{
          <VideoComponent src={video.src} />
        })}   */}
        <VideoComponent src={{ url, type }}></VideoComponent>
        <VideoComponent src={{ url, type }}></VideoComponent>
        <VideoComponent src={{ url, type }}></VideoComponent>
      </LightGallery>
    </div>
  );
}
