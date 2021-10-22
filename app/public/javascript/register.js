const registerForm = document.getElementById("registerForm");

function submitRegisterForm(e) {
    e.preventDefault();
    const formEntries = ObjectifyEntriesAndStringify(e.target)
    const options = setFetchPostOptions(formEntries)
    fetch('/register', options)
        .then(resp => resp.json())
        .then(data => {
            if (data.redirectTo) {
                location.assign(data.redirectTo)
              }
            if (data.err) {
                throw data.err;
            }
        }).catch(err => {
            console.log("hello from err!", err);
            manageErrorandAppendToPopupBox(err)
        });
}

registerForm.addEventListener("submit", submitRegisterForm);

