const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

function ObjectifyEntriesAndStringify(data) {
  const formData = new FormData(data);
  return JSON.stringify(Object.fromEntries(formData))
}

loginForm.addEventListener("submit", e => {
    e.preventDefault()
    const formEntries = ObjectifyEntriesAndStringify(e.target)
  
  console.log(formEntries);
    // const options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(Object.fromEntries(formDataValues))
    // };
    // fetch('/post/', options)
    //   .then(resp => resp.json())
    //   .then(data => {
    //   }).catch(err => {
    //     console.log(err);
    //   });
  })

  registerForm.addEventListener("submit", e => {
    e.preventDefault()
    const formEntries = ObjectifyEntriesAndStringify(e.target)
  
  console.log(formEntries);
    // const options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(Object.fromEntries(formDataValues))
    // };
    // fetch('/post/', options)
    //   .then(resp => resp.json())
    //   .then(data => {
    //   }).catch(err => {
    //     console.log(err);
    //   });
  })