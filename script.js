// Helper
function $(id) { return document.getElementById(id); }

// Convert Myanmar digits to English
function mmToEn(numStr) {
  const mmDigits = "၀၁၂၃၄၅၆၇၈၉";
  const enDigits = "0123456789";
  return numStr.replace(/[၀-၉]/g, ch => enDigits[mmDigits.indexOf(ch)]);
}

// Convert English digits to Myanmar
function enToMm(numStr) {
  const mmDigits = "၀၁၂၃၄၅၆၇၈၉";
  const enDigits = "0123456789";
  return numStr.replace(/[0-9]/g, ch => mmDigits[enDigits.indexOf(ch)]);
}

// Detect if user typed Myanmar digits
function isMyanmarInput(str) {
  return /[၀-၉]/.test(str);
}

// Get numeric value regardless of language
function getNumericValue(id) {
  const val = $(id).value.trim();
  if (val === "") return 0;
  const clean = mmToEn(val.replace(/,/g, ""));
  return parseFloat(clean) || 0;
}

let outputInMyanmar = false;

// Detect language style from input
function detectLanguage() {
  const allInputs = [$("input1"), $("input2"), $("input3"), $("priceInput")];
  outputInMyanmar = allInputs.some(el => isMyanmarInput(el.value));
}

// Update mode UI
function updateMode() {
  const mode = $("mode").value;
  const result = $("result");
  const isMoneyToWeight = mode === "ဝယ်မယ်";

  if (isMoneyToWeight) {
    $("label1").textContent = "လက်ထဲရှိငွေ (MMK):";
    $("label2").textContent = "ရွှေပေါက်စျေး (MMK) (တစ်ကျပ်သား):";
    $("group3").style.display = "none";
    $("priceGroup").style.display = "none";
  } else {
    $("label1").textContent = "ကျပ် (Kyat) ပမာဏ:";
    $("label2").textContent = "ပဲ (Pae) ပမာဏ:";
    $("label3").textContent = "ရွှေး (Yway) ပမာဏ:";
    $("group3").style.display = "block";
    $("priceGroup").style.display = "block";
  }

  $("input1").placeholder = isMoneyToWeight ? "MMK ပမာဏ" : "ကျပ် ပမာဏ";
  $("input2").placeholder = isMoneyToWeight ? "ပေါက်စျေး (MMK)" : "ပဲ ပမာဏ";
  result.innerHTML = `<span class="fw-bold">${isMoneyToWeight ? "ရွှေ အလေးချိန်" : "ကျသင့် ငွေ"}</span>`;
  calculate();
}

// Main calculation
function calculate() {
  detectLanguage(); // check if Myanmar or English input

  const mode = $("mode").value;
  const result = $("result");
  const isMoneyToWeight = mode === "ဝယ်မယ်";

  const input1 = getNumericValue("input1");
  const input2 = getNumericValue("input2");
  const input3 = $("group3").style.display === "block" ? getNumericValue("input3") : 0;
  const priceInput = $("priceGroup").style.display === "block" ? getNumericValue("priceInput") : 0;

  if (isMoneyToWeight) {
    // Money → Gold Weight
    const money = input1;
    const price = input2;
    if (money <= 0 || price <= 0) {
      result.className = "alert alert-info text-center mt-4 fw-bold";
      result.innerHTML = "ရွှေ အလေးချိန်: -";
      return;
    }

    const totalKyat = money / price;
    const kyat = Math.floor(totalKyat);
    const totalPae = (totalKyat - kyat) * 16;
    const pae = Math.floor(totalPae);
    const yway = (totalPae - pae) * 8;

    let output = `${kyat} ကျပ် ၊ ${pae} ပဲ ၊ ${yway.toFixed(2)} ရွှေး`;
    if (outputInMyanmar) output = enToMm(output);

    result.className = "alert alert-primary text-center mt-4 fw-bold";
    result.innerHTML = output;

  } else {
    // Gold → Money
    const kyatWeight = input1;
    const paeWeight = input2;
    const ywayWeight = input3;
    const price = priceInput;
    if (price <= 0) {
      result.className = "alert alert-info text-center mt-4 fw-bold";
      result.innerHTML = "ကျသင့် ငွေ: -";
      return;
    }

    const totalK = kyatWeight + (paeWeight / 16) + (ywayWeight / 128);
    const amount = totalK * price;
    let formatted = amount.toLocaleString('en-US');

    if (outputInMyanmar) formatted = enToMm(formatted);

    result.className = "alert alert-success text-center mt-4 fw-bold";
    result.innerHTML = `${formatted} MMK`;
  }
}

document.addEventListener("DOMContentLoaded", updateMode);
