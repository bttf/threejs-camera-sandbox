import clsx from "clsx";
import { Stick_No_Bills } from "next/font/google";
import Sandbox from "@/app/components/Sandbox";

const gFont = Stick_No_Bills({ subsets: ["latin"] });

const Header = () => (
  <>
    <div
      className={clsx(
        "text-4xl",
        "italic",
        "uppercase",
        "font-semibold",
        "text-gray-400",
        gFont.className
      )}
      style={{
        textShadow: "2px 2px 0 #ccc",
      }}
    >
      three.js camera sandbox
    </div>
    <div className="text-xs italic py-2 text-gray-500">
      Created by{" "}
      <a
        className="underline"
        href="https://adnan-chowdhury.com"
        target="_blank"
      >
        Adnan Chowdhury
      </a>
    </div>
  </>
);

export default function Home() {
  return (
    <div className="p-4">
      <Header />

      <Sandbox />

      <div className="text-xs py-2 text-gray-500">
        © {new Date().getFullYear()} Adnan Chowdhury
      </div>
    </div>
  );
}
