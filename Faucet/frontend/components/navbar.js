import Link from "next/link";
import Image from "next/image";
import Bilibili from "@/public/assets/bilibili.png";
import GitHub from "@/public/assets/github.png";
import LLCFaucet from "../LLCFaucet.json";
import { useState, useEffect } from "react";
import { useContractContext } from "./context";
import { ethers } from "ethers";
import { ManagementRow } from "./managementRow";

export default function Navbar() {
  const {
    accounts,
    setAccounts,
    LuLuCoinAddress,
    FaucetAddress,
    setLuLuCoinAddress,
    setFaucetAddress,
    dripInterval,
    setDripInterval,
    dripLimit,
    setDripLimit,
  } = useContractContext();
  const isConnected = Boolean(accounts[0]);

  const [showManagementTable, setShowManagementTable] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editingField, setEditingField] = useState("");

  const closeManagementTable = () => {
    setShowManagementTable(false);
  };

  const openModal = (field) => {
    setEditingField(field);
    setInputValue("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      switch (editingField) {
        case "dripInterval":
          if (!isNaN(inputValue)) await handleDripInterval(inputValue);
          break;
        case "FaucetAddress":
          setFaucetAddress(inputValue);
          console.log("FaucetAddress updated to:", inputValue);
          break;
        case "LuLuCoinAddress":
          setLuLuCoinAddress(inputValue);
          break;
        case "dripLimit":
          if (!isNaN(inputValue)) await handleDripLimit(inputValue);
          break;
        default:
          console.error("Invalid editing field");
      }
    } catch (error) {
      console.error("Error saving value:", error);
    } finally {
      closeModal();
    }
  };

  // 连接钱包
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
      console.error("Failed to connect to accounts:", error);
    }
  }

  async function handleDripInterval(newInterval) {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucetContract = new ethers.Contract(
        FaucetAddress,
        LLCFaucet.abi,
        signer
      );
      try {
        const response = await faucetContract.setDripInterval(
          BigInt(newInterval)
        );
        console.log("Drip interval updated", response);
        await fetchDripInterval();
      } catch (err) {
        console.log("Error updating drip interval", err);
      }
    }
  }

  async function handleDripLimit(newLimit) {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucetContract = new ethers.Contract(
        FaucetAddress,
        LLCFaucet.abi,
        signer
      );
      try {
        const response = await faucetContract.setDripLimit(
          BigInt(newLimit * 1e18)
        );
        console.log("Drip interval updated", response);
        fetchDripLimit();
      } catch (err) {
        console.log("Error updating drip interval", err);
      }
    }
  }

  async function fetchDripInterval() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const faucetContract = new ethers.Contract(
      FaucetAddress,
      LLCFaucet.abi,
      signer
    );
    const dripLimit = await faucetContract.getDripLimit();
    setDripLimit(dripLimit);
  }

  async function fetchDripLimit() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const faucetContract = new ethers.Contract(
      FaucetAddress,
      LLCFaucet.abi,
      signer
    );
    const dripInterval = await faucetContract.getDripInterval();
    setDripInterval(dripInterval);
  }

  // 断开连接
  function disconnectAccount() {
    // 清空已连接的账户
    setAccounts([]);
    console.log("Disconnected from wallet.");
  }

  useEffect(() => {
    fetchDripInterval();
    fetchDripLimit();
  });

  useEffect(() => {
    console.log("FaucetAddress has been updated to:", FaucetAddress);
  }, [FaucetAddress]);

  useEffect(() => {
    const storedLuLuCoinAddress = localStorage.getItem("LuLuCoinAddress");
    const storedFaucetAddress = localStorage.getItem("FaucetAddress");

    if (storedLuLuCoinAddress) {
      setLuLuCoinAddress(storedLuLuCoinAddress);
    }
    if (storedFaucetAddress) {
      setFaucetAddress(storedFaucetAddress);
    }
  }, [setFaucetAddress, setLuLuCoinAddress]);

  useEffect(() => {
    if (LuLuCoinAddress) {
      localStorage.setItem("LuLuCoinAddress", LuLuCoinAddress);
    }
    if (FaucetAddress) {
      localStorage.setItem("FaucetAddress", FaucetAddress);
    }
  }, [LuLuCoinAddress, FaucetAddress]);
  return (
    <div className="flex justify-between items-center text-2xl px-8 py-6 font-wq text-white">
      {/* 左侧 - 社交媒体图标 */}
      <div className="flex">
        <Link
          href="https://space.bilibili.com/438705538"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center space-x-2">
            <Image src={Bilibili} alt="@0xPower_" width={36} height={36} />
            <span className="font-wq text-3xl px-4 text-white">@0xPower_</span>
          </div>
        </Link>
        <Link
          href="https://github.com/0xiPower/LuLuCoin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center px-4 space-x-2">
            <Image src={GitHub} alt="@LuLuCoin" width={36} height={36} />
            <span className="font-wq text-3xl px-2 text-white">@LuLuCoin</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-6 text-2xl">
        {isConnected && (
          <p
            className="cursor-pointer"
            onClick={() => {
              setShowManagementTable(true);
            }}
          >
            Management
          </p>
        )}
        {isConnected ? (
          <div className="flex items-center space-x-4">
            <button
              className="bg-pink-600 text-white px-6 py-2 rounded-md shadow-lg hover:bg-pink-700 transition duration-300"
              onClick={disconnectAccount}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            className="bg-pink-600 text-white px-6 py-2 rounded-md shadow-lg hover:bg-pink-700 transition duration-300"
            onClick={connectAccount}
          >
            Connected
          </button>
        )}
      </div>

      {showManagementTable && isConnected && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-40"
          onClick={closeManagementTable}
        >
          <div className="text-center bg-transparent p-6 rounded-md shadow-md border-8 border-white border-opacity-25 w-1/2">
            <h1 className="text-xl mb-8 font-bold bg-[#D6517D] rounded-md shadow-md px-8 py-3">
              Information
            </h1>
            <ManagementRow label="Current Account" value={accounts[0]} />
            <ManagementRow
              label="LuLuCoin Token Address"
              value={LuLuCoinAddress}
              onEdit={() => openModal("LuLuCoinAddress")}
            />
            <ManagementRow
              label="Faucet Token Address"
              value={FaucetAddress}
              onEdit={() => openModal("FaucetAddress")}
            />
            <ManagementRow
              label="Collection interval"
              value={dripInterval}
              onEdit={() => openModal("dripInterval")}
            />
            <ManagementRow
              label="Maximum single claim"
              value={parseFloat(ethers.formatUnits(dripLimit, 18))}
              onEdit={() => openModal("dripLimit")}
            />
          </div>
        </div>
      )}

      {/* 模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3 text-center">
            <h2 className="text-2xl mb-4">Change {editingField}</h2>
            <input
              className="w-full border text-[#ff2c73] px-3 py-2 rounded-md mb-4"
              type="text"
              placeholder={`Please enter new ${editingField}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
