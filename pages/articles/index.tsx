/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useMemo } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { entries } from "../../util/registry_utils";
import InlineCode from "../../components/InlineCode";
import { metaDescription } from "..";

import Head from "next/head";

const ThirdPartyRegistryList = () => {
  const [query, setQuery] = React.useState("");

  const list = useMemo(
    () =>
      Object.keys(entries)
        .filter(
          (name) =>
            name.toLowerCase().includes(query.toLowerCase()) ||
            (entries[name].desc ?? "")
              .toLowerCase()
              .includes(query.toLowerCase())
        )
        .sort((nameA, nameB) => nameA.localeCompare(nameB)),
    [entries, query]
  );

  return (
    <>
      <Head>
        <title>Artigos</title>

        {metaDescription({
          title: "Deno Third Party Modules",
          description: "Third Party Modules for Deno.",
          url: "https://deno.land/x",
          image: "https://deno.land/v1_wide.jpg",
        })}
      </Head>
      <div className="bg-gray-50 min-h-full">
        <Header subtitle="Artigos em português" />
        <div className="">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 pt-4">
            <div className="text-gray-900 mt-4 sm:mt-8 break-words">
              <p>
                <span className="font-semibold">denobrazil.org/articles</span> é um database de artigos em português sobre Deno!
            
              </p>

              <p className="text-gray-900 mt-4">
                Para adicionar artigos nessa lista, edite o arquivo{" "}
                <a
                  href="https://github.com/denoland/deno_website2/blob/master/database.json"
                  className="link"
                >
                  database.json
                </a>
                .
              </p>
            </div>
            <div className="mt-12">
              <label htmlFor="query" className="font-medium sr-only">
                Pesquisar
              </label>
              <input
                id="query"
                className="block w-full px-4 py-2 leading-normal bg-white border border-gray-200 rounded-lg outline-none shadow hover:shadow-sm focus:shadow-sm appearance-none focus:border-gray-300 hover:border-gray-300 mt-1"
                type="text"
                placeholder="Pesquisar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:max-w-screen-lg sm:mx-auto sm:px-6 md:px-8 pb-4 sm:pb-12">
            {list.length == 0 ? (
              <div className="px-4 sm:px-0 py-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500 truncate">
                Não encontramos nenhum artigo :(
              </div>
            ) : (
              <div className="bg-white sm:shadow border border-gray-200 overflow-hidden sm:rounded-md mt-4">
                <ul>
                  {list.map((name, i) => {
                    const link = `/x/${name}`;
                    return (
                      <li
                        className={i !== 0 ? "border-t border-gray-200" : ""}
                        key={i}
                      >
                        <Link href="/x/[identifier]" as={link}>
                          <a className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                            <div className="flex items-center px-4 sm:px-6 py-2">
                              <div className="min-w-0 flex-1 flex items-center">
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm leading-5 font-medium text-blue-500 truncate">
                                    {name}
                                  </div>
                                  {entries[name]?.desc && (
                                    <div className="mt-1 flex items-center text-sm leading-5 text-gray-500">
                                      <span className="truncate">
                                        {entries[name]?.desc ?? ""}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <svg
                                  className="h-5 w-5 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
        <Footer simple />
      </div>
    </>
  );
};

export default ThirdPartyRegistryList;
