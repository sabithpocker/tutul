/**
 * sabithpocker@gmail.com
 */
function init() {
    drawImage();
    detectEyeMovements();
}

function detectEyeMovements() {
    webgazer.setGazeListener(function (data, elapsedTime) {
        console.log(data);
        if (data == null) {
            return;
        }
        var xprediction = data.x; //these x coordinates are relative to the viewport 
        var yprediction = data.y; //these y coordinates are relative to the viewport
        console.log(elapsedTime); //elapsed time is based on time since begin was called
    }).begin();
}

function drawImage() {
    var ctx = document.getElementById('canvas').getContext('2d');
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, 500, 500).data;
        processImageData(imageData);
    };
    img.src = 'img/i.jpg';
}

function chunk(a, l) {
    return new Array(Math.ceil(a.length / l)).fill(0)
        .map((_, n) => a.slice(n * l, n * l + l - 1));
}

function processImageData(imageData) {
    const rgb = chunk(imageData, 4);
    const hsl = rgb.map(rgb => rgbToHsl(...rgb));
    const colors = hsl.map(([h, s, l]) => `hsl(${h}, ${s}%, ${l}%)`);
    console.log(colors);
    setInterval(() => document.body.style.backgroundColor = colors[Math.floor(Math.random() * 250000)], 1000)
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}
window.onload = init();