const registerForm = document.getElementById("registerForm");

function submitRegisterForm(e) {
    e.preventDefault();
    const formEntries = ObjectifyEntriesAndStringify(e.target)
    const options = setFetchPostOptions(formEntries)
    fetch('/register', options)
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            if (data.redirectTo) {
                location.assign(data.redirectTo)
              }
        }).catch(err => {
            console.log(err);
        });
}

registerForm.addEventListener("submit", submitRegisterForm);

