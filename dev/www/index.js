let mapBackground;
let selectedItem;
let marker;
let token;
let itemTokens= [];
let ds = 3; //ds is delta size.
let itemSizeBuff = 10;
let pos = { x: 0, y: 0 };
const maps = document.querySelectorAll('.maps > input');
const mapCanvas = document.getElementById("mapCanvas");
const canvasSize={w:mapCanvas.width,h:mapCanvas.height}
const mapItemSize={w:30,h:30}
const items = document.querySelectorAll('.tools > ul > li > input');
const ctx = mapCanvas.getContext("2d");

function itemsInArea(itemToken){
  let items=[];
    for(let i in itemTokens){
      let neighborToken = itemTokens[i]
      let overlapX = neighborToken.x+ds<itemToken.x && neighborToken.x+neighborToken.w+ds>itemToken.x+itemToken.w;
      let overlapY = neighborToken.y+ds<itemToken.y && neighborToken.y+neighborToken.h+ds>itemToken.y+itemToken.h;
      if(overlapX && overlapY){
        items.push(i);
      }
    }
    return items;
}

function selectItem(item){
  for(let i in items){
    if(!items[i].id){continue;}
    items[i].style.backgroundColor='rgba(255,255,255,.1)';
  }
  marker=false;
  token=false;
  selectedItem=false;
  if(item=='clear'){
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
    return;
  }

  if(item=='blue' || item=='red'){
    marker=item;
  }else{
    token=item;
  }
  document.getElementById(item).style.backgroundColor='rgba(204,204,255,.3)';
}

window.onload = function() {
mapBackground= `images/maps/${maps[0].id}.jpg`
mapCanvas.style.background = `url('${mapBackground}')`;
mapCanvas.style.backgroundSize = '100%';

//Give Maps Event Listeners
for(let m in maps){
  let map = maps[m];
  if(!map.id){continue;}
  document.getElementById(map.id).addEventListener("click", function(){
    mapBackground= `images/maps/${map.id}.jpg`
    mapCanvas.style.background = `url('${mapBackground}')`;
    mapCanvas.style.backgroundSize = '100%';
  });
}
//Give Items Event Listeners
for(let i in items){
  let item = items[i];
  if(!item.id){continue;}
  document.getElementById(item.id).addEventListener("click", function(){
    selectItem(item.id);
  });
}

function setPosition(e) {
  pos.x = e.clientX-8;
  pos.y = e.clientY-18;
}

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

function draw(e) {
  if(marker){
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath(); // begin

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = marker;

    ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!
  }

}

//Give Field Event Listener
mapCanvas.addEventListener("click",function(evt){
  console.log(`Click at ${evt.clientX}, ${evt.clientY}`);
  let click = {x:evt.clientX,y:evt.clientY}
  if(token=='delete'){
      let neighbors = itemsInArea({x:click.x,y:click.y,w:0,h:0});
      console.log(neighbors);

      for (let n = neighbors.length -1; n >= 0; n--){
              ctx.clearRect(itemTokens[neighbors[n]].x,
                              itemTokens[neighbors[n]].y,
                              itemTokens[neighbors[n]].w,
                              itemTokens[neighbors[n]].h);
              itemTokens.splice(neighbors[n],1);

      }


      return;
  }
  if(token){
    let drawW=mapItemSize.w
    let drawH=mapItemSize.h;
    if(token=='smoke' || token=='molotov'){
      drawW+=itemSizeBuff;
      drawH+=itemSizeBuff;
    }
    let drawX=click.x-drawW+13;
    let drawY=click.y-(drawH)+8;
    let img = new Image();
    img.onload = function()
    {
      ctx.drawImage(img,drawX,drawY,drawW,drawH);
      let itemToken = {x:drawX,y:drawY,w:drawW,h:drawH};
      let neighbors = itemsInArea(itemToken);
      console.log(neighbors);
      itemTokens.push(itemToken);
    }
    img.src = `images/items/ICON_${token}.png`;
  }

})
}
