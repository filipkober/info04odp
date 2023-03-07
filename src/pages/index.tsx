/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import type Pytanie from "../../models/Pytanie";
import { useTypewriter } from "react-simple-typewriter";
import { FaSearch } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { MdExtension } from "react-icons/md";
import QuestionCard from "~/components/QuestionCard";
import { type pytania } from "@prisma/client";
import Fuse from "fuse.js";
import Link from "next/link";

const Home: NextPage = () => {
  const [pytania, setPytania] = useState<Pytanie[]>([]);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [search, setSearch] = useState<string>("");
  const input = useRef<HTMLInputElement>(null);
  const [isFirefox, setIsFirefox] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsFirefox(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  }, [])

  const strings = [
    "Co można powiedzieć o metodach klasy Point?",
    "Przedstawiony zapis w języku Python prezentuje:",
    "Zadaniem interpretera jest:",
    "Cechami dobrego negocjatora są:",
    "Okna dialogowe niemodalne służą do",
  ].map((s) => s.substring(0, 35) + "...");
  const [text] = useTypewriter({
    words: strings,
    loop: false,
    delaySpeed: 150,
  });

  const fuse = new Fuse(pytania, {
    keys: ["tresc", "odpowiedz"],
    threshold: 0.3,
  });

  useEffect(() => {
    const getPytania = async () => {
      const res = await fetch("/api/questions");
      const pytania = (await res.json()) as pytania[];
      setPytania(pytania as Pytanie[]);
    };
    void getPytania();
    console.log("Autor: Filip Kober");
  }, []);

  let pytaniaDoWyswietlenia: Pytanie[] = [];
  if (search) {
    pytaniaDoWyswietlenia = [...new Set([...fuse.search(search).map(({ item }) => item), ...pytania.filter((pytanie) => pytanie.tresc.toLowerCase().includes(search.toLowerCase()))])]
  } else {
    pytaniaDoWyswietlenia = pytania;
  }

  return (
    <>
      <Head>
        <title>Odpowiedzi inf04</title>
        <meta name="description" content="super odpowiedzi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#0b0217] to-[#0f101d] overflow-visible">
        <h1 className="my-4 text-3xl md:text-5xl lg:text-7xl font-bold text-white">
          Odpowiedzi do testu inf04
        </h1>
       {(!isMobile && isFirefox) && <div>
        <Link href="/api/extension" className="w-[38px] h-[38px] border-2 border-white rounded-md absolute top-8 right-10 hidden md:inline-block" >
          <MdExtension className="text-6xl text-white hover:cursor-pointer w-full h-full" />
        </Link>
        </div>}
        <div className="relative my-20 h-16 w-3/4 lg:w-2/3">
          <div
            className={`duration-250 inset-0 z-0 -my-11 md:-my-16 h-2/3 md:h-full w-full bg-gradient-to-r from-pink-600 to-purple-900 transition ease-in-out ${
              isInputHovered ? "blur-xl hue-rotate-15" : "blur-lg"
            }`}
          ></div>
          <input
            type="text"
            className="absolute z-10 h-2/3 md:h-full w-full truncate rounded-md border-[1px] border-gray-300 bg-black px-3 text-xl md:text-3xl lg:text-4xl text-white shadow-inner focus:border-2 focus:border-white focus:outline-none"
            placeholder={text}
            onMouseEnter={() => setIsInputHovered(true)}
            onMouseLeave={() => setIsInputHovered(false)}
            onFocus={() => setIsInputHovered(false)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={input}
          />
          {!!search ? (
            <GiCancel
              className="relative z-20 ml-[90%] md:ml-[92%] lg:ml-[94%] h-full w-[8%] md:w-[5%] pb-5 md:pb-0 hover:cursor-pointer"
              onClick={() => {
                setSearch("")
                void input.current?.focus()
              }}
              color="crimson"
            />
          ) : (
            <FaSearch
              className="pointer-events-none relative z-20 ml-[90%] md:ml-[92%] lg:ml-[94%] h-full w-[8%] md:w-[5%] pb-5 md:pb-0"
              color="white"
            />
          )}
        </div>
        <div className="-my-32 md:-my-28 lg:-my-18 w-3/4 lg:w-2/3">
          {pytaniaDoWyswietlenia.map((pytanie) => {
            return <QuestionCard pytanie={pytanie} key={pytanie.id} />;
          })}
        </div>
        <footer className="w-full text-white pb-12 my-auto">
          <p className="text-right text-xl pr-6">Autor: Filip Kober</p>
        </footer>
      </main>
    </>
  );
};

export default Home;
