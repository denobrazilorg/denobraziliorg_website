/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import CodeBlock from "../components/CodeBlock";
import Footer from "../components/Footer";
import { entries } from "../util/registry_utils";
import stdVersions from "../deno_std_versions.json";
import { NextPage, GetStaticProps } from "next";
import InlineCode from "../components/InlineCode";
import Header from "../components/Header";

interface SimpleEntry {
  name: string;
  desc: string;
}
interface HomeProps {
  thirdPartyEntries: SimpleEntry[];
  latestStd: string;
}

export const metaDescription = ({
  title,
  description,
  image,
  url = "https://denobrazil.org/",
}: {
  title: string;
  description: string;
  url?: string;
  image: string;
}) => [
  <meta name="title" key="title" content={title} />,
  <meta name="description" key="description" content={description} />,
  <meta name="twitter:card" key="twitter:card" content="summary_large_image" />,
  <meta property="og:type" key="og:type" content="website" />,
  <meta property="og:url" key="og:url" content={url} />,
  <meta property="og:title" key="og:title" content={title} />,
  <meta property="og:description" key="og:description" content={description} />,
  <meta property="og:image" key="og:image" content={image} />,
];

const NUM_THIRD_PARTY = 12;

const Home: NextPage<HomeProps> = ({ thirdPartyEntries, latestStd }) => {
  const complexExampleProgram = `import { serve } from "https://deno.land/std@${latestStd}/http/server.ts";
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: "Hello World\\n" });
}`;

  const [thirdPartySelection, setThirdPartySelection] = useState<
    SimpleEntry[] | null
  >(null);
  useEffect(() => {
    const thirdPartySelection = [];
    for (let i = 0; i < NUM_THIRD_PARTY; i++) {
      const s = Math.floor(thirdPartyEntries.length * Math.random());
      thirdPartySelection.push(thirdPartyEntries[s]);
      thirdPartyEntries.splice(s, 1);
    }
    setThirdPartySelection(thirdPartySelection);
  }, []);

  return (
    <>
      <Head>
        <title>Deno Brazil Community</title>
        {metaDescription({
          title: "Deno — Um runtime seguro para JavaScript e TypeScript.",
          description:
            "Deno é um runtime simples, moderno e seguro para JavaScript e TypeScript que usa V8 e é construído em Rust.",
          image: "https://deno.land/v1_wide.jpg",
        })}
      </Head>
      <div className="bg-white">
        <div className="bg-black">
          <div className="max-w-screen-xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div className="pr-16 sm:text-center sm:px-16">
              <p className="font-medium text-white">
                <span>Deno 1.0 foi lançado!</span>
                <span className="block sm:ml-2 sm:inline-block">
                  <Link href="/v1">
                    <a className="text-white font-bold underline">
                      Leia o post! &rarr;
                    </a>
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border-b border-gray-200">
          <Header />
          <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center">
            <h1 className="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              Deno Brazil Community
            </h1>
            <h2 className="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              Comunidade <strong className="font-semibold">Brasileira</strong> de Deno!
            </h2>
          </div>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <p className="my-4 text-gray-700">
          Deno é um runtime simples, moderno e seguro para JavaScript e TypeScript que usa V8 e é construído em Rust.
          </p>
          <ol className="ml-8 list-disc text-gray-700">
            <li>
            Seguro por padrão. Nenhum acesso a arquivos, redes ou ambientes, a menos que seja explicitamente ativado.
            </li>
            <li>Suporta TypeScript</li>
            <li>Um único arquivo executável.</li>
            <li>
            Possui utilitários embutidos, como um inspetor de dependências (deno info) e um formatador de código (deno fmt).
            </li>
            <li>
            Possui um conjunto de módulos padrão revisados ​​e auditados:{" "}
              <a href="https://deno.land/std" className="link">
                deno.land/std
              </a>
            </li>
          </ol>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#installation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="installation">
                Instalação
              </h3>
            </a>
          </Link>
          <InstallSection />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#getting-started">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="getting-started">
                Começando
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">Executando o seu primeiro DenoScript:</p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p className="my-4 text-gray-700">Ou escreva um:</p>
        </div>
        <div
          className="mx-auto px-4 sm:px-6 md:px-8"
          style={{ maxWidth: "46rem" }}
        >
          <CodeBlock
            code={complexExampleProgram}
            language="typescript"
            disablePrefixes
          />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <p className="my-4 text-gray-700">
          Você pode encontrar uma introdução mais aprofundada, exemplos e guias de configuração do ambiente em{" "}
            <Link href="/[identifier]" as="/manual">
              <a className="link">Tutoriais</a>
            </Link>
            .
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#runtime-documentation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="runtime-documentation">
                Documentação do Runtime
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
           A documentação básica do Runtime Deno pode ser encontrada em{" "}
            <a
              href="https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts"
              className="link"
            >
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
          Deno vem com{" "}
            <Link href="/[identifier]" as="/manual">
              <a className="link">um manual</a>
            </Link>{" "}
            que contém explicações mais detalhadas sobre os mais complexos funções do Runtime, uma introdução aos conceitos que Deno é construído sobre, detalhes sobre o interior do Deno, como incorporar o Deno em seu próprio aplicativo e como estender o Deno usando plugins Rust.
          </p>
          <p className="my-4 text-gray-700">
          O manual também contém informações sobre as ferramentas internas fornecidas pela Deno.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#standard-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="standard-modules">
              Módulos padrão
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
          Junto ao Runtime do Deno, o Deno também fornece uma lista de módulos padrão auditados que são revisados ​​pela equipe principal do Deno e garantidos para trabalhar com uma versão específica do Deno. Eles vivem ao lado do código-fonte Deno no{" "}
            <a href="https://github.com/denoland/deno" className="link">
              denoland/deno
            </a>{" "}
            
          </p>
          <p className="my-4 text-gray-700">
            Os modulos são hospedados em{" "}
            <Link href="/[identifier]" as="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            e são distribuídos por URLs como todos os outros módulos ES compatíveis com o Deno.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#third-party-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="third-party-modules">
              Módulos de Terceiros
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            O Deno pode importar módulos de qualquer local na web, como o GitHub, um servidor da web pessoal ou uma CDN como{" "}
            <a href="https://pika.dev" className="link">
              pika.dev
            </a>{" "}
            or{" "}
            <a href="https://jspm.io" className="link">
              jspm.io
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
          Para facilitar o consumo de módulos de terceiros, o Deno fornece ferramentas integradas, como <InlineCode>deno info</InlineCode> and{" "}
            <InlineCode>deno doc</InlineCode>. O deno.land também fornece uma interface da web
para visualizar a documentação do módulo. Está disponível em{" "}
            <a href="https://doc.deno.land" className="link">
              doc.deno.land
            </a>
            .
          </p>


        </div>
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          {thirdPartySelection?.map((s, i) => (
            <Link href="/x/[identifier]" as={`/x/${s.name}`}>
              <a
                className="rounded-lg bg-white shadow border border-gray-100 p-4 overflow-hidden hover:shadow-sm transition duration-75 ease-in-out cursor-pointer  "
                key={i}
              >
                <h4 className="text-lg font-bold">{s.name}</h4>
                <p
                  className="whitespace-normal break-words text-gray-700 mt-2"
                  style={{ textOverflow: "ellipsis" }}
                >
                  {s.desc}
                </p>
              </a>
            </Link>
          ))}
        </div>
        <div className="mt-20">
          <Footer simple />
        </div>
      </div>
    </>
  );
};

const InstallSection = () => {
  const shell = (
    <div key="shell" className="my-4 text-gray-700">
      <p className="py-2">Shell (Mac e Linux):</p>
      <CodeBlock
        language="bash"
        code={`curl -fsSL https://deno.land/x/install/install.sh | sh`}
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://formulae.brew.sh/formula/deno" className="link">
          Homebrew
        </a>{" "}
        (Mac):
      </p>
      <CodeBlock language="bash" code={`brew install deno`} />
    </div>
  );
  const powershell = (
    <div key="powershell" className="my-4 text-gray-700">
      <p className="mb-2">PowerShell (Windows):</p>
      <CodeBlock
        language="bash"
        code={`iwr https://deno.land/x/install/install.ps1 -useb | iex`}
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://chocolatey.org/packages/deno" className="link">
          Chocolatey
        </a>{" "}
        (Windows):
      </p>
      <CodeBlock language="bash" code={`choco install deno`} />
    </div>
  );
  const scoop = (
    <div key="scoop" className="my-4 text-gray-700">
      <p className="mb-2">Scoop (Windows):</p>
      <CodeBlock language="bash" code={`scoop install deno`} />
    </div>
  );
  const cargo = (
    <div key="cargo" className="my-4 text-gray-700">
      <p className="py-2">
      Crie e instale a partir da fonte usando{" "}
        <a href="https://crates.io/crates/deno" className="link">
          Cargo
        </a>
      </p>
      <CodeBlock language="bash" code={`cargo install deno`} />
    </div>
  );

  return (
    <>
      <p className="my-4 text-gray-700">
      O Deno é enviado como um único executável sem dependências. Você pode instalá-lo usando os instaladores abaixo ou fazer o download de um binário de versão do{" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
          releases page
        </a>
        .
      </p>
      {shell}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
      <p className="my-4 text-gray-700">
        Veja{" "}
        <a className="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        Para mais opções.
      </p>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const thirdPartyEntries: SimpleEntry[] = [];

  Object.keys(entries).forEach((name) => {
    const entry = entries[name];
    if (
      entry &&
      entry.desc.length >= 70 &&
      entry.desc.length <= 90 &&
      name !== "std" &&
      name !== "std_old"
    ) {
      thirdPartyEntries.push({
        name,
        desc: entry.desc,
      });
    }
  });

  return {
    props: { thirdPartyEntries, latestStd: stdVersions[0] },
  };
};

export default Home;
