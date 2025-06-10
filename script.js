const imgContElm = document.querySelector(".img-container");
const imgElm = document.querySelector(".img-container img");
const listProductsElm = document.querySelector(".list-products");

// State for zoom level
let zoomScale = 1;

// Mouse enter/leave for zoom effect
imgContElm.addEventListener('mouseenter', () => {
    imgElm.style.transform = `scale(${zoomScale})`;
});
imgContElm.addEventListener('mouseleave', () => {
    imgElm.style.transform = 'scale(1)';
});

// Mouse move to position image
imgContElm.addEventListener('mousemove', function(mouseEvent) {
    let rect = imgContElm.getBoundingClientRect();
    let xpos = mouseEvent.pageX || mouseEvent.clientX + window.scrollX;
    let ypos = mouseEvent.pageY || mouseEvent.clientY + window.scrollY;

    // Calculate relative position within container
    xpos -= rect.left + window.scrollX;
    ypos -= rect.top + window.scrollY;

    const imgWidth = imgElm.offsetWidth;
    const imgHeight = imgElm.offsetHeight;

    // Position image based on cursor
    const left = -((imgWidth - rect.width) * xpos / rect.width);
    const top = -((imgHeight - rect.height) * ypos / rect.height);

    imgElm.style.transformOrigin = `${xpos / rect.width * 100}% ${ypos / rect.height * 100}%`;
    imgElm.style.transform = `scale(${zoomScale})`;
    imgElm.style.position = 'absolute';
    imgElm.style.left = left + 'px';
    imgElm.style.top = top + 'px';
});

// Change image on product list
Array.from(listProductsElm.children).forEach((productElm) => {
    productElm.addEventListener('click', () => {
        const newSrc = productElm.querySelector('img').src;
        imgElm.src = newSrc;

        Array.from(listProductsElm.children).forEach(prod => prod.classList.remove('active'));
        productElm.classList.add('active');
    });
});

// Dynamic height adjustment if needed
function changeHeight() {
    imgContElm.style.height = imgContElm.clientWidth + 'px';
}
changeHeight();
window.addEventListener('resize', changeHeight);

// Desktop zoom with wheel
imgContElm.addEventListener('wheel', (e) => {
    e.preventDefault();

    const delta = Math.sign(e.deltaY);
    // Adjust zoom scale
    zoomScale = Math.min(Math.max(0.5, zoomScale - delta * 0.1), 3); // limit zoom between 0.5x and 3x

    // Apply zoom
    imgElm.style.transform = `scale(${zoomScale})`;
    imgElm.style.transformOrigin = 'center center';
});

// Mobile pinch zoom
let initialDistance = null;

function getDistance(touches) {
    const [touch1, touch2] = touches;
    return Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
    );
}

imgContElm.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
    }
});
imgContElm.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialDistance) {
        const currentDistance = getDistance(e.touches);
        const scaleChange = currentDistance / initialDistance;
        zoomScale = Math.min(Math.max(0.5, scaleChange), 3);
        // Apply zoom
        imgElm.style.transform = `scale(${zoomScale})`;
        imgElm.style.transformOrigin = 'center center';
        e.preventDefault(); // prevent browser double-tap zoom
    }
});
imgContElm.addEventListener('touchend', () => {
    initialDistance = null;
});
