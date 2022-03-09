// let createContractButton = document.getElementById("create-contract");
let mintTokenButton = document.getElementById("mint-token")
let loader = document.getElementById("loader-hide")

// createContractButton.addEventListener("click", function () {
//     loader.style.display = "block";
//     fetch("http://localhost:2400/test").then(response => response.json())
//         .then(data => console.log(data)).finally(() => {
//             loader.style.display = "none";
//         })
// })

mintTokenButton.addEventListener("click", function () {
    let photo = document.getElementById("image-file").files[0];
    // let contractAddress = document.getElementById("contract-address").value;
    // console.log(contractAddress);
    console.log(photo);
    // let formData = new FormData();
    // formData.append("file", photo);
    // formData.append("contract_address", formData);
    fetch('/mint', { method: "POST", body: photo }).then(response => {
        return response.json();
    }).then(data => console.log(data))
})