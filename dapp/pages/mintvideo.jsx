import React, { useState, useCallback } from "react";
import Head from "next/head";
import styles from "../styles/MintVideo.module.css";
import { useDropzone } from "react-dropzone";
import { Web3Storage } from "web3.storage";

const style = {
  width: 200,
  height: 150,
  border: "1px dotted #888",
  cursor: "pointer",
};

function makeStorageClient() {
  return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN });
}

const StoreContent = async (files) => {
  const client = makeStorageClient();
  const cid = await client.put(files);
  console.log("stored files with cid:", cid);
  setTimeout(3000);
  return cid;
};
// cid: bafybeigkdrxadzsbdeyomforg7yzvm2wrz35clnp6ifnwxxhwjohz7xvpm
export default function MintVideo() {
  const onDrop = useCallback(async (acceptedFiles) => {
    console.log("uploading...");
    const cid = await StoreContent(acceptedFiles);
    console.log("cid:", cid);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 5242880, //5MB
  });
  return (
    <>
      <Head>
        <title>Mint</title>
        <meta name="description" content="Mint a New Video" />
        <link rel="icon" href="/video.png" />
      </Head>

      <main className={styles.main}>
        <div className={styles.title}>
          <span className={`${styles.titleWord} ${styles.word2}`}>
            Mint a Video
          </span>
        </div>
        <div {...getRootProps()} style={style}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </main>
    </>
  );
}
