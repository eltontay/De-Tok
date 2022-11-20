import React, { useState, useCallback, useEffect, Children } from "react";

// video src
// video type
// Image to show 
// storage deal info

export const VideoComponent = ({ src }) => {
    const { url, type } = src;
    // const demostr = `{"source": [{"src": "https://bafybeidtig7gruy5yirxjhbp675apd3qkrr6soawhh7bhpj7l4sdp7pawe.ipfs.w3s.link/ipfs/bafybeidtig7gruy5yirxjhbp675apd3qkrr6soawhh7bhpj7l4sdp7pawe/sample-5s.mp4", "type":"video/mp4"}], "attributes": {"preload": false, "playsinline": true, "controls": true}}`
    const dataSrc = `{"source": [{"src":"${url}","type":"${ type}"}], "attributes": {"preload": false, "playsinline": true, "controls": true}}`
    return (
      <a
        className="gallery-item" 
        data-lg-size="1406-1390"
        data-video={dataSrc}
        data-sub-html=""
        >
         <img alt="img1" src="http://placekitten.com/g/100/100" />
      </a>
    )
}