const galleryContainer = document.getElementById("galleryContainer");
const imagesToggleBtn = document.getElementById("imagesToggleBtn");
const galleryTemplate = document.getElementById("galleryTemplate");

function manageAndAppendToGalleryContainer(user, imgData) {
    let getTemplateHTML = document.importNode(galleryTemplate.content, true)
    getTemplateHTML.querySelector(".galleryImg").src = imgData
    getTemplateHTML.querySelector(".galleryUsername").textContent = user || "ERROR";
    galleryContainer.append(getTemplateHTML);
}

function cleanContainer() {
    galleryContainer.textContent = "";
}

function loopGalleryArray(galleryArray) {
    galleryArray.forEach(image => {
        const {user, imgData} = image
        manageAndAppendToGalleryContainer(user, imgData)
    });
}

function fetchGallery() {
    imagesToggleBtn.disabled = true;
    fetch('/gallery/')
        .then(response => response.json())
        .then(data => {
            imagesToggleBtn.disabled = false;
            if (data.message) {
                cleanContainer();
                loopGalleryArray(data.message);
              }
            if (data.err) {
                throw data.err;
            }
        }).catch((err) => {
            console.error("hello from gallery!", err);
            manageErrorAndAppendToPopupBox(err)
        });
}

imagesToggleBtn.addEventListener("click", fetchGallery)