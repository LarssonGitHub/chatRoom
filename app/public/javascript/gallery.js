const galleryList = document.getElementById("galleryList");
const imagesToggleBtn = document.getElementById("imagesToggleBtn");
const galleryTemplate = document.getElementById("galleryTemplate");
const gallerySection = document.getElementById("gallerySection");
const closeGallerySection = document.getElementById("closeGallerySection");

function manageAndAppendTogalleryList(user, imgData) {
    let getTemplateHTML = document.importNode(galleryTemplate.content, true)
    getTemplateHTML.querySelector(".galleryImg").src = imgData
    getTemplateHTML.querySelector(".galleryUsername").textContent = user || "ERROR";
    galleryList.append(getTemplateHTML);
}

function cleanContainer() {
    galleryList.textContent = "";
}

function loopGalleryArray(galleryArray) {
    galleryArray.forEach(image => {
        const {
            user,
            imgData
        } = image
        manageAndAppendTogalleryList(user, imgData)
    });
}

function fetchGallery() {
    clientLookingAtBrowserWindow ? clientLookingAtBrowserWindow = false : clientLookingAtBrowserWindow = true;
    offCanvasIsActive ? offCanvasIsActive = false : offCanvasIsActive = true
    imagesToggleBtn.disabled = true;
    displayOfCanvas(gallerySection);
    activeElement(imagesToggleBtn)
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
            console.log(err, "32");
            manageErrorAndAppendToPopupBox(err)
        });
}

imagesToggleBtn.addEventListener("click", fetchGallery)
closeGallerySection.addEventListener("click", () => {
    !clientLookingAtBrowserWindow ? clientLookingAtBrowserWindow = true : clientLookingAtBrowserWindow = false;
    !offCanvasIsActive ? offCanvasIsActive = true : offCanvasIsActive = false;
    resetNewMessageNotifications();
    displayOfCanvas(gallerySection);
    activeElement(imagesToggleBtn);
})