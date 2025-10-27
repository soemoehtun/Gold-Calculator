// Helper to shorten document.getElementById
function $(id) { return document.getElementById(id); }

function updateMode() {
    const mode = $("mode").value;
    const result = $("result");

    // Hide/Show elements based on mode
    const isMoneyToWeight = mode === "ဝယ်မယ်";
    
    // Update labels and visibility
    if (isMoneyToWeight) {
        $("label1").textContent = "လက်ထဲရှိငွေ (MMK):";
        $("label2").textContent = "ရွှေပေါက်စျေး (MMK) (တစ်ကျပ်သား):"; // Clarified for better UX
        $("group3").style.display = "none";
        $("priceGroup").style.display = "none";
        
        // Clear inputs that are hidden/repurposed to prevent old values from affecting calculation
        $("input3").value = "";
        $("priceInput").value = "";
        
    } else {
        $("label1").textContent = "ကျပ် (Kyat) ပမာဏ:";
        $("label2").textContent = "ပဲ (Pae) ပမာဏ:";
        $("label3").textContent = "ရွှေး (Yway) ပမာဏ:";
        
        $("group3").style.display = "block";
        $("priceGroup").style.display = "block";

        // Clear input2 (which was used for price in mode 1)
        $("input2").value = "";
    }

    // Update result label and style
    const resultLabel = isMoneyToWeight ? "ရွှေ အလေးချိန်" : "ကျသင့် ငွေ";
    
    // Also update the placeholder text for the primary inputs for better UX
    $("input1").placeholder = isMoneyToWeight ? "MMK ပမာဏ" : "ကျပ် ပမာဏ";
    $("input2").placeholder = isMoneyToWeight ? "ပေါက်စျေး (MMK)" : "ပဲ ပမာဏ";


    // Set the initial result text
    result.innerHTML = `<span class="fw-bold">${resultLabel}</span>`;
    
    // Recalculate to update the result section
    calculate();
}

function calculate() {
    const mode = $("mode").value;
    const result = $("result");

    const input1 = parseFloat($("input1").value) || 0;
    const input2 = parseFloat($("input2").value) || 0;
    
    // Only parse these if they are visible
    const input3 = ($("group3").style.display === "block") ? (parseFloat($("input3").value) || 0) : 0;
    const priceInput = ($("priceGroup").style.display === "block") ? (parseFloat($("priceInput").value) || 0) : 0;
    
    const isMoneyToWeight = mode === "ငွေမှ ရွှေအလေးချိန်သို့";
    
    if (isMoneyToWeight) {
        // Mode: Money to Gold Weight
        const price = input2; // In this mode, input2 is the price
        const money = input1; // In this mode, input1 is the money
        
        const label = "ရွှေ အလေးချိန်: ";
        
        if (money <= 0 || price <= 0) {
            result.innerHTML = `<span class="fw-bold">${label}</span>`;
            return;
        }
        
        const totalKyat = money / price;
        const kyat = Math.floor(totalKyat);
        const totalPae = (totalKyat - kyat) * 16;
        const pae = Math.floor(totalPae);
        const yway = (totalPae - pae) * 8;
        
        // Format the output
        result.innerHTML = `
            <div class="h5 mb-0">
                ${kyat} ကျပ် ၊ ${pae} ပဲ ၊ ${yway.toFixed(2)} ရွှေး
            </div>
        `;
        
    } else {
        // Mode: Gold Weight to Money
        const price = priceInput; // Use the dedicated price input
        const kyatWeight = input1; // In this mode, input1 is Kyat
        const paeWeight = input2; // In this mode, input2 is Pae
        const ywayWeight = input3; // In this mode, input3 is Yway

        const label = "ကျသင့် ငွေ: ";
        
        // Simple validation check
        if (price <= 0) {
            result.innerHTML = `<span class="fw-bold">${label}</span>`;
            return;
        }

        // Calculation: Convert all to Kyat (1 Kyat = 16 Pae, 1 Pae = 8 Yway, so 1 Kyat = 128 Yway)
        const totalK = kyatWeight + (paeWeight / 16) + (ywayWeight / 128); 
        const amount = totalK * price;

        // Format the output with MMK localization
        result.innerHTML = `
            <div class="h5 mb-0 text-success">
                ${amount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} MMK
            </div>
        `;
    }
}

// Initial call to set up the default mode when the script loads
// This is now handled by an inline script in the HTML for better page load reliability.
// updateMode();
