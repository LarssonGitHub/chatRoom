const loginForm = document.getElementById("loginForm");

function submitLoginForm(e) {
    e.preventDefault();
    const formEntries = ObjectifyEntriesAndStringify(e.target)
    const options = setFetchPostOptions(formEntries)
    fetch('/login', options)
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

loginForm.addEventListener("submit", submitLoginForm);
