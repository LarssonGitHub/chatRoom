const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

function ObjectifyEntriesAndStringify(data) {
  const formData = new FormData(data);
  return JSON.stringify(Object.fromEntries(formData))
}

// loginForm.addEventListener("submit", e => {
//     e.preventDefault()
//     const formEntries = ObjectifyEntriesAndStringify(e.target)

//     const options = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: formEntries
//     };

//     fetch('/login', options)
//       .then(resp => resp.json())
//       .then(data => {
//         console.log(data);
//       }).catch(err => {
//         console.log(err);
//       });
//   })

  // registerForm.addEventListener("submit", e => {
  //   e.preventDefault()
  //   const formEntries = ObjectifyEntriesAndStringify(e.target)
  //   console.log("registered....!");
  // })