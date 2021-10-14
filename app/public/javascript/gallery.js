const galleryContainer = document.getElementById("galleryContainer");
const fetchGalleryBtn = document.getElementById("fetchGalleryBtn");
const galleryTemplate = document.getElementById("galleryTemplate");

function manageAndAppendToGalleryContainer(base64, user) {
    let getHTML = document.importNode(galleryTemplate.content, true)
    getHTML.querySelector(".galleryImg").src = base64
    getHTML.querySelector(".galleryUsername").textContent = user || "ERROR";
    galleryContainer.append(getHTML);
}

function cleanContainer() {
    galleryContainer.textContent = "";
}

function loopGalleryArray(galleryArray) {
    galleryArray.forEach(image => {
        const {base64, user} = image
        manageAndAppendToGalleryContainer(base64, user)
    });
}

function fetchGallery() {
    fetch('/gallery/')
        .then(response => response.json())
        .then(array => {
            cleanContainer();
            loopGalleryArray(array);
        }).catch((error) => {
            console.error('Error:', error);
        });
}

fetchGalleryBtn.addEventListener("click", fetchGallery)