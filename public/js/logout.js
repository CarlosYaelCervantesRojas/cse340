const logoutLink = document.getElementById("logout-link");

logoutLink.addEventListener("click", () => {
    const form = document.getElementById("logout-form")
    form.submit();
});