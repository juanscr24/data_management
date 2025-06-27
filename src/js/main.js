import Swal from "sweetalert2";

// An empty array is declared
let products = [];
// an IdCounter is declared
let idCounter = 1;
// Declared id variable
let editingProductId = null;

// Const declared bringing HTML elements
const $product = document.getElementById("product");
const $price = document.getElementById("price");
const $btnSave = document.getElementById("btn-save");
const $form = document.getElementById("userForm");
const tableBody = document.getElementById("userTableBody");

// A function was created to handle the button event.
$btnSave.addEventListener("click", function (e) {
    e.preventDefault();

    saveProduct();
    renderTable();
    $form.reset();
});


// A function was created to save products
function saveProduct() {

    // Variables are declared where the value will be brought without leaving spaces in the data with the trim method
    const product = $product.value.trim();
    const priceStr = $price.value.trim();

    // Will only accept float with the parseFloat 
    const price = parseFloat(priceStr)

    //Validating that it must have product and price
    if (!product || !price) {
        // Swal is an alert library
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Empty spaces...",
            showConfirmButton: false,
            timer: 900,
        });
        return;
    }

    // It was confirmed that products cannot be repeated.
    const existingProduct = products.find(p => p.product.toLowerCase() === product.toLowerCase());

    if (existingProduct && existingProduct.id !== editingProductId) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "This product already exists!",
            showConfirmButton: false,
            timer: 1500,
        });
        return;
    }

    // The product id is increasing
    if (editingProductId !== null) {
        const productIndex = products.findIndex(p => p.id === editingProductId);
        if (productIndex !== -1) {
            products[productIndex].product = product;
            products[productIndex].price = price;
        }
        editingProductId = null;
    } else {
        const newProduct = {
            id: idCounter++,
            product,
            price,
        };
        products.push(newProduct);
    }

    $btnSave.textContent = 'Save'

    // The console will be clear
    console.clear();
    console.table(products);

    // Alet with message 'Product has been save'
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Product has been save",
        showConfirmButton: false,
        timer: 1000,
    });
}

// Function to display the newly created object in HTML
function renderTable() {
    tableBody.innerHTML = "";

    products.map((product) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.product}</td>
            <td>${product.price}</td>
            <td class="actions">
            <button onclick="editUser(${product.id})">Edit</button>
            <button onclick="deleteUser(${product.id})">Delete</button>
            </td>`
            ;

        tableBody.appendChild(row);
    });
}

// Function to edit products
window.editUser = function (id) {
    const product = products.find((p) => p.id === id);
    if (product) {
        $product.value = product.product;
        $price.value = product.price;
        editingProductId = id;

        $btnSave.textContent = 'Update'
    }
    console.clear();
    console.table(products);
};

// Function to delete products
window.deleteUser = async function (id) {
    const result = await Swal.fire({
        title: "Are you sure you want to delete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
        products = products.filter((p) => p.id !== id);
        renderTable();

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Product has been deleted!",
            showConfirmButton: false,
            timer: 1500,
        });
    }
};
