import React, { useState, useEffect, useMemo, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter, Router } from "next/router";
import { parseNameVersion, findEntry } from "../util/registry_utils";
import {
  TableOfContents,
  getTableOfContents,
  getFileURL,
  getDocURL,
} from "../util/manual_utils";
import Markdown from "./Markdown";
import Transition from "./Transition";
import { metaDescription } from "../pages";

const denoEntry = findEntry("deno");

function Manual() {
  const { query, push, replace } = useRouter();
  const { version, path } = useMemo(() => {
    const path =
      (Array.isArray(query.path) ? query.path.join("/") : query.path) ?? "";
    const [name, version] = parseNameVersion(
      (Array.isArray(query.identifier)
        ? query.identifier[0]
        : query.identifier) ?? ""
    );
    return {
      name,
      version,
      path: path ? `/${path}` : "/introduction",
    };
  }, [query]);

  if (path.endsWith(".md")) {
    replace(
      `/[identifier]${path ? "/[...path]" : ""}`,
      `/manual${version && version !== "" ? `@${version}` : ""}${path.replace(
        /\.md$/,
        ""
      )}`
    );
    return <></>;
  }

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const hideSidebar = () => setShowSidebar(false);

  const manualEl = useRef<HTMLElement>(null);

  const handleRouteChange = (url: string) => {
    manualEl.current?.scrollTo(0, 0);
    setPageIndex(pageList.findIndex((page) => page.path === url));
  };

  useEffect(() => {
    Router.events.on("routeChangeStart", hideSidebar);
    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeStart", hideSidebar);
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  });

  const scrollTOCIntoView = () =>
    document.getElementsByClassName("toc-active")[0]?.scrollIntoView();

  useEffect(() => {
    if (showSidebar) {
      scrollTOCIntoView();
    }
  }, [showSidebar]);

  const [
    tableOfContents,
    setTableOfContents,
  ] = useState<TableOfContents | null>(null);

  const [content, setContent] = useState<string | null>(null);
  const [versions, setVersions] = useState<string[] | null | undefined>();

  const partialContent = useMemo(
    () => content?.split(" ").slice(0, 20).join(""),
    [content]
  );

  useEffect(() => {
    getTableOfContents(version ?? "master")
      .then(setTableOfContents)
      .then(scrollTOCIntoView)
      .catch((e) => {
        console.error("Failed to fetch table of contents:", e);
        setTableOfContents(null);
      });
  }, [version]);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageList, setPageList] = useState<
    Array<{ path: string; name: string }>
  >([]);

  useEffect(() => {
    if (tableOfContents) {
      const tempList: Array<{ path: string; name: string }> = [];

      Object.entries(tableOfContents).map(([slug, entry]) => {
        tempList.push({ path: `/manual/${slug}`, name: entry.name });

        if (entry.children) {
          Object.entries(entry.children).map(([childSlug, name]) =>
            tempList.push({ path: `/manual/${slug}/${childSlug}`, name })
          );
        }
      });

      setPageList(tempList);
      setPageIndex(
        tempList.findIndex((page) => page.path === `/manual${path}`)
      );
    }
  }, [tableOfContents]);

  const sourceURL = useMemo(() => getFileURL(version ?? "master", path), [
    version,
    path,
  ]);

  useEffect(() => {
    setContent(null);
    fetch(sourceURL)
      .then((res) => {
        if (res.status !== 200) {
          throw Error(
            `Got an error (${res.status}) while getting the documentation file.`
          );
        }
        return res.text();
      })
      .then(setContent)
      .catch((e) => {
        console.error("Failed to fetch content:", e);
        setContent(
          "# 404 - Not Found\nWhoops, the page does not seem to exist."
        );
      });
  }, [sourceURL]);

  useEffect(() => {
    setVersions(undefined);
    denoEntry
      ?.getVersionList()
      .then((v) =>
        // do not show old versions that do not have the new manual yet
        setVersions(v?.filter((v) => v.startsWith("v1") && v !== "v1.0.0-rc1"))
      )
      .catch((e) => {
        console.error("Failed to fetch versions:", e);
        setVersions(null);
      });
  }, []);

  function gotoVersion(newVersion: string) {
    push(
      `/[identifier]${path ? "/[...path]" : ""}`,
      `/manual${newVersion !== "" ? `@${newVersion}` : ""}${path}`
    );
  }

  return (
    <div>
      <Head>
        <title>The Deno Manual</title>
        {metaDescription({
          title: "The Deno Manual",
          description: partialContent || "The Deno Manual",
          url: "https://deno.land/manual",
          image: "https://deno.land/v1_wide.jpg",
        })}
      </Head>
      <div className="h-screen flex overflow-hidden">
        <Transition show={showSidebar}>
          <div className="md:hidden">
            <div className="fixed inset-0 flex z-40">
              <Transition
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0">
                  <div
                    className="absolute inset-0 bg-gray-600 opacity-75"
                    onClick={hideSidebar}
                  ></div>
                </div>
              </Transition>
              <Transition
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                  <div className="absolute top-0 right-0 -mr-14 p-1">
                    <button
                      role="button"
                      className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600"
                      aria-label="Close sidebar"
                      onClick={hideSidebar}
                    >
                      <svg
                        className="h-6 w-6 text-white"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-gray-100 pb-4 pt-4 border-b border-gray-200">
                    <Link href="/">
                      <a className="block flex items-center flex-shrink-0 px-4">
                        <img
                          src="/logo.svg"
                          alt="logo"
                          className="w-auto h-12"
                        />
                        <div className="mx-4 flex flex-col justify-center">
                          <div className="font-bold text-gray-900 leading-6 text-2xl tracking-tight">
                            Deno Manual
                          </div>
                        </div>
                      </a>
                    </Link>
                    <Version
                      version={version}
                      versions={versions}
                      gotoVersion={gotoVersion}
                    />
                  </div>
                  {tableOfContents && (
                    <ToC
                      tableOfContents={tableOfContents}
                      version={version}
                      path={path}
                    />
                  )}
                </div>
              </Transition>
              <div className="flex-shrink-0 w-14">
                {/*<!-- Dummy element to force sidebar to shrink to fit close icon -->*/}
              </div>
            </div>
          </div>
        </Transition>

        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-72 border-r border-gray-200 bg-gray-50">
            <div className="bg-gray-100 pb-4 pt-4 border-b border-gray-200">
              <Link href="/">
                <a className="block flex items-center flex-shrink-0 px-4">
                  <img src="/logo.svg" alt="logo" className="w-auto h-12" />
                  <div className="mx-4 flex flex-col justify-center">
                    <div className="font-bold text-gray-900 leading-6 text-2xl tracking-tight">
                      Deno Manual
                    </div>
                  </div>
                </a>
              </Link>
              <Version
                version={version}
                versions={versions}
                gotoVersion={gotoVersion}
              />
            </div>
            {tableOfContents && (
              <ToC
                tableOfContents={tableOfContents}
                version={version}
                path={path}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
            <Link href="/">
              <a className="px-4 flex items-center justify-center md:hidden">
                <img src="/logo.svg" alt="logo" className="w-auto h-10" />
              </a>
            </Link>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">
              </div>
            </div>
            <button
              className="px-4 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden"
              aria-label="Open sidebar"
              onClick={() => setShowSidebar(true)}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>
          </div>

          <main
            className="flex-1 relative z-0 overflow-y-auto focus:outline-none"
            tabIndex={0}
            ref={manualEl}
          >
            <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-20">
              {content ? (
                <>
                  <Markdown
                    source={content}
                    displayURL={location.origin + "/manual" + path}
                    sourceURL={sourceURL}
                  />
                  <div className="pt-4 border-t border-gray-200">
                    {pageIndex !== 0 && (
                      <Link
                        href="/[identifier]/[...path]"
                        as={pageList[pageIndex - 1].path}
                      >
                        <a className="text-gray-900 hover:text-gray-600 font-normal">
                          ← {pageList[pageIndex - 1].name}
                        </a>
                      </Link>
                    )}
                    {pageIndex !== pageList.length - 1 && (
                      <Link
                        href="/[identifier]/[...path]"
                        as={pageList[pageIndex + 1].path}
                      >
                        <a className="text-gray-900 hover:text-gray-600 font-normal float-right">
                          {pageList[pageIndex + 1].name} →
                        </a>
                      </Link>
                    )}
                  </div>
                  <div className="pt-2 clear-both">
                    <a
                      className="text-gray-500 hover:text-gray-400 font-normal float-right"
                      href={getDocURL(version ?? "master", path)}
                    >
                      View on GitHub
                    </a>
                  </div>
                </>
              ) : (
                <div className="w-full my-8">
                  <div className="w-4/5 sm:w-1/3 bg-gray-100 h-8"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-10"></div>
                  <div className="w-5/6 sm:w-3/4 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-3/4 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-2/4 sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-10"></div>
                  <div className="sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-5/6 sm:w-3/4 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-3/4 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-2/4 sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-3/4 bg-gray-100 h-3 mt-10"></div>
                  <div className="sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-5/6 sm:w-3/4 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-2/4 sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-4"></div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Version({
  version,
  versions,
  gotoVersion,
}: {
  version: string | undefined;
  versions: string[] | null | undefined;
  gotoVersion: (version: string) => void;
}) {
  return (
    <div className="mt-5 px-4">
      <label htmlFor="version" className="sr-only">
        Version
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <div className="max-w-xs rounded-md shadow-sm">
          <select
            id="version"
            className="block form-select w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            value={version}
            onChange={({ target: { value: newVersion } }) =>
              gotoVersion(newVersion)
            }
          >
            {versions && version && !versions.includes(version) && (
              <option key={version} value={version}>
                {version}
              </option>
            )}
            <option key="" value="">
              master
            </option>
            {versions &&
              versions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function ToC({
  tableOfContents,
  version,
  path,
}: {
  tableOfContents: TableOfContents;
  version: string | undefined;
  path: string;
}) {
  return (
    <div className="pt-2 pb-8 h-0 flex-1 flex flex-col overflow-y-auto">
      <nav className="flex-1 px-2 px-4">
        <ol className="pl-2 list-decimal list-inside font-semibold nested">
          {tableOfContents &&
            Object.entries(tableOfContents).map(([slug, entry]) => {
              return (
                <li key={slug} className="my-2">
                  <Link
                    href="/[identifier]/[...path]"
                    as={`/manual${version ? `@${version}` : ""}/${slug}`}
                  >
                    <a
                      className={`${
                        path === `/${slug}`
                          ? "text-blue-600 hover:text-blue-500 toc-active"
                          : "text-gray-900 hover:text-gray-600"
                      } font-bold`}
                    >
                      {entry.name}
                    </a>
                  </Link>
                  {entry.children && (
                    <ol className="pl-4 list-decimal nested">
                      {Object.entries(entry.children).map(
                        ([childSlug, name]) => (
                          <li key={`${slug}/${childSlug}`} className="my-0.5">
                            <Link
                              href="/[identifier]/[...path]"
                              as={`/manual${
                                version ? `@${version}` : ""
                              }/${slug}/${childSlug}`}
                            >
                              <a
                                className={`${
                                  path === `/${slug}/${childSlug}`
                                    ? "text-blue-600 hover:text-blue-500 toc-active"
                                    : "text-gray-900 hover:text-gray-600"
                                } font-normal`}
                              >
                                {name}
                              </a>
                            </Link>
                          </li>
                        )
                      )}
                    </ol>
                  )}
                </li>
              );
            })}
        </ol>
      </nav>
    </div>
  );
}

export default Manual;
