/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Link from "next/link";

const Footer = (props: { simple?: boolean }) => (
  <div
    className={props.simple ? undefined : "bg-gray-50 border-t border-gray-200"}
  >
    <div className="max-w-screen-xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
      <nav className="-mx-5 -my-2 flex flex-wrap justify-center">
        <div className="px-5 py-2">
          <Link href="/[identifier]" as="/manual">
            <a className="text-base leading-6 text-gray-500 hover:text-gray-900">
              Manual
            </a>
          </Link>
        </div>
        <div className="px-5 py-2">
          <a
            href="https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts"
            className="text-base leading-6 text-gray-500 hover:text-gray-900"
          >
            Runtime API
          </a>
        </div>
        <div className="px-5 py-2">
          <Link href="/[identifier]" as="/std">
            <a className="text-base leading-6 text-gray-500 hover:text-gray-900">
              Bibliotecas padrão
            </a>
          </Link>
        </div>
        <div className="px-5 py-2">
          <Link href="/x">
            <a className="text-base leading-6 text-gray-500 hover:text-gray-900">
              Módulos de Terceiros
            </a>
          </Link>
        </div>
      </nav>

    </div>
  </div>
);

export default Footer;
