import React, { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/MintVideo.module.css";
import { useDropzone } from "react-dropzone";
import { Web3Storage } from "web3.storage";
import { useContract, useSigner } from "wagmi";
import { DETOK_ABI, DeTok_Contract_Address } from "../constants/constants";

function makeStorageClient() {
  return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN });
}

const storeContent = async (files) => {
  const client = makeStorageClient();
  const cid = await client.put(files);
  console.log("stored files with cid:", cid);
  // for what?
  setTimeout(3000);
  return cid;
};

const makeJsonFileObject = (json) => {
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
  return new File([blob], "metadata.json");
};

export default function MintVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [video, setVideo] = useState();
  const [payable, setPayable] = useState(false);

  const [loading, setLoading] = useState();
  const { data: signer, isError } = useSigner();

  const contract = useContract({
    address: DeTok_Contract_Address,
    abi: DETOK_ABI,
  });

  const onSubmit = async () => {
    if (!video) {
      return;
    }

    setLoading(true);
    console.log("uploading...");
    const jsonFile = makeJsonFileObject({ title, description, author });
    console.log(jsonFile);
    console.log(video);
    const cid = await storeContent([video, jsonFile]);
    console.log(cid);

    try {
      console.log("sending transaction...");
      const tx = await contract
        .connect(signer)
        .mintVideo(`https://${cid}.ipfs.w3s.link/`, cid, payable);
      // console.log(tx);
      const receipt = await tx.wait();
      console.log(receipt);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    // const videoFile = acceptedFiles[0];
    // const myVideoFile = new File([videoFile], "video.mp4", {
    //   type: videoFile.type,
    // });
    setVideo(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 5242880 * 2, //10MB
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
          <label className="w-full font-bold pt-2">
            Video
            {video ? (
              <div>
                <span className="pr-4">{video.name}</span>
                <button
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => setVideo(null)}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className="h-40 cursor-pointer border border-dashed border-white flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <input {...getInputProps()} />
                <div className="px-4">
                  {isDragActive
                    ? "Drop the files here ..."
                    : "Drag & drop some files here, or click to select files"}
                </div>
              </div>
            )}
          </label>
          <label className="w-full font-bold pt-6">
            <input
              type="checkbox"
              value={payable}
              className="w-4 h-4"
              onChange={() => {
                setPayable(!payable);
              }}
            />
            <span className="pl-2">Payable</span>
          </label>

          <div className="pt-6">
            <button
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              onClick={() => onSubmit()}
              disabled={loading}
            >
              {loading ? "Minting..." : "Mint Video"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
