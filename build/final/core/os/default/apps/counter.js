var frame;
var numTxt;
var test="hi";
function main() {
    frame=new System.Window(0, 0, 150, 150, "Counter");
    console.log(System);
    var graphics=frame.graphics;
    var add=new Button("Add", 10, 50);
    add.addEventListener("click", function(e) {
        frame.hide();
        frame.update();
    });
    var numTxt=new Text("0", 10, 20, {
        align: TextAlign.LEFT,
        baseline: TextBaseline.TOP
    }, "#000");
    graphics.addComponent(add);
    graphics.add(numTxt);

    frame.show();
}