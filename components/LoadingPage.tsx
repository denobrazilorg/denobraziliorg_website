import React from "react";
import Head from "next/head";
import { metaDescription } from "../pages";

function LoadingPage() {
  return (
    <div>
      <Head>
        <title>Deno</title>
        {metaDescription({
          title: "Deno Brazil",
          description: "Deno, um runtime seguro para JavaScript e TypeScript.",
          image: "https://deno.land/v1_wide.jpg",
        })}
      </Head>
      <div className="bg-gray-50 min-h-full"></div>
    </div>
  );
}

export default LoadingPage;
