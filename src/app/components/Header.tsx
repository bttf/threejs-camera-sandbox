import clsx from "clsx";
import { Stick_No_Bills } from "next/font/google";

const gFont = Stick_No_Bills({ subsets: ["latin"] });

const Header = () => (
  <div className="p-4 md:px-0">
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
    <div className="text-xs py-2 text-gray-500">
      Created by{" "}
      <a
        className="underline"
        href="https://adnan-chowdhury.com"
        target="_blank"
      >
        Adnan Chowdhury
      </a>
    </div>
  </div>
);

export default Header;
