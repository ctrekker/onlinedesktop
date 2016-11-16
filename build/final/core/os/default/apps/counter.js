var frame;
var numTxt;
var test="hi";
function main() {
    System.config.appname="counter";
    console.log(System.setVal("hi", "Hello, World!"));
    console.log(System.getVal("test"));

    frame=new System.Window(0, 0, 150, 115, "Counter");
    var graphics=frame.graphics;
    var add=new Button("Add", 10, 50);
    var sub=new Button("Subtract", 80, 50);
    add.addEventListener("click", function(e) {
        numTxt.setText(parseInt(numTxt.getText())+1);
        frame.update();
    });
    sub.addEventListener("click", function(e) {
        numTxt.setText(parseInt(numTxt.getText())-1);
        frame.update();
    });
    var numTxt=new Text("0", 10, 20, {
        align: TextAlign.LEFT,
        baseline: TextBaseline.TOP
    }, Color.BLACK);
    graphics.addComponent(add);
    graphics.addComponent(sub);
    graphics.add(numTxt);

    frame.show();
}