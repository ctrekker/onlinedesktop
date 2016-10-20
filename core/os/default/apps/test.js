function main() {
    var window=new System.Window(0, 0, 500, 500, "Shapes Test");
    var g=window.graphics;
    g.add(new Shape(ShapeType.RECTANGLE, 0, 0, 50, 50, "#000"));
    g.add(new Shape(ShapeType.ELLIPSE, 55, 0, 50, 50, "#000"));   
    g.add(new Line(0, 55, 50, 105, "#000")); 
    g.add(new Shape(ShapeType.TEXT, 55, 55, "Hello, World!", {font:"14px Arial"}, "#000"));  
    g.addComponent(new Button("OK", 100, 100)); 
    /*
    THIS CODE HAS A MEMORY LEAK IN IT!!!
    window.show() has been confirmed as the isolated function call causing the initial memory leaking.
    To further isolate, comment out sections inside of the funtion to figure out exactly what is 
    causing the problem. So far, all we know is that it is happening once the window is shown.

    The code below is normally uncommented
    */                                                                                                                                     
    /*window.show();*/
}