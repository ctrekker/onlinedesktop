/**
 * The global System variable stores all of the objects or variables closely tied to the base 
 * OS. Objects such as Windows are stored here, and can also be created using its constructor.
 * Anything that is not directly used in the System or OS environment is not stored here, like 
 * the Graphics or Component objects. Just because they are used in an object associated with 
 * System does not mean that it is a part of the System object.
 */
var System={
    /**
     * Prints a string message to the JavaScript development console.
     * @param  txt 
     */
    println: function(txt) {
        postMessage({
            action: "System.println",
            params: txt
        });
    },
    sendRaw: function(data) {
        postMessage(data);
    },
    favor: function (primary, secondary) {
        return (typeof primary=="undefined"?(typeof secondary=="function"?secondary():secondary):primary);
    },
    windowID: 0,
    Window: function(x, y, width, height, title) {
        var o=System.favor;
        this.x=o(x, null);
        this.y=o(y, null);
        this.width=o(width, null);
        this.height=o(height, null);
        this.title=o(title, "");
        this.graphics=new Graphics();
        this.id=System.windowID;
        System.windowID++;

        this.event={
            mousedown: [],
            mouseup: [],
            mousemove: [],
            keydown: [],
            keyup: [],
            any: []
        };

        System.allWindows.push(this);

        System.sendRaw({
            action: "System.Window.<init>",
            params: this.getSend()
        });
    },
    allWindows: [],
    defaultAddEventListener: function(name, callback) {
        this.event[name].push(callback);
    },
    defaultTriggerEvent: function(name, data) {
        data.eventType=name;
        data.window=this;
        data.executor=this.exeEnvironment;
        for(var i=0; i<this.event[name].length; i++) {
            this.event[name][i](data);
        }
        for(var i=0; i<this.event["any"].length; i++) {
            this.event["any"][i](data);
        }
    }
};
System.Window.prototype={
    show: function() {
        System.sendRaw({
            action: "System.Window.show",
            params: this.getSend()
        });
    },
    hide: function() {
        System.sendRaw({
            action: "System.Window.hide",
            params: this.getSend()
        });
    },
    update: function() {
        System.sendRaw({
            action: "System.Window.update",
            params: this.getSend()
        });
    },
    setGraphics: function(graphics) {
        this.graphics=graphics;
    },

    //INTERNAL VARIABLE SETTERS
    setX: function(x) {this.x=x},
    setY: function(y) {this.y=y},
    setWidth: function(width) {this.width=width},
    setheight: function(height) {this.height=height},
    setTitle: function(title) {this.title=title},

    //GETTERS
    getGlobalID: function() {
        System.sendRaw({
            action: "System.Window.getGlobalID",
            params: this
        });
    },
    getSend: function() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            title: this.title,
            graphics: this.graphics,
            id: this.id
        };
    },

    //ADDS
    addEventListener: function(name, callback, component) {
        if(this.event[name]=='undefined') this.event[name]=[];
        this.event[name].push({component: component, callback: callback});
    },
    triggerEvent: System.defaultTriggerEvent
};
function Graphics() {
    this.data={
        bg: null,
        elements: [

        ]
    };
    this.window=null;
}
Graphics.prototype={
    setBackground: function(color) {
        this.data.bg=color;
    },
    add: function(shape) {
        this.data.elements.push(shape);
    },
    addComponent: function(component) {
        for(var i=0; i<component.shapes.length; i++) {
            this.data.elements.push(component.shapes[i]);
        }
    }
};
function Shape(type, x, y, w, h, fc, sc, ss) {
    var o=System.favor;
    this.type=o(type, ShapeType.RECTANGLE);
    //Data preset
    this.data={};
    //X Position (x)
    this.data.x=o(x, null);
    //Y Position (y)
    this.data.y=o(y, null);
    //Width (w)
    this.data.w=o(w, null);
    //Height (h)
    this.data.h=o(h, null);
    //Fill Color (fc)
    this.data.fc=o(fc, null);
    //Stroke Color (sc)
    this.data.sc=o(sc, null);
    //Stroke Size (ss);
    this.data.ss=o(ss+0.01, 1.01);
}
Shape.prototype={
    setX: function(x) {this.x=x},
    setY: function(y) {this.y=y},
    setWidth: function(w) {this.w=w},
    setHeight: function(h) {this.h=h},
    setFill: function(c) {this.fc=c},
    setStroke: function(c) {this.sc=c},
    setStrokeSize: function(ss) {this.ss=ss}
};
var ShapeType={
    RECTANGLE: 0,
    ELLIPSE: 1,
    LINE: 2,
    TEXT: 3
};
function Line(x1, y1, x2, y2, sc, ss) {
    var shape=new Shape(ShapeType.LINE, x1, y1, x2, y2, undefined, sc, ss);
    this.type=shape.type;
    this.data=shape.data;
}
function Text(text, x, y, data, fc, sc, ss) {
    var o=System.favor;
    var font=o(data.font, Text.FONT);
    var baseline=o(data.baseline, Text.BASELINE);
    var align=o(data.align, Text.ALIGN);
    var shape=new Shape(ShapeType.TEXT, x, y, text, {font: font, baseline: baseline, align: align}, fc, sc, ss);
    this.type=shape.type;
    this.data=shape.data;
}
var TextAlign={
    START: "start",
    END: "end",
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right"
};
var TextBaseline={
    TOP: "top",
    BOTTOM: "bottom",
    MIDDLE: "middle",
    ALPHABETIC: "alphabetic",
    HANGING: "hanging"
};
Text.FONT="12px Arial";
Text.BASELINE=TextBaseline.TOP;
Text.ALIGN=TextAlign.LEFT;
addEventListener("message", function(e) {
    var data=e.data;
    var window=System.allWindows[data.windowID];
    data.window=window;

    var eventCalls=[data.eventType, "any"];
    for(var x=0; x<eventCalls.length; x++) {
        for(var i=0; i<System.favor(window.event[eventCalls[x]].length, []); i++) {
            window.event[eventCalls[x]][i].callback(data);
        }
    }
});
function Component(sdata) {
    this.shapes=System.favor(sdata, []);
    this.id=Component.ID++;
}
Component.prototype={
    add: function(shape) {
        this.shapes.push(shape);
    }
};
Component.ID=0;
function Button(text, x, y, w, h) {
    w=w||Button.WIDTH;
    h=h||Button.HEIGHT;

    this.text=text;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.event={
        
    };
    this.component=new Component();
    this.component.x=x;
    this.component.y=y;
    this.component.w=w;
    this.component.h=h;
    var box1=new Shape(ShapeType.RECTANGLE, x, y, w, h, undefined, Button.STROKE, Button.OUTLINE);
    var box2=new Shape(ShapeType.RECTANGLE, x, y, w, h, Button.FILL);
    var text=new Text(text, x+Button.WIDTH/2, y+Button.HEIGHT/2, {
        font: Button.FONT,
        baseline: TextBaseline.MIDDLE,
        align: TextAlign.CENTER
    }, "#000");
    this.component.add(box1);
    this.component.add(box2);
    this.component.add(text);
    this.shapes=this.component.shapes;
}
Button.prototype.addEventListener=System.defaultAddEventListener;
Button.prototype.triggerEvent=System.defaultTriggerEvent;

Button.WIDTH=60;
Button.HEIGHT=20;
Button.FILL="#EEE";
Button.STROKE="#444";
Button.OUTLINE=1;
Button.FONT=Text.FONT;
(function(){
    //delete console;
    main();
}());