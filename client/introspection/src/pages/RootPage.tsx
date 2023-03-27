import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import EditorBody from '../components/EditorBody';


export default function RootPage() {

  const heightOfTopBar = 60;
  const heightOfEditor = window.innerHeight - heightOfTopBar;


  return (
    <>
      <TopBar height={heightOfTopBar} />
      <EditorBody height={heightOfEditor} />
    </>
  );
}