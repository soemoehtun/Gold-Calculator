// Helper to get element
function $(id) { return document.getElementById(id); }

// Convert Myanmar digits (၁၂၃၄၅၆၇၈၉၀) to English digits (1234567890)
function mmToEn(numStr) {
  const mmDigits = "၀၁၂၃၄၅၆၇၈၉";
  const enDigits = "0123456789";
  let converted = "";
  for (let ch of numStr) {
    const idx = mmDigits.indexOf(ch);
    converted += idx !== -1 ? enDigits[idx] : ch;
  }
  return converted;
}

// Get numeric value (support both Myanmar & English digits)
function getNumericValue(id) {
  const val = $(id).value.trim();
  if (val === "") return 0;
  const clean = mmToEn(val.replace(/,/g, "")); // remove commas
  return parseFloat(clean) || 0;
}

// Update input UI according to selected mode
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

// Main Calculation
function calculate() {
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

    result.className = "alert alert-primary text-center mt-4 fw-bold";
    result.innerHTML = `${kyat} ကျပ် ၊ ${pae} ပဲ ၊ ${yway.toFixed(2)} ရွှေး`;
  } else {
    // Gold Weight → Money
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

    result.className = "alert alert-success text-center mt-4 fw-bold";
    result.innerHTML = `${amount.toLocaleString('en-US')} MMK`;
  }
}

document.addEventListener("DOMContentLoaded", updateMode);
