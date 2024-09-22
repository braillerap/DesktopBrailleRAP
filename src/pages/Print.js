import React from 'react';
import AppContext from '../components/AppContext';
import paper from 'paper';
import BrailleToGeometry from '../braillegeometry/BrailleToGeometry';
import GeomToGCode from '../braillegeometry/GeomToGCode';
import DotGrid from '../braillegeometry/dotgrid';
import GeomPoint from '../braillegeometry/GeomPoint';
import FileSaver from 'file-saver';
import Modal from 'react-modal'
import { FaArrowRotateRight } from "react-icons/fa6";
import { FaPrint } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa6";


class Print extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      comevent: "",
      printstatus: "",
      cancelprint: false,
      rightdim:[0,0]
    };

    this.canvasRef = React.createRef();

    this.ptcloud = [];

    this.HandleDownload = this.HandleDownload.bind(this);
    this.HandleRefresh = this.HandleRefresh.bind(this);
    this.HandlePrint = this.HandlePrint.bind(this);
    this.CancelPrint = this.CancelPrint.bind(this);
    this.resize = this.resize.bind(this);
    this.counter = 0;
  }

  componentDidMount() {

    //paper.setup(canvasRef.current);
    this.paper = new paper.PaperScope();
    this.paper.setup(this.canvasRef.current);

    this.paper.settings.insertItems = false;
    this.paper.settings.handleSize = 8;

    this.initPaper();
    this.buildpage();
  }
  initPaper() {
    let canvasWidth = this.canvasRef.current.offsetWidth /*/ window.devicePixelRatio*/;
    let canvasHeight = this.canvasRef.current.offsetHeight /*/ window.devicePixelRatio*/;
    let xratio = canvasWidth / this.context.Params.Paper.width;
    let yratio = canvasHeight / this.context.Params.Paper.height;
    let pixelMillimeterRatio = Math.min(xratio, yratio);
    
    //let pixelMillimeterRatio = Math.min(canvasWidth / this.context.Params.Paper.width, canvasHeight / this.context.Params.Paper.height);
    console.log("canvas width " + this.canvasRef.current.offsetWidth + " height "+ this.canvasRef.current.offsetHeight);
    console.log("win ratio " + window.devicePixelRatio);
    console.log("pix ratio:" + pixelMillimeterRatio);

    this.paper.project.activeLayer.applyMatrix = false;
    console.log("paper ratio ratio " + this.paper.project.activeLayer.scaling);
    this.paper.project.activeLayer.scaling = pixelMillimeterRatio;
    console.log("paper ratio  " + this.paper.project.activeLayer.scaling);
    this.paper.project.activeLayer.pivot = this.paper.project.activeLayer.bounds.center;
    this.paper.view.viewSize = [canvasWidth, canvasHeight];
    this.zoom = 1;
    this.pixelRatio = pixelMillimeterRatio;
    this.setState({rightdim:[this.canvasRef.current.offsetWidth,this.canvasRef.current.offsetHeight]});
    let bounds = new this.paper.Path.Rectangle(0, 0, this.context.Params.Paper.width, this.context.Params.Paper.height);
    bounds.name = "Paper";
    bounds.strokeWidth = 1;
    bounds.strokeColor = 'black';
    bounds.scaling = 1;
    bounds.strokeScaling = false;
    this.paper.project.activeLayer.addChild(bounds);

    let bounds2 = new this.paper.Path.Rectangle(0, 0, this.context.Params.Paper.usablewidth, this.context.Params.Paper.usableheight);
    bounds2.name = "Usable";
    bounds2.strokeWidth = 1;
    bounds2.strokeColor = 'red';
    bounds2.scaling = 1;
    bounds2.strokeScaling = false;
    this.paper.project.activeLayer.addChild(bounds2);

    /*
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
    text.pivot = [0, -10];
    this.paper.project.activeLayer.addChild(text);
    */


  }

  resize() {
    this.setState({"dimension":[this.canvasRef.current.offsetWidth,this.canvasRef.current.offsetHeight]});
    return;

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

      let f = new DotGrid(this.context.Params.Paper.usablewidth,
        this.context.Params.Paper.usableheight,
        this.context.Params.stepvectormm,
        this.context.Params.stepvectormm);
      f.setarray(GeomBraille);
      let FilteredVector = f.filter(GeomVector);

      GeomBraille = GeomBraille.concat(FilteredVector);
      let sorted = [];
      if (this.context.Params.ZigZagBloc === true) {
        sorted = b.SortGeomZigZagBloc(GeomBraille);
      }
      else
        sorted = b.SortGeomZigZag(GeomBraille);

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
      }

    }
  }

  itemMustBeDrawn(item) {
    return (item.strokeWidth > 0 && item.strokeColor != null) || item.fillColor != null;
  }
  #reverse_string (str)
  {
      var rev = "";
      for (var i = str.length - 1; i >= 0; i--) {
          rev += str[i];
      }
      return rev;
  }
  plotItem(item, gcode, bounds, GeomBraille, GeomVector) {
    if (!item.visible) {
      return
    }

    if (item.className === 'Shape') {
      // element is shape => convert to path
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
      // element is text => convert in Braille
      if (this.props.louis.isInit()) {
        let g = new BrailleToGeometry();

        // TODO : build a true translator to avoid inline translation
        let transcript = this.props.louis.unicode_translate_string(item.content, this.context.Params.brailletbl);
        if (this.context.GetBrailleReverse()) // some language : ie ARABIC are ltr language but RTL in Braille
          transcript = this.#reverse_string (transcript );

        let v = new this.paper.Point(item.handleBounds.topRight.x - item.handleBounds.topLeft.x,
          item.handleBounds.topRight.y - item.handleBounds.topLeft.y);

        let n = new this.paper.Point(item.handleBounds.bottomLeft.x - item.handleBounds.topLeft.x,
          item.handleBounds.bottomLeft.y - item.handleBounds.topLeft.y
        );

        v = v.rotate(item.rotation);
        n = n.rotate(item.rotation);
        v = v.normalize();
        n = n.normalize();

        let pts = g.BrailleStringToGeom(transcript, item.position.x, item.position.y, v.x, v.y, n.x, n.y);

        for (let i = 0; i < pts.length; i++)
          GeomBraille.push(pts[i]);
      }
    }
    if ((item.className === 'Path' ||
      item.className === 'CompoundPath') && item.strokeWidth > 0.001) {
      let path = item
      // item is path => build dots positions along all vectors
      if (path.segments != null) {
        for (let i = 0; i < path.length; i += this.context.Params.stepvectormm) {
          let dot = new this.paper.Path.Circle(path.getPointAt(i), 1);
          //GeomVector.push(new GeomPoint(dot.position.x, dot.position.y));
          // push in front to reverse Z order
          GeomVector.unshift(new GeomPoint(dot.position.x, dot.position.y));
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
    if (this.ptcloud.length > 0) {
      let gcoder = new GeomToGCode(this.context.Params.Speed,
        this.context.Params.Accel);
      // generate GCODE
      gcoder.GeomToGCode(this.ptcloud);
      let gcode = gcoder.GetGcode();

      // write gcode in file
      let blob = new Blob([gcode], { type: "text/plain;charset=utf-8" });

      // "download" the gcode file
      // TODO : pass the gcode to python backend
      FileSaver.saveAs(blob, "braille.gcode");
    }
  }
  HandlePrint() {

    if (this.ptcloud.length > 0 && this.context.PyWebViewReady === true) {
      let gcoder = new GeomToGCode(this.context.Params.Speed,
        this.context.Params.Accel);
      gcoder.GeomToGCode(this.ptcloud, this.context.Params.Paper.height);
      let gcode = gcoder.GetGcode();

      this.setState({ comevent: "" });
      this.setState({ showModal: true, cancelprint: false });

      // request backend to print gcode
      window.pywebview.api.PrintGcode(gcode, this.context.Params.comport).then(status => {
        // remove modal status screen
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
  CancelPrint() {
    // request to cancel the print
    this.setState(
      {
        cancelprint: true
      }
    );
    window.pywebview.api.CancelPrint();
  }

  StatusPrintEnd() {
    if (this.timer)
      clearInterval(this.timer);
    let msg = this.context.GetLocaleString("print.ended") + this.state.printstatus;
    this.setState({ comevent: msg });
  }
  render() {
    return (
      <>
        <Modal
          isOpen={this.state.showModal}
          contentLabel=""
          aria={{ hidden: false, label: ' ' }}
        >
          <div aria-hidden={false} className='ModalView'>
            <p>
              {this.context.GetLocaleString("print.pending")}
            </p>
            <br />
            <p>
              {this.context.GetLocaleString("print.waiting")}
            </p>

            <button className="pad-button pure-button" onClick={this.CancelPrint}>
              {this.context.GetLocaleString("print.cancelbtn")}

            </button>
            <p>
              {this.state.cancelprint ? this.context.GetLocaleString("print.cancelpending") : ""}
            </p>

          </div>
        </Modal>
        <div className="Print">


          <div className="PrintCanvas">
            <canvas id="previewid" ref={this.canvasRef} hdmi resize>

            </canvas>
            <div id="appLabel">{this.state.rightdim[0]}x{this.state.rightdim[1]}</div>
          </div>
          <div className="PrintTitle">
            <h3>{this.context.GetLocaleString("print.preview")}</h3>
            <button className="pure-button " onClick={this.HandleDownload}>
              
              <FaDownload/>
              &nbsp;
              {this.context.GetLocaleString("print.download")}
            </button>
            &nbsp;
            <button className="pure-button  " onClick={this.HandlePrint}>
              <FaPrint />
              
              &nbsp;
              {this.context.GetLocaleString("print.print")}
            </button>
            &nbsp;
            <button className="pure-button " onClick={this.HandleRefresh}>
              <FaArrowRotateRight />
              
              &nbsp;
              {this.context.GetLocaleString("print.refresh")}
            </button>
            <p>{this.context.Params.comport}</p>
            <h3>{this.state.comevent}</h3>
          </div>
        </div>
      </>


    );
  }
};

export default Print;