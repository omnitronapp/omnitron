import React from "react";
import { BarLoader } from "react-spinners";

export function LoadingScreen() {
  return (
    <div id="loading-screen">
      <BarLoader height={5} width={150} color="#3696ff" />
    </div>
  );
}
