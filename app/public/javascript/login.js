const loginForm = document.getElementById("loginForm");

function submitLoginForm(e) {
    e.preventDefault();
    const formEntries = ObjectifyEntriesAndStringify(e.target)
    const options = setFetchPostOptions(formEntries)
    fetch('/login', options)
        .then(resp => resp.json())
        .then(data => {
            if (data.redirectTo) {
                location.assign(data.redirectTo)
              }
            if (data.err) {
                throw data.err;
            }
        }).catch(err => {
            console.log(err, "33");
            manageErrorAndAppendToPopupBox(err)
        });
}

loginForm.addEventListener("submit", submitLoginForm);
