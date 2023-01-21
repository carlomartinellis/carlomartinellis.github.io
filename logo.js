var text = document.querySelector(".text-3xl");

setInterval(function(){
    text.style.color = getRandomColor();
    // Randomize the text's horizontal and vertical position
    text.style.transform = "translate(" + Math.random() * 20 + "px, " + Math.random() * 20 + "px)";
    text.style.filter = "blur(" + Math.random() * 2 + "px)";
}, 80);

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

