import { useMemo, useState } from "react";
import {
  calculateBuy,
  calculateSell,
  formatNumber,
  hasMyanmarDigits,
  parseFlexibleNumber,
} from "./lib/goldMath";

type Mode = "buy" | "sell" | "guide";

const TABS: { id: Mode; label: string }[] = [
  { id: "buy", label: "ရွှေဝယ်မယ် (Buy)" },
  { id: "sell", label: "ရွှေပြန်ရောင်းမယ် (Sell)" },
  { id: "guide", label: "လမ်းညွှန်" },
];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[13px] font-medium text-slate-600">
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-[14px] text-slate-800 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
    />
  );
}

export default function App() {
  const [mode, setMode] = useState<Mode>("buy");

  // Buy mode fields
  const [mmkAmount, setMmkAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  // Sell mode fields
  const [sellKyat, setSellKyat] = useState("");
  const [sellPae, setSellPae] = useState("");
  const [sellYway, setSellYway] = useState("");
  const [sellPrice, setSellPrice] = useState("");

  const useMyanmarDigits = useMemo(() => {
    if (mode === "buy") {
      return hasMyanmarDigits(mmkAmount) || hasMyanmarDigits(buyPrice);
    }
    return (
      hasMyanmarDigits(sellKyat) ||
      hasMyanmarDigits(sellPae) ||
      hasMyanmarDigits(sellYway) ||
      hasMyanmarDigits(sellPrice)
    );
  }, [mode, mmkAmount, buyPrice, sellKyat, sellPae, sellYway, sellPrice]);

  const buyResult = useMemo(() => {
    const mmk = parseFlexibleNumber(mmkAmount);
    const price = parseFlexibleNumber(buyPrice);
    if (!mmkAmount || !buyPrice) return null;
    return calculateBuy(mmk, price);
  }, [mmkAmount, buyPrice]);

  const sellResult = useMemo(() => {
    const price = parseFlexibleNumber(sellPrice);
    if (!sellPrice) return null;
    const kyat = sellKyat ? parseFlexibleNumber(sellKyat) : 0;
    const pae = sellPae ? parseFlexibleNumber(sellPae) : 0;
    const yway = sellYway ? parseFlexibleNumber(sellYway) : 0;
    if (!sellKyat && !sellPae && !sellYway) return null;
    return calculateSell(kyat, pae, yway, price);
  }, [sellKyat, sellPae, sellYway, sellPrice]);

  const resultText = useMemo(() => {
    if (mode === "buy") {
      if (!buyResult) return "—";
      return `${formatNumber(buyResult.kyat, useMyanmarDigits, 0)} ကျပ်  ${formatNumber(
        buyResult.pae,
        useMyanmarDigits,
        0
      )} ပဲ  ${formatNumber(buyResult.yway, useMyanmarDigits, 2)} ရွှေး`;
    }
    if (sellResult === null) return "—";
    return `${formatNumber(sellResult, useMyanmarDigits, 0)} MMK`;
  }, [mode, buyResult, sellResult, useMyanmarDigits]);

  function handleReset() {
    setMmkAmount("");
    setBuyPrice("");
    setSellKyat("");
    setSellPae("");
    setSellYway("");
    setSellPrice("");
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased sm:bg-[#eceff2]">
      <div className="flex min-h-screen w-full flex-col sm:mx-auto sm:min-h-0 sm:max-w-2xl sm:py-10">
        <div className="flex min-h-screen w-full flex-col overflow-hidden bg-white sm:min-h-0 sm:rounded-xl sm:border sm:border-slate-200 sm:shadow-sm">
          {/* Navy header — extends under the phone status bar / notch via the safe-area inset */}
          <div className="bg-[#0f2744] pt-[max(1rem,env(safe-area-inset-top))] sm:pt-6">
            <div className="px-4 sm:px-7">
              <h1 className="text-xl font-bold text-white sm:text-[1.4rem]">Gold Calculator</h1>
              <p className="mt-0.5 text-[13px] text-slate-300">
                ရွှေဈေး တွက်စက် · Myanmar gold weight &amp; value converter
              </p>
            </div>

            {/* Tabs — full-width navy bar with white underline on the active tab */}
            <nav className="mt-5 flex overflow-x-auto border-b border-white/10">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMode(tab.id)}
                  className={`flex-shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition sm:px-5 ${
                    mode === tab.id
                      ? "border-white font-semibold text-white"
                      : "border-transparent font-medium text-slate-300 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Calculator body */}
          {mode !== "guide" && (
          <div className="flex flex-col px-4 py-6 sm:px-7 sm:py-7">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="text-2xl">🪙</span>
              <div>
                <div className="text-[15px] font-bold text-[#1a1a2e]">
                  {mode === "buy" ? "Buy Gold" : "Sell Gold"}
                </div>
                <div className="text-[12px] text-slate-500">
                  {mode === "buy"
                    ? "Find out how much gold your money can buy"
                    : "Find out how much your gold is worth"}
                </div>
              </div>
            </div>

            {mode === "buy" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <FieldLabel required>လက်ထဲရှိငွေ (MMK)</FieldLabel>
                  <TextInput value={mmkAmount} onChange={setMmkAmount} placeholder="e.g. 1,000,000" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel required>ရွှေပေါက်စျေး (MMK/ကျပ်သား)</FieldLabel>
                  <TextInput value={buyPrice} onChange={setBuyPrice} placeholder="e.g. 3,500,000" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>ကျပ် (Kyat)</FieldLabel>
                    <TextInput value={sellKyat} onChange={setSellKyat} placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>ပဲ (Pae)</FieldLabel>
                    <TextInput value={sellPae} onChange={setSellPae} placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>ရွှေး (Yway)</FieldLabel>
                    <TextInput value={sellYway} onChange={setSellYway} placeholder="0" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel required>ရွှေပေါက်စျေး (MMK/ကျပ်သား)</FieldLabel>
                  <TextInput value={sellPrice} onChange={setSellPrice} placeholder="e.g. 3,500,000" />
                </div>
              </div>
            )}

            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={handleReset}
                className="h-9 rounded-md border border-slate-300 bg-transparent px-5 text-[13px] font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>

            {/* Result */}
            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Result
              </div>
              <div
                className={`flex min-h-[52px] items-center rounded-md border px-4 text-[16px] font-semibold tracking-wide ${
                  (mode === "buy" ? buyResult !== null : sellResult !== null)
                    ? "border-slate-300 bg-[#eef0f4] text-[#1a1a2e]"
                    : "border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                {resultText}
              </div>
            </div>
          </div>
          )}

        {/* Guide card */}
        {mode === "guide" && (
        <div className="flex flex-col bg-white px-4 py-6 sm:px-7 sm:py-7">
          <div className="mb-1 text-[15px] font-bold text-[#1a1a2e]">How to use</div>

          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0083c1] to-[#005d8f] text-[11px] font-bold text-white">
                1
              </span>
              <p className="text-[13px] leading-relaxed text-slate-600">
                <strong className="text-[#1a1a2e]">Pick a mode.</strong> Use{" "}
                <strong className="text-[#1a1a2e]">ရွှေဝယ်မယ်</strong> to find how much gold your
                MMK can buy, or <strong className="text-[#1a1a2e]">ရွှေပြန်ရောင်းမယ်</strong> to
                value gold you already own.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0083c1] to-[#005d8f] text-[11px] font-bold text-white">
                2
              </span>
              <p className="text-[13px] leading-relaxed text-slate-600">
                <strong className="text-[#1a1a2e]">Enter values.</strong> For Buy: enter your MMK
                amount and the current gold price per ကျပ်သား. For Sell: enter ကျပ်, ပဲ, ရွှေး
                weight and the gold price.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0083c1] to-[#005d8f] text-[11px] font-bold text-white">
                3
              </span>
              <p className="text-[13px] leading-relaxed text-slate-600">
                <strong className="text-[#1a1a2e]">Read the result.</strong> Output updates live
                as you type. The result mirrors the digit style you enter (English or Myanmar
                numerals).
              </p>
            </div>
          </div>

          <hr className="my-4 border-slate-200" />

          <div className="text-[14px] font-bold text-[#1a1a2e]">Formula</div>
          <div className="mt-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-[12px] leading-loose text-[#1a1a2e]">
            Weight (Kyat) = MMK ÷ Gold Price
            <br />
            Value (MMK) = (Kyat + Pae/16 + Yway/128) × Gold Price
          </div>

          <div className="mt-4 text-[14px] font-bold text-[#1a1a2e]">Quick Example</div>
          <div className="mt-1.5 rounded-md border border-dashed border-slate-300 bg-slate-50/60 px-3 py-2.5 font-mono text-[12px] leading-loose text-slate-700">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Buy</span>
              <span>1,000,000 MMK @ 3,500,000</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Result</span>
              <span>0 ကျပ် 4 ပဲ 4.57 ရွှေး</span>
            </div>
            <div className="mt-1 flex justify-between gap-3 border-t border-dashed border-slate-300 pt-1">
              <span className="text-slate-500">Sell</span>
              <span>1 ကျပ် 2 ပဲ 3 ရွှေး @ 3,500,000</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Result</span>
              <span>3,718,750 MMK</span>
            </div>
          </div>

          <div className="mt-4 rounded-md bg-slate-50 px-3 py-2.5 text-[11.5px] text-slate-500">
            <strong className="text-slate-600">Unit reference:</strong> 1 Kyat (ကျပ်) = 16 Pae
            (ပဲ) &nbsp;·&nbsp; 1 Pae (ပဲ) = 8 Yway (ရွှေး) &nbsp;·&nbsp; 1 Kyat = 128 Yway
          </div>
        </div>
        )}
        </div>
      </div>
    </div>
  );
}
