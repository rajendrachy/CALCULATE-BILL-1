const items = [
    { 
        id: "item1",
        itemName: "Butter Roti",
        rate: 20,
        taxes: [
            {
                name: "Service Charge",
                rate: 10,
                isInPercent: 'Y'
            }
        ],
        category: { categoryId: "C2" }
    },
    { 
        id: "item2",
        itemName: "Paneer Butter Masala",
        rate: 150,
        taxes: [
            {
                name: "Service Charge",
                rate: 10,
                isInPercent: 'Y'
            }
        ],
        category: { categoryId: "C1" }
    }
];

const categories = [
    {
        id: "C1",
        categoryName: "Platters",
        superCategory: {
            superCategoryName: "South Indian",
            id: "SC1"
        }
    },
    {
        id: "C2",
        categoryName: "Breads",
        superCategory: {
            superCategoryName: "North Indian",
            id: "SC2"
        }
    }
];

const bill = {
    id: "B1",
    billNumber: 1,
    opentime: "06 Nov 2020 14:19",
    customerName: "CodeQuotient",
    billItems: [
        {
            id: "item2",
            quantity: 3,
            discount: {
                rate: 10,
                isInPercent: 'Y'
            }
        },
        {
            id: "item1",
            quantity: 2,
            discount: {
                rate: 5,
                isInPercent: 'N'
            }
        }
    ]
};



// Task 1: Function to return basic JSON structure

function generateBillSummary(bill, items) {
    return {
        id: bill.id,
        billNumber: bill.billNumber,
        opentime: bill.opentime,
        customerName: bill.customerName,
        billItems: bill.billItems.map(billItem => {
            const item = items.find(i => i.id === billItem.id);
            return {
                id: billItem.id,
                name: item ? item.itemName : "",
                quantity: billItem.quantity
            };
        })
    };
}

console.log(generateBillSummary(bill, items));



// Task 2: Function to return detailed JSON structure with calculated total amount

function calculateBill(bill, items, categories) {
    let totalAmount = 0;

    const detailedBill = {
        id: bill.id,
        billNumber: bill.billNumber,
        opentime: bill.opentime,
        customerName: bill.customerName,
        billItems: bill.billItems.map(billItem => {
            const item = items.find(i => i.id === billItem.id);
            if (!item) return null;

            // Calculate item amount before discount and taxes
            let itemAmount = item.rate * billItem.quantity;

            // Apply discount
            if (billItem.discount) {
                const discount = billItem.discount;
                const discountAmount = discount.isInPercent === 'Y'
                    ? (itemAmount * discount.rate) / 100
                    : discount.rate;
                itemAmount -= discountAmount;
            }

            // Apply taxes
            let totalTaxAmount = 0;
            item.taxes.forEach(tax => {
                const taxAmount = tax.isInPercent === 'Y'
                    ? (itemAmount * tax.rate) / 100
                    : tax.rate;
                totalTaxAmount += taxAmount;
            });
            itemAmount += totalTaxAmount;

            // Update total bill amount
            totalAmount += itemAmount;

            // Get category and supercategory names
            const category = categories.find(cat => cat.id === item.category.categoryId);
            const categoryName = category ? category.categoryName : "";
            const superCategoryName = category && category.superCategory ? category.superCategory.superCategoryName : "";

            return {
                id: billItem.id,
                name: item.itemName,
                quantity: billItem.quantity,
                discount: billItem.discount,
                taxes: item.taxes,
                amount: itemAmount,
                superCategoryName,
                categoryName
            };
        }).filter(item => item !== null),
        "Total Amount": totalAmount
    };

    return detailedBill;
}

console.log(calculateBill(bill, items, categories));
