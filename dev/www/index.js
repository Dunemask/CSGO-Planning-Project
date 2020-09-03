let mapIndex=0;
let mapBackground;
const maps = document.querySelectorAll('.maps > input');
const mapCanvas = document.getElementById("mapCanvas");
window.onload = function() {
mapBackground= `images/maps/${maps[mapIndex].id}.jpg`
mapCanvas.style.background = `url('${mapBackground}')`;
mapCanvas.style.backgroundSize = '100%';

}
