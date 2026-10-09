

const menuButton =
    document.getElementById("menuButton");

const menuList =
    document.getElementById("menuList");

menuButton.addEventListener("click", () => {

    const isOpen =
        menuList.classList.toggle("is-open");

    menuButton.textContent =
        isOpen ? "×  MENU" : "MENU";

    menuButton.setAttribute(
        "aria-expanded",
        isOpen
    );
});