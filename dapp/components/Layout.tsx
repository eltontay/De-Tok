import React from "react";
// import styles from "../styles/Layout.module.css";
// import Footer from "./Footer";
// import video from "../assets/video.png";
// import Image from "next/image";
// import Link from "next/link";
import Footer from "./Footer";
import { Header } from "./Header";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
