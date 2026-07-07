const popup = document.querySelector("#popup");
const popupTitle = document.querySelector("#popup-title");
const popupClose = document.querySelector(".close");

document.querySelectorAll(".feature").forEach((f) => {
    f.addEventListener("click", () => {
        popup.classList.add("show");
        popupTitle.textContent = f.dataset.feature;
    })
});

popupClose.addEventListener("click", () => {
    popup.classList.remove("show");
});
