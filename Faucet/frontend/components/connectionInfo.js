import { InfoRow } from "./infoRaw";

export default function Modal({
  onClose,
  chainId,
  accounts,
  LuLuCoinAddress,
  balance,
  FaucetAddress,
  faucetBalance,
  nextDripTime,
}) {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-40"
      onClick={onClose}
    >
      <div className="text-center bg-transparent p-6 rounded-md shadow-md border-8 border-white border-opacity-25 w-1/2">
        <h1 className="text-xl mb-8 font-bold bg-[#D6517D] rounded-md shadow-md px-8 py-3">
        Information
        </h1>
        <InfoRow label="Chain ID" value={chainId} />
        <InfoRow label="Current Account" value={accounts[0]} />
        <InfoRow label="LuLuCoin Token Address" value={LuLuCoinAddress} />
        <InfoRow label="LuLuCoin Token Balance" value={balance} />
        <InfoRow label="Faucet Token Address" value={FaucetAddress} />
        <InfoRow label="Faucet Token Balance" value={faucetBalance} />
        <InfoRow label="Next Collection Time" value={nextDripTime} />
      </div>
    </div>
  );
}
