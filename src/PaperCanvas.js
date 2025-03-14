// Canvas component
import React from 'react';
import AppContext from './components/AppContext';
import paper from 'paper';
import mouseState from './mouseState';
import mouseMode from './mouseMode'
import patterns from './patterns/patterns.js'




class PaperCanvas extends React.Component {
  static contextType = AppContext;

  constructor(props) {

    super(props);
    this.divref = React.createRef();
    this.canvasRef = React.createRef();

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.resize = this.resize.bind(this);
    this.OnPaperParamChange = this.OnPaperParamChange.bind(this);

    this.temporesize = this.temporesize.bind(this);
    this.delayedresize = this.delayedresize.bind(this);
    this.resizeanddelay = this.resizeanddelay.bind(this);
    this.importSvg = this.importSvg.bind(this);
    this.addTxt = this.addTxt.bind(this);

    this.setMouseMode = this.setMouseMode.bind(this);
    this.setPositionCurrent = this.setPositionCurrent.bind(this);
    this.setAngleCurrent = this.setAngleCurrent.bind(this);
    this.setScaleCurrent = this.setScaleCurrent.bind(this);
    this.getScaleItem = this.getScaleItem.bind(this);

    this.exportJSON = this.exportJSON.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.testPaper1 = this.testPaper1.bind(this);
    this.testPaper2 = this.testPaper2.bind(this);
    this.testPaper3 = this.testPaper3.bind(this);
    this.testPaper4 = this.testPaper4.bind(this);
    this.testPaper5 = this.testPaper5.bind(this);
    this.loadPatterns = this.loadPatterns.bind(this);

    this.selected = null;

    this.rotate = false;
    this.mousemode = mouseMode.MOVE;
    this.zoom = 1;
    this.pixelRatio = 1;
    this.mousex = -1;
    this.mousey = -1;
    this.clicked_down = null;
    this.orig_scale = 1;
    this.timer = null;
    this.counter = 0;
    this.patternsvg = [];

    this.paperpattern = new paper.PaperScope();
    this.paperpattern.setup(new this.paperpattern.Size(512,512));

    /*
    this.saved_width = null;
    this.saved_height = null;
    this.timercheck = setInterval(() => {
      this.checksize();
    }, 1000);
    */
  }
  resize() {
    
    // force canvas to render 1px x 1px 
    this.forceCanvasPixelSize();

    // compute ratio from screen element size
    this.computeRatio();

    // apply computed ratio to paper rendering
    this.paperActiveLayerSetScaling(this.pixelRatio);

    return;
  }
  checksize() {
    if (this.saved_width === null) {
      this.saved_width = this.canvasRef.current.offsetWidth;
    }
    if (this.saved_height === null) {
      this.saved_height = this.canvasRef.current.offsetHeight;
    }
  }

  temporesize() {
    if (this.timer !== null) {

      clearInterval(this.timer);
      this.timer = null;
    }
    // hmm !! delayed some resize to respond to navigation resize !!!!
    this.counter = 2;
    this.timer = setInterval(() => {
      this.delayedresize();
    }, 100);

  }
  delayedresize() {
    if (this.counter > 0) {
      this.counter--;

    }
    else if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
      this.counter = 0;
    }

    this.resize();
  }
  OnPaperParamChange() {
    //console.log ("onpaperchange " + this.context.Params.Paper.width + " " + 
    //    this.context.Params.Paper.height + " " + 
    //    this.context.Params.Paper.usablewidth + " " + 
    //    this.context.Params.Paper.usableheight);
    this.resize();
    this.deleteFrame();
    this.initFrame();
  }
  forceCanvasPixelSize() {
    let canvasWidth = this.canvasRef.current.offsetWidth /*/ window.devicePixelRatio*/;
    let canvasHeight = this.canvasRef.current.offsetHeight /*/ window.devicePixelRatio*/;
    /*
    console.log("client canvas size = " + this.canvasRef.current.clientWidth + " " + this.canvasRef.current.clientHeight);
    console.log("brut canvas size = " + this.canvasRef.current.offsetWidth + " " + this.canvasRef.current.offsetHeight);
    console.log("parent div size = " + this.divref.current.clientWidth + " " + this.divref.current.clientHeight);
    console.log("computed canvas size = " + canvasWidth + " " + canvasHeight);
    console.log("window.devicePixelRatio = " + window.devicePixelRatio);
    console.log("view size " + this.paper.project.view.size);
    */
    //this.canvasRef.current.width = canvasWidth;
    //this.canvasRef.current.height = canvasHeight;
    this.paper.project.view.viewSize = [canvasWidth, canvasHeight];
  }
  computeRatio() {
    let canvasWidth = this.canvasRef.current.offsetWidth /*/ window.devicePixelRatio*/;
    let canvasHeight = this.canvasRef.current.offsetHeight /*/ window.devicePixelRatio*/;
    let xratio = canvasWidth / this.context.Params.Paper.width;
    let yratio = canvasHeight / this.context.Params.Paper.height;
    let pixelMillimeterRatio = Math.min(xratio, yratio);

    //let pixelMillimeterRatio = Math.min(canvasWidth / this.context.Params.Paper.width, canvasHeight / this.context.Params.Paper.height);
    /*
    console.log("canvas height " + this.canvasRef.current.width);
    console.log("canvas height " + this.canvasRef.current.height);
    console.log("canvas width " + this.canvasRef.current.clientWidth);
    console.log("canvas height " + this.canvasRef.current.clientHeight);
    console.log("canvas width " + this.canvasRef.current.offsetWidth);
    console.log("canvas height " + this.canvasRef.current.offsetHeight);
   
    console.log("paper compute ratio: paper width/height" + this.context.Params.Paper.width + " " + this.context.Params.Paper.height);
    console.log("view size " + this.paper.project.view.size);
    
    console.log("canvas size :" + canvasWidth + " " + canvasHeight);
    console.log("ratio :" + xratio + " " + yratio + " " + pixelMillimeterRatio);
    */

    this.zoom = 1;
    this.pixelRatio = pixelMillimeterRatio;
  }
  paperActiveLayerSetScaling(scaling) {
    // reset matrix transformation on global view
    this.paper.project.activeLayer.matrix.reset();

    // set the new scaling
    this.setScaling(scaling);

    // init some parameters in global view
    this.paper.project.activeLayer.name = "paper";
    this.paper.project.activeLayer.applyMatrix = false;
    this.paper.project.activeLayer.pivot = this.paper.project.activeLayer.bounds.center;
    this.paper.project.activeLayer.rotate(0);

    // reset matrix offset
    this.setOffset(0, 0);
  }

  getpatternsvg()
  {
    return this.patternsvg;
  }
  loadPatterns ()
  {
      this.patternsvg = [];
      for (let pat of patterns)
      {
        this.paperpattern.project.importSVG(pat.data, (item) => {
          console.log ("loaded pattern in offscreen canvas"+ pat.fname);
          item.strokeScaling = false;
          item.pivot = item.bounds.topLeft;
          item.name = pat.fname;
          item.position = new this.paper.Point(0,0);
          item.visible = false;
          this.patternsvg.push(item);
      });

        
      
    }
    console.log ("patterns loaded " + this.patternsvg);
  }

  initPaper() {
    // force canvas to render 1px x 1px 
    this.forceCanvasPixelSize();
    // compute aspect ratio
    this.computeRatio();
    // apply ratio on view
    this.paperActiveLayerSetScaling(this.pixelRatio);

    // setup callback for mouse events
    this.paper.view.on('mousemove', this.mouseMove);
    this.paper.view.on('mouseup', this.mouseUp);
    this.paper.view.on('mousedown', this.mouseDown);
  }
  initFrame() {
    let bounds = new this.paper.Path.Rectangle(0, 0, this.context.Params.Paper.width, this.context.Params.Paper.height);
    bounds.strokeWidth = 1;
    bounds.strokeColor = 'black';
    bounds.scaling = 1;
    bounds.strokeScaling = false;
    bounds.locked = true;
    bounds.name = "paperbox";
    this.paper.project.activeLayer.addChild(bounds);

    bounds = new this.paper.Path.Rectangle(0, 0, this.context.Params.Paper.usablewidth, this.context.Params.Paper.usableheight);
    bounds.strokeWidth = 1;
    bounds.strokeColor = 'red';
    bounds.scaling = 1;
    bounds.strokeScaling = false;
    bounds.locked = true;
    bounds.name = "utilbox";
    this.paper.project.activeLayer.addChild(bounds);

  }
  deleteFrame() {
    let todel = [];
    for (let i = 0; i < this.paper.project.activeLayer.children.length; i++) {
      //console.log("scan " + i);
      if (this.paper.project.activeLayer.children[i].locked === true) {
        todel.push(this.paper.project.activeLayer.children[i]);
        //console.log("delete " + i);
      }
    }
    todel.forEach(element => {
      //console.log("delete " + element);
      element.remove();
    });

  }

  componentDidMount() {

    this.paper = new paper.PaperScope();

    this.paper.setup(this.canvasRef.current);
    console.log(this.canvasRef.current);
    this.paper.activate();

    
    this.paper.settings.insertItems = true;
    this.paper.settings.handleSize = 8;

    this.initPaper();
    this.initFrame();
    this.context.SetPaper(this.paper);
    this.context.SetPaperCanvas(this);

    // setup callback event for canvas size update
    window.addEventListener('resize', () => {
      this.resizeanddelay();
    });
    //console.log ("componentdidMount papercanvas.js");
    this.resize();

    //register global resize callback
    this.context.SetResizeCB(this.resizeanddelay);
  }
  resizeanddelay() {
    //console.log ("resizeanddelay");
    this.resize();
    this.temporesize();
  }
  setMouseMode(val) {
    //this.rotate = val;
    this.mousemode = val;
  }
  getMouseMode() {
    //return this.rotate;
    return this.mousemode;
  }
  //
  // Set the x,y position of the selected item
  setPositionCurrent(x, y) {
    if (x === undefined || y === undefined)
      return;
    if (this.selected) {
      this.selected.position.x = x;
      this.selected.position.y = y;
      this.signalSelectedChange();
    }
  }
  //
  // Set scale of the selected item
  setScaleCurrent(s) {
    if (s === undefined)
      return;
    if (this.selected) {
      if (this.selected.className === "PointText") {
        // can't scale Braille
        return;
      }
      else {

        //
        // Big hack !!!
        // reverse previous scaling to avoid cumulative effect
        this.selected.scaling = 1 / this.selected.children[0].scaling.x;

        // apply scaling
        this.selected.scaling = s;

        /*
        if (this.selected.children.length > 0)
        {
          for (let i = 0; i < this.selected.children.length; i++)
          {
            console.log ("scaling " + i + ":" + this.selected.children[i].scaling + " " + this.selected.children[i].matrix);
          }
        }
        console.log ("scaling after:" + this.selected.scaling + " " + this.selected.matrix);
        */
        this.signalSelectedChange();
      }
    }
  }
  getScaleItem(item) {
    if (item)
      if (item.children)
        if (item.children.length > 0)
          return item.children[0].scaling.x;

    return 1;
  }
  //
  // set rotation angle of the selected item
  //
  setAngleCurrent(a) {
    if (a === undefined)
      return;
    if (this.selected) {
      let current = 0;
      let rotation_point = new this.paper.Point(0, 0);

      if (this.selected.className !== "PointText") {
        rotation_point.x = this.selected.bounds.center.x;
        rotation_point.y = this.selected.bounds.center.y;
      }
      else {
        rotation_point.x = this.selected.position.x;
        rotation_point.y = this.selected.position.y;
      }
      if (this.selected.children)
        current = this.selected.children[0].rotation;
      else
        current = this.selected.rotation;
      this.selected.rotate(a - current, rotation_point);
      this.signalSelectedChange();
    }
  }

  deselectChildren(element) {
    if (element.bounds)
      element.bounds.selected = false;
    if (element.children)
      for (let i = 0; i < element.children.length; i++) {
        element.children[i].selected = false;
        if (element.children[i].bounds)
          element.children[i].bounds.selected = false;
        if (element.children[i].children) this.deselectChildren(element.children[i]);
      }
  }
  deselectAll() {
    this.paper.project.deselectAll();
    this.deselectChildren(this.paper.project.activeLayer);
    if (this.selected)
      this.selected.bounds.select = false;
    this.selected = null;
    this.signalSelectedChange();
  }

  EnumeratePaperItem(item, callback) {
    if (!item.visible || item.locked === true)
      return;

    if (item.className === 'Shape') {
      callback(item);
    }

    if ((item.className === 'Path' ||
      item.className === 'CompoundPath') && item.strokeWidth > 0.001) {
      callback(item);
    }

    if (!item.children) {
      return;
    }
    for (let child of item.children) {
      this.EnumeratePaperItem(child, callback);
    }
  }

  getStrokeColorList() 
  {
    let fcolors = {};
    let colorlist = [];
    this.EnumeratePaperItem(this.paper.project.activeLayer, (item) => {

      if (item.strokeColor) {
        let csscolor = 'rgb(' + Math.round(item.strokeColor.red * 255) + ',' + Math.round(item.strokeColor.green * 255) + ',' + Math.round(item.strokeColor.blue * 255) + ')';
        fcolors[item.strokeColor] = csscolor;
      }
    });
    
    for (const color in fcolors) {
      colorlist.push ({color:color, csscolor:fcolors[color]});
    }
    console.log (colorlist);
    return (colorlist);
  }
  getFillColorList() 
  {
    let fcolors = {};
    let colorlist = [];
    this.EnumeratePaperItem(this.paper.project.activeLayer, (item) => {

      if (item.fillColor) {
        // todo: take account of alpha channel
        let csscolor = '';
        if (item.fillColor.alpha) {
          csscolor = 'rgb(' + Math.round(item.fillColor.red * 255) + ',' 
          + Math.round(item.fillColor.green * 255) + ',' 
          + Math.round(item.fillColor.blue * 255) + ',' 
          + Math.round(item.fillColor.alpha * 255) + ')';    
        }
        else
        {
          csscolor = 'rgb(' + Math.round(item.fillColor.red * 255) + ',' + Math.round(item.fillColor.green * 255) + ',' + Math.round(item.fillColor.blue * 255) + ')';  
          
        }
        
        fcolors[item.fillColor] = csscolor;
      }
    });
    
    for (const color in fcolors) {
      console.log ("color :" + color);
      colorlist.push ({color:color, csscolor:fcolors[color]});
    }
    console.log (colorlist);
    return (colorlist);
  }

  addTxt(txt) 
  {
    this.deselectAll();

    let text = new paper.PointText({
      point: [this.context.Params.Paper.width / 2,
      this.context.Params.Paper.height / 2],
      justification: 'left',
      content: txt,
      fillColor: '#00000080',
      fontFamily: 'Courier New',
      fontWeight: 'bold',
      fontSize: 11
    });
    text.applyMatrix = false;
    text.selected = false;
    text.bounds.selected = false;
    text.pivot = [0, -10];
    text.locked = false;
    this.paper.project.activeLayer.addChild(text);
    this.selected = null;

    this.signalSelectedChange();
  }

  importSvg(data, fname) {

    let isvg = this.paper.project.importSVG(data, (item) => {

      item.strokeScaling = false;
      item.pivot = item.bounds.topLeft;

      item.position = new this.paper.Point((this.context.Params.Paper.width - item.bounds.width) / 2,
        (this.context.Params.Paper.height - item.bounds.height) / 2);

      let mmPerPixels = 1;

      item.scale(mmPerPixels);
      item.bounds.selected = false;
      
      if (item.bounds.width > this.context.Params.Paper.width ||
        item.bounds.height > this.context.Params.Paper.height) {
        let scale = Math.min(this.context.Params.Paper.width / item.bounds.width,
          this.context.Params.Paper.height / item.bounds.height);
        item.scaling = scale;
        item.position.x = 0;
        item.position.y = 0;

      }

      item.name = fname;
      item.locked = false;

      return item;
    });

    this.paper.project.activeLayer.addChild(isvg);

    //isvg.bounds.selected = true;
    return isvg;
  }

  DeleteAll() {

    this.paper.activate();
    this.deselectAll();
    this.selected = null;
    this.paper.project.clear();
    this.initPaper();


    this.paper.project.activeLayer.applyMatrix = false;
    this.paper.project.activeLayer.scaling = this.pixelRatio;
    this.paper.project.activeLayer.pivot = this.paper.project.activeLayer.bounds.center;

    this.deleteFrame();
    this.initFrame();
    //this.paper.view.draw();
  }
  SelectedDelete() {
    if (this.selected) {
      this.selected.remove();
      this.selected = null;
      this.signalSelectedChange();
    }
  }
  SelectedUp() {
    if (this.selected) {
      this.selected.bringToFront();
    }
  }
  SelectedDown() {
    if (this.selected) {
      this.selected.sendToBack();
    }
  }

  handleKeyPress(event) {
    console.log(`Key "${event.key}" pressed [event: keydown]`)
  }

  exportJSON() {
    this.paper.activate();
    this.deselectAll();

    this.deleteFrame();
    let data = this.paper.project.exportJSON({
      precision: 2,
      asString: true
    });
    this.initFrame();
    return data;
  }

  importJSON(data) {

    this.paper.activate();
    this.paper.project.clear();
    this.initPaper();

    // save active layer id before importing
    const prevlayerid = this.paper.project.activeLayer.id;

    // import data

    this.paper.project.importJSON(data);

    // remove old empty layer
    for (let i = 0; i < this.paper.project.layers.length; i++) {
      if (this.paper.project.layers[i].id === prevlayerid) {

        this.paper.project.layers[i].remove();
        break;
      }
    }

    // reset new layer transform matrix
    this.paper.project.activeLayer.matrix.reset();

    this.paper.project.activeLayer.applyMatrix = false;
    this.paper.project.activeLayer.pivot = this.paper.project.activeLayer.bounds.topLeft;
    this.paper.project.activeLayer.scaling = this.pixelRatio;

    // rebuild paper frame
    this.deleteFrame();
    this.initFrame();
    this.temporesize();
    //this.paper.view.draw();
  }

  signalSelectedChange() {
    if (this.selected) {
      this.context.setPosition([this.selected.position.x, this.selected.position.y]);
      this.context.setSize([this.selected.bounds.width, this.selected.bounds.height]);
      this.context.setSelected(this.selected);

      this.context.setAngle(this.getPaperItemAngle(this.selected));
      this.context.setScale(this.getPaperItemScalePercent(this.selected));
    }
    else
      this.context.setSelected(null);
  }
  getPaperItemAngle(item) {
    if (item.children)
      return (item.children[0].rotation);

    return (item.rotation);
  }
  getPaperItemScalePercent(item) {
    if (item.children)
      return (item.children[0].scaling.x * 100);

    return (item.scaling.x * 100);
  }
  mouseMove(event) {
    this.mousex = event.point.x / this.paper.project.activeLayer.scaling.x;
    this.mousey = event.point.y / this.paper.project.activeLayer.scaling.y;

    if (this.selected && this.mouse_state === mouseState.MOVE) {
      //if (!this.rotate) 
      switch (this.mousemode) {
        case mouseMode.MOVE:
          {
            //let delta = this.paper.project.activeLayer.globalToLocal(event.delta)
            let delta = event.delta;
            delta.x = event.delta.x / this.paper.project.activeLayer.scaling.x;
            delta.y = event.delta.y / this.paper.project.activeLayer.scaling.y;

            this.selected.translate(delta);
            this.signalSelectedChange();

          }
          break;
        //}
        //else {
        case mouseMode.ROTATE:
          {
            let mousepos = new this.paper.Point(0, 0);
            mousepos.x = event.point.x / this.paper.project.activeLayer.scaling.x;
            mousepos.y = event.point.y / this.paper.project.activeLayer.scaling.y;

            let delta = new this.paper.Point(0, 0);
            delta.x = event.delta.x / this.paper.project.activeLayer.scaling.x;
            delta.y = event.delta.y / this.paper.project.activeLayer.scaling.y;

            let start = new this.paper.Point(0, 0);
            start.x = mousepos.x - delta.x;
            start.y = mousepos.y - delta.y;

            let v1 = new this.paper.Point(0, 0);
            let v2 = new this.paper.Point(0, 0);
            let rotation_point = new this.paper.Point(0, 0);

            if (this.selected.className !== "PointText") {
              rotation_point.x = this.selected.bounds.center.x;
              rotation_point.y = this.selected.bounds.center.y;
            }
            else {
              rotation_point.x = this.selected.position.x;
              rotation_point.y = this.selected.position.y;
            }
            v1.x = start.x - rotation_point.x;
            v1.y = start.y - rotation_point.y;
            v2.x = mousepos.x - rotation_point.x;
            v2.y = mousepos.y - rotation_point.y;

            this.selected.rotate(v2.angle - v1.angle, rotation_point);

            this.signalSelectedChange();
          }
          break;
        case mouseMode.SCALE:
          {
            if (this.selected.className === "PointText")
              return; // cant scale Braille

            let orig_dist = this.clicked_down.getDistance(this.selected.bounds.topLeft);
            let new_dist = this.paper.project.activeLayer.globalToLocal(event.point).getDistance(this.selected.bounds.topLeft);
            let ratio = this.orig_scale;
            if (orig_dist !== 0)
              ratio = (new_dist * this.orig_scale) / orig_dist;
            this.setScaleCurrent(ratio);
            this.signalSelectedChange();
          }
          break;
        default:
          console.error("Incorrect value in this.mousemode");
          break;
      }

    }
  }

  mouseUp(event) {
    this.mouse_state = mouseState.NONE;
  }
  mouseDown(event) {
    if (this.selected) {
      this.clicked_down = this.paper.project.activeLayer.globalToLocal(event.point);
      this.orig_scale = this.getScaleItem(this.selected);
      let handle = this.selected.hitTest(
        this.clicked_down,
        {
          handles: true,
          selected: true,
          bounds: true,
          tolerance: this.paper.settings.handleSize
        }
      );
      //console.log('handle ' + handle);
      if (handle) {
        console.log('handle hit');
      } else {
        handle = this.selected.hitTest(
          this.paper.project.activeLayer.globalToLocal(event.point)
        );
        if (handle) {
          this.mouse_state = mouseState.MOVE;
        } else {
          if (this.selected.bounds.contains(this.paper.project.activeLayer.globalToLocal(event.point))) {
            this.mouse_state = mouseState.MOVE;
          }
          else
            this.deselectAll();
        }
      }
    } else {
      let clicked = this.paper.project.activeLayer.hitTest(event.point,
        {
          stroke: true,
          bounds: true,
          fill: true,
          tolerance: this.paper.settings.hitTolerance
        });
      if (!clicked) {

        this.paper.project.getItem({
          recursive: true,
          bounds: bounds => bounds.contains(this.paper.project.activeLayer.globalToLocal(event.point)),
          match: item => {

            if (item.locked === false && item.className !== "Layer") {
              if (!clicked || item.isAbove(clicked)) {
                clicked = item;
              }
            }
            return false;
          },
        });
        let mousepos = new this.paper.Point(event.point);
        mousepos.x = event.point.x / this.paper.project.activeLayer.scaling.x;
        mousepos.y = event.point.y / this.paper.project.activeLayer.scaling.y;

        console.log(mousepos);
        console.log(this.paper.project.activeLayer.globalToLocal(event.point));
        console.log(event.point);
        console.log(clicked);
      }
      let item = null;
      if (clicked) {
        if (clicked.item)
          item = clicked.item;
        else
          item = clicked;
      }
      if (item) {

        console.log('clicked:' + item);

        // get svg fom item
        while (item.parent != null) {
          if (item.parent.className === 'Layer') break;

          item = item.parent;
          //console.log(item.className);
        }
        console.log(item.className);
        item.bounds.selected = true;
        this.selected = item;

        this.signalSelectedChange();


      } else {
        this.deselectAll();
      }
    }

  }
  setOffset(x, y) {
    let mat = this.paper.project.activeLayer.matrix;
    mat.tx = x;
    mat.ty = y;
    this.paper.project.activeLayer.matrix = mat;
  }
  setScaling(s) {
    let mat = this.paper.project.activeLayer.matrix;
    mat.a = s;
    mat.d = s;
    this.paper.project.activeLayer.matrix = mat;
  }
  testPaper1() {

    let canvasWidth = this.canvasRef.current.offsetWidth /*/ window.devicePixelRatio*/;
    let canvasHeight = this.canvasRef.current.offsetHeight /*/ window.devicePixelRatio*/;
    //let xratio = canvasWidth / this.context.Params.Paper.width;
    //let yratio = canvasHeight / this.context.Params.Paper.height;
    //let pixelMillimeterRatio = Math.min(xratio, yratio);
    //this.canvasRef.current.width = this.canvasRef.current.offsetWidth;
    //this.canvasRef.current.height = this.canvasRef.current.offsetHeight;
    this.paper.view.viewSize = [canvasWidth, canvasHeight];
  }
  testPaper2() {
    // getc context
    let ctx = this.canvasRef.current.getContext('2d');
    console.log(ctx);
    console.log(ctx.getTransform());
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "blue";
    ctx.moveTo(0, 0); // Begin first sub-path
    ctx.lineTo(2048, 2048);
    ctx.strokeStyle = "yellow";
    ctx.moveTo(0, 0); // Begin second sub-path
    ctx.lineTo(this.context.Params.Paper.width, this.context.Params.Paper.height);
    ctx.moveTo(0, -10); // Begin second sub-path
    ctx.lineTo(this.context.Params.Paper.width * 2, this.context.Params.Paper.height * 2 - 10);

    ctx.moveTo(0, this.context.Params.Paper.height * this.pixelRatio); // Begin second sub-path
    ctx.lineTo(this.context.Params.Paper.width * this.pixelRatio, this.context.Params.Paper.height * this.pixelRatio); // Begin second sub-path
    ctx.lineTo(this.context.Params.Paper.width * this.pixelRatio, 0); // Begin second sub-path
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "orange";
    for (let i = 0; i < 9; i++) {
      ctx.moveTo(i * 100 + 20, i * 100 + 20);
      ctx.lineTo(i * 100 + 20, i * 100 + 120);
      ctx.lineTo(i * 100 + 120, i * 100 + 120);
      ctx.lineTo(i * 100 + 120, i * 100 + 20);
      ctx.lineTo(i * 100 + 20, i * 100 + 20);

    }
    ctx.stroke();
  }
  testPaper3() {
    let bounds = new this.paper.Path.Rectangle(0, 0, this.context.Params.Paper.width, this.context.Params.Paper.height);
    bounds.strokeWidth = 1;
    bounds.strokeColor = 'green';
    bounds.scaling = 1;
    bounds.strokeScaling = false;
    bounds.locked = true;
    bounds.name = "paperbox";

    let line = new this.paper.Path.Line(0, 0, this.context.Params.Paper.width, this.context.Params.Paper.height);
    line.strokeWidth = 1;
    line.strokeColor = 'green';
    line.scaling = 1;
    line.strokeScaling = false;
    line.locked = true;
    this.paper.project.activeLayer.addChild(bounds);
    this.paper.project.activeLayer.addChild(line);

    bounds = new this.paper.Path.Rectangle(100, 100, 100, 100);
    bounds.strokeWidth = 1;
    bounds.strokeColor = 'green';
    bounds.scaling = 1;
    bounds.strokeScaling = false;
    bounds.selected = true;
    bounds.locked = true;
    bounds.name = "testbox";
    this.paper.project.activeLayer.addChild(bounds);
  }
  testPaper4() {


    let size = this.paper.view.viewSize;
    let bounds = new this.paper.Path.Rectangle(0, 0, size.width / this.pixelRatio, size.height / this.pixelRatio);
    console.log("papersize =" + this.paper.view.size);
    console.log("ratio " + this.pixelRatio);
    console.log("size = " + size.width / this.pixelRatio + " " + size.height / this.pixelRatio);

    bounds.strokeWidth = 8;
    bounds.strokeColor = 'red';
    bounds.scaling = 1;
    bounds.strokeScaling = false;
    bounds.locked = true;
    bounds.name = "paperbox";
    this.paper.project.activeLayer.addChild(bounds);
  }
  testPaper5() {
    this.resize();
  }

  renderDebug(render) {


    return (
      <>
        <button onClick={this.testPaper1} className="pure-button">Test paper 1</button>
        <button onClick={this.testPaper2} className="pure-button">Test paper 2</button>
        <button onClick={this.testPaper3} className="pure-button">Test paper 3</button>
        <button onClick={this.testPaper4} className="pure-button">Test paper 4</button>
        <button onClick={this.testPaper5} className="pure-button">Test paper 5</button>
      </>
    );
  }
  render() {

    return (
      <>
        <div id="falsediv" ref={this.divref} >
          <canvas id={this.props.Id} ref={this.canvasRef} onKeyDown={this.handleKeyPress} resize hdpi>
            {this.props.children}
          </canvas>

        </div>
        {/*this.renderDebug()*/}
      </>
    );
  }
}
export default PaperCanvas;