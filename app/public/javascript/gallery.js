const galleryContainer = document.getElementById("galleryContainer");
const fetchGalleryBtn = document.getElementById("fetchGalleryBtn");
const galleryTemplate = document.getElementById("galleryTemplate");

function manageAndAppendToGalleryContainer(base64, user) {
    let getTemplateHTML = document.importNode(galleryTemplate.content, true)
    getTemplateHTML.querySelector(".galleryImg").src = base64
    getTemplateHTML.querySelector(".galleryUsername").textContent = user || "ERROR";
    galleryContainer.append(getTemplateHTML);
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
        .then(data => {
            if (data.message) {
                cleanContainer();
                loopGalleryArray(data.message);
              }
            if (data.err) {
                throw data.err;
            }
        }).catch((err) => {
            console.error("hello from gallery!", err);
            manageErrorandAppendToPopupBox(err)
        });
}

fetchGalleryBtn.addEventListener("click", fetchGallery)