var text = document.querySelector(".text-3xl");
var names = ["carlo martinelli", "marlo cartinelli"];

setInterval(function(){
    // Randomize the text between the two names
    var nameIndex = Math.round(Math.random());
    text.textContent = names[nameIndex];

    // Randomize the text's color, position, and blur effect
    text.style.color = getRandomColor();
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
