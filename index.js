const inputs = document.querySelectorAll(".controls input");
const canvas = document.querySelector("#draw");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const initial = rgbToHsl({ r: 0, g: 55, b: 255 });
ctx.strokeStyle = `hsl(${initial[0]}, ${initial[1]}%)`;
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = "10";
// ctx.globalCompositeOperation = "multiply";

let isDrawing = false;
let lastX = 0;
let lastY = 0;
function handleUpdate() {
  if (this.name === "lineWidth") {
    ctx.lineWidth = `${this.value}`;
  }
  if (this.name === "base") {
    let rgb = hexToRgb(this.value);
    let hsl = rgbToHsl(rgb);
    ctx.strokeStyle = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
  }
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

function rgbToHsl(rgb) {
  var a, add, b, diff, g, h, hue, l, lum, max, min, r, s, sat;
  r = parseFloat(rgb.r) / 255;
  g = parseFloat(rgb.g) / 255;
  b = parseFloat(rgb.b) / 255;
  max = Math.max(r, g, b);
  min = Math.min(r, g, b);
  diff = max - min;
  add = max + min;
  hue =
    min === max
      ? 0
      : r === max
      ? ((60 * (g - b)) / diff + 360) % 360
      : g === max
      ? (60 * (b - r)) / diff + 120
      : (60 * (r - g)) / diff + 240;
  lum = 0.5 * add;
  sat =
    lum === 0 ? 0 : lum === 1 ? 1 : lum <= 0.5 ? diff / add : diff / (2 - add);
  h = Math.round(hue);
  s = Math.round(sat * 100);
  l = Math.round(lum * 100);
  a = parseFloat(rgb[3]) || 1;
  return [h, s, l, a];
}

inputs.forEach((input) => input.addEventListener("change", handleUpdate));
inputs.forEach((input) => input.addEventListener("mousemove", handleUpdate));

function draw(e) {
  if (!isDrawing) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));
