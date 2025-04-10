import { ethers, BigNumber } from "ethers";
import { useState, useEffect } from "react";
import LuLuCoin from "../LuLuCoin.json";

export default function MintERC20({ accounts }) {
  const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [balance, setBalance] = useState(null);
  const [mintAmount, setMintAmount] = useState(1);

  const isConnected = Boolean(accounts[0]);

  // 铸造代币
  async function handleMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        ContractAddress,
        LuLuCoin.abi,
        signer
      );

      try {
        const mintAmountInETH = ethers.utils.parseEther(
          mintAmount.toString(),
          18
        );
        const response = await contract.mint(BigNumber.from(mintAmountInETH));
        console.log("Minting response", response);

        contract.on("Mint", async () => {
          fetchBalance();
        });
      } catch (error) {
        console.log("Error: ", error);
        // return "Error: ", error;
      }
    }
  }
  // 获取用户的代币余额
  async function fetchBalance() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        ContractAddress,
        LuLuCoin.abi,
        signer
      );
      
      try {
        const userBalance = await contract.balanceOf(accounts[0]);
        const formattedBalance = parseFloat(
          ethers.utils.formatUnits(userBalance, 18)
        ).toFixed(2);
        setBalance(formattedBalance);
      } catch (error) {
        console.log("error fetching balance", error);
      }
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchBalance();
      const intervalId = setInterval(fetchBalance, 1000);
      return () => clearInterval(intervalId);
    }
  }, [accounts, isConnected]);

  return (
    <>
      <div className="flex flex-col flex-grow justify-center items-center font-wq mb-12 mt-20 text-white">
        <div className="w-[640-px] text-center">
          <h1 className="text-6xl text-[#ff2c73]">Mint LuLuCoin</h1>
          {isConnected ? (
            <>
              <p className="text-4xl mt-20 mb-12 animate-pulse">
                Start minting your first LuLuCoin token!
              </p>
              <div className="flex justify-center mt-4">
                <input
                  value={mintAmount}
                  onChange={(e) => setMintAmount(Number(e.target.value))}
                  className="text-center w-80 h-10 mt-4 mb-4 text-pink-600 text-2xl"
                  type="number"
                  placeholder="Please enter the number of tokens you would like to mint..."
                  min="0"
                />
              </div>

              <div className="flex-col justify-center items-center mt-8">
                <button
                  onClick={handleMint}
                  className="bg-[#D6517D] rounded-md shadow-md text-2xl p-4 w-80"
                >
                  Cast now!
                </button>
                <p className="t text-[#ff2c73] text-xl animate-pulse mt-4">
                  {" "}
                  Current LuLuCoin token balance:{" "}
                  {balance !== null ? `${balance} LLC` : "loading..."}
                </p>
              </div>
            </>
          ) : (
            <div className="flex justify-center text-6xl items-center mt-48 mb-20">
              <p className="animate-pulse">
                Connect your wallet to start minting tokens...
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
