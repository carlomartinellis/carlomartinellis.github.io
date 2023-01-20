var text = document.querySelector(".text-3xl");

setInterval(function(){
  text.style.color = getRandomColor();
  text.style.transform = "translate(0px, " + Math.random() * 20 + "px)";
}, 100);

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
