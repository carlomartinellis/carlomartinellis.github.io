var text = document.querySelector(".text-3xl");

setInterval(function(){
    // Randomize the text's color
    text.style.color = getRandomColor();
    // Randomize the text's horizontal position and add a blur effect
    text.style.transform = "translate(" + Math.random() * 20 + "px, 0px)";
    text.style.filter = "blur(" + Math.random() * 5 + "px)";
}, 100);

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
