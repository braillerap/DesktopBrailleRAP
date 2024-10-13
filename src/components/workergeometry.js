
import paper from  'paper';
import BrailleToGeometry from '../braillegeometry/BrailleToGeometry';
import GeomToGCode from '../braillegeometry/GeomToGCode';
import DotGrid from '../braillegeometry/dotgrid';
import GeomPoint from '../braillegeometry/GeomPoint';

//paper.install(this);
//paper.setup([640, 480]);

export default () => {
   
    console.log("workergeometry started");

    self.onmessage = (event) => { /* eslint-disable-line no-restricted-globals */
        const data = event.data;

        console.log("in worker geometry");
        
        //let offscreen = new OffscreenCanvas(100,100);
        
        //let paper =  new paper.PaperScope();
        console.log("paper created");
        paper.setup([256,256]);
        console.log("paper initialized");
        
        paper.project.importJSON(data.paperdata);
        paper.activate ();

        console.log("build ptcloud");
        //const result = BuildDots(paper, data.params, data.patternsvg);
        const result = pperformIntensiveTask(data);

        const ret = { type: 'result', data: 25, ptcloud: result };
        self.postMessage(ret); /* eslint-disable-line no-restricted-globals */
    }

    function pperformIntensiveTask(data) {

        let i;
        for (i = 0; i < 10; i++) {
            let c = 0;
            for (let j = 0; j < 10000000; j++) {
                c = j + i;
            }
            const ret = { type: 'pending', data: i };
            self.postMessage(ret); /* eslint-disable-line no-restricted-globals */
        }
        return i;
    }
    function BuildDots(paper, params, patternsvg)
    {

        
        let ptcloud = [];
        if (paper) {
            let GeomBraille = [];
            let GeomVector = [];
            let PatternVector = [];
            let GeomPattern = [];
            //load test pattern
            

            let b = new BrailleToGeometry();
            let bounds = paper.project.activeLayer.bounds;
            let document = paper.project.activeLayer;    
            
            plotPathItem(document, bounds, GeomBraille, GeomVector);

            let f = new DotGrid(params.Paper.usablewidth,
                params.Paper.usableheight,
                params.stepvectormm,
                params.stepvectormm);
            
            // todo : add braille geometry
            //f.setarray(GeomBraille);
            
            let FilteredVector = f.filter(GeomVector);

            GeomBraille = GeomBraille.concat(FilteredVector);

            if (patternsvg && paper.project.activeLayer.children) {
                FillPattern(document, bounds, GeomPattern);
                let FilteredPattern = f.filter(GeomPattern);
                GeomBraille = GeomBraille.concat(FilteredPattern);
            }

            // sort dots on page
            let sorted = [];
            if (params.ZigZagBloc === true) {
                sorted = b.SortGeomZigZagBloc(GeomBraille);
            }
            else
                sorted = b.SortGeomZigZag(GeomBraille);

            ptcloud = sorted;  // save dots for printing

        }
        return ptcloud;
    }


    function FillPattern(item, bounds, GeomPattern) {
        if (!item.visible) {
            return
        }

        if (item.className === 'Shape') {
            // element is shape => convert to path
            let shape = item;
            if (isItemVisible(shape)) {
                let path = shape.toPath(true);
                item.parent.addChildren(item.children);
                item.remove();
                item = path;
            }
        }
        if (item.locked === true)
            return;
        /*
        if ((item.className === 'Path' ||
            item.className === 'CompoundPath') && item.strokeWidth > 0.001) {
            let path = item
            // item is path => build dots positions along all vectors
            if (path.fillColor && path.closed) {
                console.log("path.fillColor" + path.fillColor);
                console.log("path red " + path.fillColor.red);
                console.log("path alpha " + path.fillColor.alpha);
                console.log("path green " + path.fillColor.green);
                console.log("path blue " + path.fillColor.blue);

                for (let childpat of this.patternsvg.children) {
                    if (childpat.name)
                        console.log("childpat.name " + childpat.name);
                    console.log("childpat.className  " + childpat.className);
                    if (childpat.className === 'CompoundPath') {
                        for (let patseg of childpat.children) {
                            console.log("patseg.className  " + patseg.className);
                            if (patseg.segments != null) {
                                for (let i = 0; i < patseg.length; i += this.context.Params.stepvectormm) {
                                    let dot = patseg.getPointAt(i);

                                    if (path.contains(dot)) {
                                        console.log(dot);
                                        GeomPattern.unshift(new GeomPoint(dot.x, dot.y));
                                    }
                                }
                            }
                            else
                                console.log("no segments in pattern");
                        }

                    }
                }
            }

        }
        */
        if (item.children == null) {
            return;
        }
        for (let child of item.children) {
            FillPattern(child, bounds, GeomPattern)
        }
    }

    function isItemVisible(item) {
        return (item.strokeWidth > 0 && item.strokeColor != null) || item.fillColor != null;
    }
    function reverse_string(str) {
        var rev = "";
        for (var i = str.length - 1; i >= 0; i--) {
            rev += str[i];
        }
        return rev;
    }

    function plotPathItem(item, bounds, GeomBraille, GeomVector) {
        if (!item.visible) {
            return
        }

        if (item.className === 'Shape') {
            // element is shape => convert to path
            let shape = item
            if (isItemVisible(shape)) {
                let path = shape.toPath(true);
                item.parent.addChildren(item.children);
                item.remove();
                item = path;
            }
        }
        if (item.locked === true)
            return;

        if ((item.className === 'Path' ||
            item.className === 'CompoundPath') && item.strokeWidth > 0.001) {
            let path = item
            // item is path => build dots positions along all vectors
            if (path.segments != null) {
                for (let i = 0; i < path.length; i += this.context.Params.stepvectormm) {
                    let dot = path.getPointAt(i);
                    //GeomVector.push(new GeomPoint(dot.position.x, dot.position.y));
                    // push in front to reverse Z order
                    GeomVector.unshift(new GeomPoint(dot.x, dot.y));
                }
            }
        }
        if (item.children == null) {
            return;
        }
        for (let child of item.children) {
            plotPathItem(child, bounds, GeomBraille, GeomVector)
        }
    }
};