const togglePasswordButton = document.getElementById("toggle-pass");

togglePasswordButton.addEventListener("click", () => {
    const password = document.getElementById("password");
    const type = password.getAttribute("type");
    
    if (type == "password") {
        password.setAttribute("type", "text");
    } else {
        password.setAttribute("type", "password");
    }
});