let items = [];

function addItem() {
    const name = document.getElementById("itemName").value;
    const qty = Number(document.getElementById("qty").value);
    const price = Number(document.getElementById("price").value);

    if (!name || qty <= 0 || price <= 0) {
        alert("Please enter valid details");
        return;
    }

    items.push({ name, qty, price });
    renderBill();

    // Clear inputs
    document.getElementById("itemName").value = "";
    document.getElementById("qty").value = "";
    document.getElementById("price").value = "";
}

function renderBill() {
    const billBody = document.getElementById("billBody");
    billBody.innerHTML = "";

    let totalAmount = 0;

    items.forEach((item, index) => {
        const itemTotal = item.qty * item.price;
        totalAmount += itemTotal;

        billBody.innerHTML += `
            <tr>
                <td>${item.name}</td>

                <td>
                    <input 
                        type="number"
                        min="1"
                        value="${item.qty}"
                        onchange="updateQty(${index}, this.value)"
                        class="qty-input">
                    <span class="qty-text">${item.qty}</span>
                </td>

                <td style="text-align:right">${item.price.toFixed(2)}</td>
                <td style="text-align:right">${itemTotal.toFixed(2)}</td>

                <td class="no-print">
                    <button onclick="removeItem(${index})">❌</button>
                </td>
            </tr>
        `;
    });

    // ✅ UPDATE TOTALS (THIS WAS MISSING / WRONG)
    document.getElementById("subTotal").innerText = totalAmount.toFixed(2);
    document.getElementById("finalTotal").innerText = totalAmount.toFixed(2);
    document.getElementById("balance").innerText = totalAmount.toFixed(2);

    // ✅ AMOUNT IN WORDS (INTEGER ONLY)
    document.getElementById("amountWords").innerText =
        numberToWords(Math.floor(totalAmount)) + " Rupees only";

    // ✅ GRAND TOTAL (if still shown above)
    if (document.getElementById("grandTotal")) {
        document.getElementById("grandTotal").innerText = totalAmount.toFixed(2);
    }
    updateBalance();
}

function updateQty(index, newQty) {
    newQty = Number(newQty);
    if (newQty <= 0) return;

    items[index].qty = newQty;
    renderBill();
}

function removeItem(index) {
    items.splice(index, 1);
    renderBill();
}

function printBill() {
    if (items.length === 0) {
        alert("No items to print");
        return;
    }
    window.print();
}

function generateInvoiceDetails() {
    const now = new Date();

    const dateStr = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
    document.getElementById("invoiceDate").innerText = dateStr;

    // Invoice No: INV + YYYYMMDD + HHMMSS
    const invoiceNo =
        "INV" +
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0");

    document.getElementById("invoiceNo").innerText = invoiceNo;
}

function numberToWords(num) {
    const a = [
        "", "One", "Two", "Three", "Four", "Five", "Six",
        "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
        "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (num < 20) return a[num];
    if (num < 100)
        return b[Math.floor(num / 10)] + " " + a[num % 10];
    if (num < 1000)
        return a[Math.floor(num / 100)] + " Hundred " + numberToWords(num % 100);
    if (num < 100000)
        return numberToWords(Math.floor(num / 1000)) + " Thousand " + numberToWords(num % 1000);

    return numberToWords(Math.floor(num / 100000)) + " Lakh " + numberToWords(num % 100000);
}

function updateBalance() {
    const received = Number(document.getElementById("receivedAmount").value) || 0;
    const total = Number(document.getElementById("finalTotal").innerText) || 0;

    const balance = total - received;

    document.getElementById("balance").innerText = balance.toFixed(2);
    document.getElementById("receivedPrint").innerText = received.toFixed(2);
}


// Call once on page load
generateInvoiceDetails();
