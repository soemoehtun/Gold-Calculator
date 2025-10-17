// Helper to shorten document.getElementById
function $(id) { return document.getElementById(id); }

function updateMode() {
  const mode = $("mode").value;

  if (mode === "ငွေမှ ရွှေအလေးချိန်သို့") {
    $("label1").textContent = "လက်ထဲရှိငွေ (MMK):";
    $("label2").textContent = "ရွှေပေါက်စျေး (MMK):";
    $("group3").style.display = "none";
    $("priceGroup").style.display = "none";
  } else {
    $("label1").textContent = "ကျပ် (Kyat):";
    $("label2").textContent = "ပဲ (Pae):";
    $("label3").textContent = "ရွှေး (Yway):";
    $("group3").style.display = "block";
    $("priceGroup").style.display = "block";
  }

  // Reset result label when mode changes
  $("result").textContent = mode === "ငွေမှ ရွှေအလေးချိန်သို့" ? "ရွှေ အလေးချိန်" : "ကျသင့် ငွေ";

  calculate();
}

function calculate() {
  const mode = $("mode").value;
  const result = $("result");

  const input1 = parseFloat($("input1").value) || 0;
  const input2 = parseFloat($("input2").value) || 0;
  const input3 = parseFloat($("input3").value) || 0;
  const priceInput = parseFloat($("priceInput").value) || 0;

  if (mode === "ငွေမှ ရွှေအလေးချိန်သို့") {
    const label = "ရွှေ အလေးချိန်: ";
    if (input1 <= 0 || input2 <= 0) {
      result.textContent = label;
      return;
    }
    const totalKyat = input1 / input2;
    const kyat = Math.floor(totalKyat);
    const totalPae = (totalKyat - kyat) * 16;
    const pae = Math.floor(totalPae);
    const yway = (totalPae - pae) * 8;

    result.textContent = `${label}${kyat} Kyat ${pae} Pae ${yway.toFixed(2)} Yway`;

  } else {
    const label = "ကျသင့် ငွေ: ";
    if (input1 < 0 || input2 < 0 || input3 < 0 || priceInput <= 0) {
      result.textContent = label;
      return;
    }
    const totalK = input1 + (input2 / 16) + (input3 / 128); // Kyat + Pae/16 + Yway/128
    const amount = totalK * priceInput;

    result.textContent = `${label}${amount.toLocaleString()} MMK`;
  }
}