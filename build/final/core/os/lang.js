
var System={
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
    Global: function() {
        this.event={

        };
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

        this.addEventListener("any", function(e) {
            var graphics=e.window.graphics;
            for(var i in graphics.components) {
                var component=graphics.components[i];
                if(e.eventType.search("mouse")!=-1) {
                    if((e.x>component.x&&e.y>component.y)&&(e.x<component.x+component.w&&e.y<component.y+component.h)) {
                        e.component=component;
                        component.triggerEvent(e.eventType, e);
                    }
                }
            }
        });
        System.allWindows.push(this);

        System.sendRaw({
            action: "System.Window.<init>",
            params: this.getSend()
        });
    },
    allWindows: [],
    defaultAddEventListener: function(name, callback) {
        if(typeof this.event[name]=="undefined") this.event[name]=[];
        this.event[name].push(callback);
    },
    defaultTriggerEvent: function(name, data) {
        data.eventType=name;
        
        var eventCalls=[data.eventType, "any"];
        for(var x=0; x<eventCalls.length; x++) {
            if(typeof this.event[eventCalls[x]]=="undefined") this.event[eventCalls[x]]=[];
            for(var i=0; i<this.event[eventCalls[x]].length; i++) {
                this.event[eventCalls[x]][i](data);
            }
        }
    }
};
System.globalEventHandler=new System.Global();
addEventListener("message", function(e) {
    var data=e.data;
    var window=System.allWindows[data.windowID];
    data.window=window;

    var objCalls=[window, System.globalEventHandler];
    var eventCalls=[data.eventType, "any"];
    for(var x=0; x<objCalls.length; x++) {
        for(var y=0; y<eventCalls.length; y++) {
            if(typeof objCalls[x].event[eventCalls[y]]=="undefined") objCalls[x].event[eventCalls[y]]=[];
            for(var z=0; z<objCalls[x].event[eventCalls[y]].length; z++) {
                data.passed=objCalls[x].event[eventCalls[y]][z].passed;
                objCalls[x].event[eventCalls[y]][z].callback(data);
            }
        }
    }
});
System.Global.prototype.addEventListener=function(name, callback, passed) {
    if(typeof this.event[name]=="undefined") this.event[name]=[];
    this.event[name].push({
        callback: callback,
        passed: System.favor(passed, null)
    });
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
            graphics: this.graphics.getSend(),
            id: this.id
        };
    },

    //ADDS
    addEventListener: function(name, callback, component) {
        if(typeof this.event[name]=='undefined') this.event[name]=[];
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
    this.components=[];
}
Graphics.prototype={
    setBackground: function(color) {
        this.data.bg=color;
    },
    add: function(shape) {
        this.data.elements.push(shape);
    },
    addComponent: function(component) {
        this.components.push(component);
        for(var i=0; i<component.shapes.length; i++) {
            this.data.elements.push(component.shapes[i]);
        }
    },
    getSend: function() {
        return {
            data: this.data
        }
    }
};
function Shape(type, x, y, w, h, fc, sc, ss, e) {
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
    //Additional data (extra=e) 
    this.data.e=o(e, {});
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
function Component(sdata) {
    this.shapes=System.favor(sdata, []);
    this.id=Component.ID++;

    this.event={
        downOn: false
    };
}
Component.prototype={
    add: function(shape) {
        this.shapes.push(shape);
    }
};
Component.prototype.addEventListener=System.defaultAddEventListener;
Component.prototype.triggerEvent=System.defaultTriggerEvent;
Component.ID=0;
function Button(text, x, y, w, h) {
    w=w||Button.WIDTH;
    h=h||Button.HEIGHT;

    this.text=text;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;

    this.component=new Component();
    this.event=this.component.event;
    this.component.x=x;
    this.component.y=y;
    this.component.w=w;
    this.component.h=h;
    var addData={
        round: 5
    };
    var box1=new Shape(ShapeType.RECTANGLE, x, y, w, h, Button.FILL, Button.STROKE, Button.OUTLINE, addData);
    var box2=new Shape(ShapeType.RECTANGLE, x, y, w, h, Button.FILL, undefined, undefined, addData);
    var text=new Text(text, x+Button.WIDTH/2, y+Button.HEIGHT/2, {
        font: Button.FONT,
        baseline: TextBaseline.MIDDLE,
        align: TextAlign.CENTER
    }, "#000");
    this.component.add(box1);
    this.component.add(box2);
    this.component.add(text);
    this.shapes=this.component.shapes;


    this.addEventListener("mousedown", function(e) {
        e.component.event.downOn=true;
    });
    this.addEventListener("mouseup", function(e) {
        if(e.component.event.downOn) {
            e.component.triggerEvent("click", e);
        }
        e.component.event.downOn=false;
    });
    System.globalEventHandler.addEventListener("mouseup", function(e) {
        e.passed.event.downOn=false;
    }, this);
}
Button.prototype.addEventListener=Component.prototype.addEventListener;
Button.prototype.triggerEvent=Component.prototype.triggerEvent;

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