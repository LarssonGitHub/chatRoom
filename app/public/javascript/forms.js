function ObjectifyEntriesAndStringify(data) {
    const formData = new FormData(data);
    return JSON.stringify(Object.fromEntries(formData))
}

function setFetchOptions(formEntries) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: formEntries
    };
}

function submitRegisterForm(e) {
    e.preventDefault();
    const formEntries = ObjectifyEntriesAndStringify(e.target)
    const options = setFetchOptions(formEntries)
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

function submitLoginForm(e) {
    e.preventDefault();
    const formEntries = ObjectifyEntriesAndStringify(e.target)
    const options = setFetchOptions(formEntries)
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