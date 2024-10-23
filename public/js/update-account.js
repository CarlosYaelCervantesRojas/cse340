const accountForm = document.getElementById("edit-account");
const passwordForm = document.getElementById("edit-password");

const accountButton = document.getElementById("account-button");
const passwordButton = document.getElementById("password-button");


function enableButton(form, button) {
   form.addEventListener("change", () => {
    button.removeAttribute("disabled")
   })
}

enableButton(accountForm, accountButton);
enableButton(passwordForm, passwordButton);