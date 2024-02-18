import React from 'react';
import AppContext from './AppContext';
import paper from 'paper';
import BrailleToGeometry from './BrailleToGeometry';
import GeomToGCode from './GeomToGCode';
import DotGrid from './dotgrid';
import GeomPoint from './GeomPoint';
import FileSaver from 'file-saver';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Print extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      comevent: "",
      printstatus: ""
    };

    this.canvasRef = React.createRef();
    this.resize = this.resize.bind(this);
    //this.toto = this.props.GetPaperCanvas ();
    this.paperwidth = this.props.params.Paper.width;
    this.paperheight = this.props.params.Paper.height;
    this.usablewidth = this.props.params.Paper.usablewidth;
    this.usableheight = this.props.params.Paper.usableheight;
    this.stepvectormm = this.props.params.Paper.stepvectormm;
 
    this.ptcloud = [];

    
    this.HandleDownload = this.HandleDownload.bind(this);
    this.HandleRefresh = this.HandleRefresh.bind(this);
    this.HandlePrint = this.HandlePrint.bind(this);
  }
  
  componentDidMount() {
    console.log("preview component " + this.context.Params.comport);


    //paper.setup(canvasRef.current);
    this.paper = new paper.PaperScope();
    this.paper.setup(this.canvasRef.current);
    console.log("prewiew canvas" + this.canvasRef.current);


    console.log("loaded");
    this.paper.settings.insertItems = false;
    this.paper.settings.handleSize = 8;

    this.initPaper();

    //this.context.SetPaper ("blabla toto it work");
    this.buildpage();
  }
  initPaper ()
  {
    let canvasWidth = this.canvasRef.current.width / window.devicePixelRatio;
    let canvasHeight = this.canvasRef.current.height / window.devicePixelRatio;

    let pixelMillimeterRatio = Math.min(canvasWidth / this.paperwidth, canvasHeight / this.paperheight);
    console.log("canvas width " + this.canvasRef.current.width);
    console.log("win ratio " + window.devicePixelRatio);
    console.log("pix ratio:" + pixelMillimeterRatio);

    this.paper.project.activeLayer.applyMatrix = false;
    this.paper.project.activeLayer.scaling = pixelMillimeterRatio;
    this.paper.project.activeLayer.pivot = this.paper.project.activeLayer.bounds.center;
    this.zoom = 1;
    this.pixelRatio = pixelMillimeterRatio;

    //this.paper.project.activeLayer.position = new this.paper.Point(0,0);
    this.paper.project.activeLayer.rotate(0);



    let bounds = new this.paper.Path.Rectangle(0, 0, this.paperwidth, this.paperheight);
    bounds.strokeWidth = 1;
    bounds.strokeColor = 'black';
    bounds.scaling = 1;
    bounds.strokeScaling = false;
    this.paper.project.activeLayer.addChild(bounds);

    bounds = new this.paper.Path.Rectangle(0, 0, this.usablewidth, this.usableheight);
    bounds.strokeWidth = 1;
    bounds.strokeColor = 'red';
    bounds.scaling = 1;
    bounds.strokeScaling = false;
    this.paper.project.activeLayer.addChild(bounds);


    let text = new paper.PointText({
      point: [105, 140],
      justification: 'center',
      content: 'Preview',
      fillColor: '#80000090',
      fontFamily: 'Courier New',
      fontWeight: 'bold',
      fontSize: 10,
      pivot: [0, -10]
      
    });
    text.selected = false;
    text.bounds.selected = false;
    text.applyMatrix = false;
    //text.pivot = [0, -10];
    //this.paper.project.activeLayer.addChild(text);


    //window.addEventListener('resize', () => {
    //  this.resize ();
    //});
  }
  resize() {
    return;
    if (this.canvasRef !== null && this.canvasRef.current !== null) {
      let canvasWidth = this.canvasRef.current.clientWidth / window.devicePixelRatio;
      let canvasHeight = this.canvasRef.current.clientHeight / window.devicePixelRatio;

      let pixelMillimeterRatio = Math.min(canvasWidth / this.paperwidth, canvasHeight / this.paperheight);
      console.log("canvas width " + this.canvasRef.current.clientWidth);
      console.log("canvas height " + this.canvasRef.current.clientHeight);
      console.log("win ratio " + window.devicePixelRatio);
      console.log("pix ratio:" + pixelMillimeterRatio);

      // this.paper.activate ();
      // this.paper.project.activeLayer.applyMatrix = false;
      // this.paper.project.activeLayer.scaling = pixelMillimeterRatio;
      // this.paper.project.activeLayer.pivot = this.paper.project.activeLayer.bounds.center;
      this.zoom = 1;
      this.pixelRatio = pixelMillimeterRatio;
      this.paper.activate();
      this.paper.project.activeLayer.scaling = pixelMillimeterRatio;
      // quick and dirty hack !!!!!!
      /*
      if (this.context.GetPaperCanvas)
      {
        let canv = this.context.GetPaperCanvas ();
        if (canv)
          canv.resize ();
      }
      */
    }
  }

  buildpage() {
    let canv = this.context.GetPaperCanvas();
    if (canv) {
      let gcode = "";
      let GeomBraille = [];
      let GeomVector = [];

      let b = new BrailleToGeometry();

      let bounds = canv.paper.project.activeLayer.bounds;
      let element = canv.paper.project.activeLayer;
      this.plotItem(element, gcode, bounds, GeomBraille, GeomVector);

      let f = new DotGrid(this.usablewidth, this.usableheight, 5, 5);
      f.setarray(GeomBraille);
      let FilteredVector = f.filter(GeomVector);

      GeomBraille = GeomBraille.concat(FilteredVector);
      let sorted = b.SortGeomZigZag(GeomBraille);
      
      this.ptcloud = sorted;  // save dots for printing
      
      // display dots on preview
      for (let i = 0; i < sorted.length; i++) {

        let dot = new this.paper.Path.Circle(new this.paper.Point(sorted[i].x, sorted[i].y), 0.5);
        dot.strokeWidth = 1;
        dot.strokeColor = 'black';
        dot.scaling = 1;
        dot.strokeScaling = false;
        dot.fillColor = 'black';
        this.paper.project.activeLayer.addChild(dot);

        /*
         let text = new paper.PointText({
           point: [sorted[i].x, sorted[i].y],
           justification: 'center',
           content: i.toString(),
           fillColor: '#80000090',
           fontFamily: 'Courier New',
           fontWeight: 'light',
           fontSize: 3,
           pivot: [0, -6]
         });
         text.selected = false;
         text.bounds.selected = false;
         text.applyMatrix = false;
         //text.pivot = [0, -10];
         this.paper.project.activeLayer.addChild(text);
         */
      }

    }
  }
  itemMustBeDrawn(item) {
    return (item.strokeWidth > 0 && item.strokeColor != null) || item.fillColor != null;
  }

  plotItem(item, gcode, bounds, GeomBraille, GeomVector) {
    if (!item.visible) {
      return
    }


    console.log("plot:" + item.className);
    if (item.className === 'Shape') {
      let shape = item
      if (this.itemMustBeDrawn(shape)) {
        let path = shape.toPath(true)
        item.parent.addChildren(item.children)
        item.remove()
        item = path
      }
    }
    if (item.locked === true)
      return;
    if ((item.className === 'PointText')) {
      if (this.props.louis.isInit()) {
        let g = new BrailleToGeometry();

        let transcript = this.props.louis.unicode_translate_string(item.content, 70);
        
        let v = new this.paper.Point(item.handleBounds.topRight.x - item.handleBounds.topLeft.x,
          item.handleBounds.topRight.y - item.handleBounds.topLeft.y);

        let n = new this.paper.Point(item.handleBounds.bottomLeft.x - item.handleBounds.topLeft.x,
          item.handleBounds.bottomLeft.y - item.handleBounds.topLeft.y
        );

        v = v.rotate(item.rotation);
        n = n.rotate(item.rotation);
        v = v.normalize();
        n = n.normalize();
        //console.log("n " + n + " v " + v + " " + item.rotation);

        let pts = g.BrailleStringToGeom(transcript, item.position.x, item.position.y, v.x, v.y, n.x, n.y);

        for (let i = 0; i < pts.length; i++)
          GeomBraille.push(pts[i]);
        //GeomBraille.concat(pts);

      }
    }
    if ((item.className === 'Path' ||
      item.className === 'CompoundPath') && item.strokeWidth > 0.001 && item.id > 2) {
      let path = item

      if (path.segments != null) {
        for (let i = 0; i < path.length; i += this.stepvectormm) {
          //dotAt(path.getPointAt(i), gcode, bounds, i + braille.svgStep >= path.length)
          let dot = new this.paper.Path.Circle(path.getPointAt(i), 1);
          /*
          dot.strokeWidth = 1;
          dot.strokeColor = 'black';
          dot.scaling = 1;
          dot.strokeScaling = false;
          dot.fillColor = 'black';
          this.paper.project.activeLayer.addChild(dot);
          */

          GeomVector.push(new GeomPoint(dot.position.x, dot.position.y));
        }
      }
    }
    if (item.children == null) {
      return;
    }
    for (let child of item.children) {
      this.plotItem(child, gcode, bounds, GeomBraille, GeomVector)
    }
  }
  HandleRefresh() {
    this.paper.project.clear();
    this.initPaper();
    this.buildpage();
  }
  HandleDownload() {
    if (this.ptcloud.length > 0)
    {
      let gcoder = new GeomToGCode();
      gcoder.GeomToGCode(this.ptcloud);
      let gcode = gcoder.GetGcode();
      //console.log (gcode);
      let blob = new Blob([gcode], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, "braille.gcode");
    }
  }
  HandlePrint() {
    if (this.ptcloud.length > 0 && this.props.webviewready === true)
    {
      let gcoder = new GeomToGCode();
      gcoder.GeomToGCode(this.ptcloud);
      let gcode = gcoder.GetGcode();
      //console.log (gcode);
      // request backend to print gcode
    window.pywebview.api.PrintGcode(gcode, this.props.options.comport).then(status => {
      // remove modal status screen
      
      console.log(status);
      this.setState({ showModal: false, printstatus: status });
      // set a timer to call setstate with a little delay
      // because form change are disabled for screen reader due to
      // modal status box
      this.timer = setInterval(() => {
        this.StatusPrintEnd();
      }, 500);
    }
    );  
    }
  }
  StatusPrintEnd() {
    if (this.timer)
      clearInterval(this.timer);
    let msg = "Impression terminée " + this.state.printstatus;
    this.setState({ comevent: msg });
  }
  render() {
    return (
      <>

        <div className="Print">

          
          <div className="PrintCanvas">
            <canvas id="previewid" ref={this.canvasRef} hdmi resize>

            </canvas>
          </div>
          <div className="PrintTitle">
            <h3>Apercu avant impression</h3>
            <button className ="pure-button " onClick={this.HandleDownload}>
            <FontAwesomeIcon icon={icon({name: 'download', family: 'classic', style: 'solid'})} />
            &nbsp;Download
            </button>
            &nbsp;
            <button className ="pure-button  " onClick={this.HandlePrint}>
            <FontAwesomeIcon icon={icon({name: 'print', family: 'classic', style: 'solid'})} />
            &nbsp;Print
            </button>
            &nbsp;
            <button className ="pure-button " onClick={this.HandleRefresh}>
            <FontAwesomeIcon icon={icon({name: 'rotate-right', family: 'classic', style: 'solid'})} />
            &nbsp;Refresh
            </button>
          </div>
        </div>
      </>


    );
  }
};

export default Print;