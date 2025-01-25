
function breakpoint1000() {
  if (window.innerWidth < 1000) {
    affected = document.getElementsByClassName("breakpoint1000");
    for (x in affected) {
        affected[x].classList.remove("together");
        for (const child of affected[x].children) {
            if (child.style.width == '50%') { 
                child.style.width = '100%'
            }
        }
    }
} else {
    affected = document.getElementsByClassName("breakpoint1000");
    for (x in affected) {
        affected[x].classList.add("together");
        for (const child of affected[x].children) {
            if (child.style.width == '100%') { 
                child.style.width = '50%'
            }
        }
    }
}
}

breakpoint1000();

window.addEventListener("resize", () => {
    breakpoint1000()
});
