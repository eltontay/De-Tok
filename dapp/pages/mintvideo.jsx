import React, { useState, useCallback } from "react";
import Head from "next/head";
import styles from "../styles/MintVideo.module.css";
import { useDropzone } from "react-dropzone";
import { Web3Storage } from "web3.storage";

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

const hoge = async () => {
  // const cid = await storage.put(files,options);
  const storage = makeStorageClient();
  const cid = "bafybeigkdrxadzsbdeyomforg7yzvm2wrz35clnp6ifnwxxhwjohz7xvpm";

  // const resdata = await storage.get(cid);
  // const filesReterived = await resdata.files();
  // for (const file of filesReterived) {
  //   console.log(file);
  //   console.log(`${file.cid} ${file.name} ${file.size}`);
  // }
  const res = await storage.status(cid);
  console.log(res);
};
// hoge();
// cid: bafybeigkdrxadzsbdeyomforg7yzvm2wrz35clnp6ifnwxxhwjohz7xvpm

export default function MintVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");

  const onSubmit = () => {
    console.log("onSubmit");
  };
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
        <div className="flex flex-col items-center h-full pt-10">
          {/* <div className="text-2xl pb-4">Mint Video</div> */}
          <label className="w-full font-bold">
            Title
            <input
              className="w-full p-3 my-2 border rounded focus:outline-none focus:ring-2"
              placeholder=""
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </label>
          <label className="w-full font-bold">
            Description
            <textarea
              className="w-full p-3 my-2 border rounded focus:outline-none focus:ring-2"
              placeholder=""
              type="text"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
          </label>
          <label className="w-full font-bold">
            Author
            <input
              className="w-full p-3 my-2 border rounded focus:outline-none focus:ring-2"
              placeholder=""
              type="text"
              value={author}
              onChange={(event) => {
                setAuthor(event.target.value);
              }}
            />
          </label>
          <label className="w-full font-bold">
            Video
            <div
              {...getRootProps()}
              className="h-40 cursor-pointer border border-dashed border-white flex items-center justify-center"
            >
              <input {...getInputProps()} />
              <div className="px-4">
                {isDragActive
                  ? "Drop the files here ..."
                  : "Drag & drop some files here, or click to select files"}
              </div>
            </div>
          </label>
          <div className="pt-6">
            <button
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              onClick={() => onSubmit()}
            >
              Mint Video
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
