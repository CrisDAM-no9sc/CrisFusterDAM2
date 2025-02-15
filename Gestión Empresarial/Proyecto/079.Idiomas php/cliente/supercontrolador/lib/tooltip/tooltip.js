let tooltip = document.createElement("div");
tooltip.classList.add("tooltip");

document.querySelector("body").appendChild(tooltip);

document.addEventListener("mousemove", function (event) {
    // Actualizamos la posición del tooltip
    tooltip.style.left = event.pageX + "px";
    tooltip.style.top = event.pageY + "px";

   
    const elemento = event.target;
    if (elemento.hasAttribute("tooltip")) {
        
        tooltip.style.display = "block";
        tooltip.textContent = elemento.getAttribute("tooltip");
    } else {
        tooltip.style.display = "none";
    }
});