import Elem from "../layout/Elem";

export default function addRippleEffect(obj: Elem) {
    obj.css("position", "relative").css("overflow", "hidden");
    obj.addClass("__pyui_ripple")
    obj.o?.addEventListener("click", function (e) {

        // Create span element
        let ripple = document.createElement("rispan");

        // Add ripple class to span
        // ripple.classList.add("ripple");

        // Add span to the button
        obj.o?.appendChild(ripple);

        // Get position of X
        let x = e.clientX - e.currentTarget.offsetLeft;

        // Get position of Y
        let y = e.clientY - e.currentTarget.offsetTop;

        // Position the span element
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Remove span after 0.3s
        setTimeout(() => {
            ripple.remove();
        }, 300);
    })
}