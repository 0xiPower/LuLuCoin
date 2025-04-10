import Link from "next/link";
import Image from "next/image";

import BiliBili from "@/public/assets/bilibili.png";
import Github from "@/public/assets/github.png";

export default function NavBar({ accounts, setAccounts }) {
  const isConnected = Boolean(accounts[0]);

  async function connectAccount() {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
      } else {
        console.error("Ethereum provider not found.");
      }
    } catch (error) {
      console.error("Failed to connect account:", error);
    }
  }

  async function disconnectAccount() {
    setAccounts();
  }
  return (
    <>
      <div className="flex justify-between items-center text-2xl px-8 py-6 font-wq text-white">
        <div className="flex">
          <Link
            href="https://space.bilibili.com/438705538"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center space-x-2">
              <Image src={BiliBili} alt="@0xPower_" width={36} height={36} />
              <span className="text-3xl px-4">@0xPower_</span>
            </div>
          </Link>

          <Link
            href="https://github.com/0xiPower/LuLuCoin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center space-x-2">
              <Image src={Github} alt="@0xiPower" width={36} height={36} />
              <span className="text-3xl px-4">@LuLuCoin</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-6 text-2xl">
          <Link
            href="mailto:sunk1ng@foxmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Author
          </Link>

          {isConnected ? (
            <p
              onClick={disconnectAccount}
              className="bg-pink-600 px-6 py-2 rounded-md shadow-lg hover:bg-pink-700 transition duration-300"
            >
              Disconnect
            </p>
          ) : (
            <button
              onClick={connectAccount}
              className="bg-pink-600 px-6 py-2 rounded-md shadow-lg hover:bg-pink-700 transition duration-300"
            >
              Connected
            </button>
          )}
        </div>
      </div>
    </>
  );
}
