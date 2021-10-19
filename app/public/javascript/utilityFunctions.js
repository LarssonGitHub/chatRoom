function ObjectifyEntriesAndStringify(data) {
    const formData = new FormData(data);
    return JSON.stringify(Object.fromEntries(formData))
}

function setFetchPostOptions(formEntries) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: formEntries
    };
}
