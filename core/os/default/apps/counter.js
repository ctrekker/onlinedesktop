var frame;
var numTxt;
var test="hi";
function main() {
    System.config.appname="counter";

    frame=new System.Window(0, 0, 150, 115, "Counter");
    var graphics=frame.graphics;
    var add=new Button("Add", 10, 50);
    var sub=new Button("Subtract", 80, 50);
    add.addEventListener("click", function(e) {
        numTxt.setText(parseInt(numTxt.getText())+1);
        System.app.setVal("number", numTxt.getText(), true);
        frame.update();
    });
    sub.addEventListener("click", function(e) {
        numTxt.setText(parseInt(numTxt.getText())-1);
        System.app.setVal("number", numTxt.getText(), true);
        frame.update();
    });
    var numTxt=new Text((System.app.getVal("number")!="")?System.app.getVal("number"):"0", 10, 20, {
        align: TextAlign.LEFT,
        baseline: TextBaseline.TOP
    }, Color.BLACK);
    graphics.addComponent(add);
    graphics.addComponent(sub);
    graphics.add(numTxt);

    frame.show();
}