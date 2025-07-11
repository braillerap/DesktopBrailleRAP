
import BrailleToGeometry from './BrailleToGeometry';
import DotGrid from './dotgrid';
import GeomPoint from './GeomPoint';
import DashIterator from './DashIterator';

const PATTERNS_STEP_FACTOR = 1.15;
const BASELINE_OFFSET = -10; // offset from baseline for text svg => Braille upper left dots

// return true if pattern filling strategy of item is associated with patternid
const fillColorPredicate = (item, strategy, patternid) => {
  if (item.fillColor) {
    if (strategy.getPatternId(item.fillColor) === patternid) {
      return (true);
    }
  }
  return (false);
}

// return the pattern id associated with fill color or -1 if none
const fillColorUsedPredicate = (item, strategy) => {
  if (item.fillColor) {
    
    return (strategy.getPatternId(item.fillColor)) 
  }
  return (-1);
}

const EdgeStrokeColorPredicate = (item) => {
  return (-1);
}

// return true if pattern filling strategy of item is associated with patternid
const strokeColorPredicate = (item , strategy, patternid) => {
  if (item.strokeColor) {
    
    if (strategy.getPatternId(item.strokeColor) === patternid) {
      return (true);
    }
  }
  return (false);
}

// return the pattern id associated with stroke color or -1 if none
const strokeColorUsedPredicate = (item, strategy) => {
  if (item.strokeColor) {
    
    return (strategy.getPatternId(item.strokeColor)) 
  }
  return (-1);
}

// select path with stroke width > 0.001 and don't take account of stroke color
const EdgeStrokeWidth = (item) => {
  if ((item.className === 'Path' ||
    item.className === 'CompoundPath') && item.strokeWidth > 0.001) 
    return true;
  return false;
  }
// select path with stroke width > 0.001 and take account of stroke color  
const EdgeStrokeStrict = (item) => {
  if ((item.className === 'Path' ||
    item.className === 'CompoundPath') && item.strokeWidth > 0.001 && item.strokeColor)
    return (true);
  return (false);
}
class PageBuilder
{
    constructor (paper, // paper instance
      papercanvas,      // papercanvas instance
      patternsvg,       // svg filling patterns list
      patstrategy,      // filling pattern strategy
      params,           // parameters 
      braillereverse,   // braille reverse flag
      patternrule,      // stroke pattern detection rule
      louis,             // liblouis instance
      dashlist,          // list of dash style
      dashstrategy,      // dash style strategy
      forceedgerule      // force edge rule
    )  
    {
        this.paper = paper;
        this.papercanvas = papercanvas;
        this.patternsvg = patternsvg;
        this.patstrategy = patstrategy;
        this.params = params;
        this.braillereverse = braillereverse;
        this.patternrule = patternrule;
        this.louis = louis;
        this.dashlist = dashlist;
        this.dashstrategy = dashstrategy;
        this.forceedgerule = forceedgerule;
    }


    buildpage() 
    {
        let canv = this.papercanvas;
    
        if (canv) {
          let patternsvg = this.patternsvg;
          
          let GeomTotal = []
          let GeomBraille = [];
          let GeomVector = [];
          let GeomPattern = [];
 
          // build braille and edge geometry
          let b = new BrailleToGeometry();
    
          let bounds = canv.paper.project.activeLayer.bounds;
          let element = canv.paper.project.activeLayer;
          
          this.plotItem(element,  
            bounds, 
            GeomBraille, 
            GeomVector, 
            this.forceedgerule === true ? EdgeStrokeWidth : EdgeStrokeStrict,
            this.dashlist,
            this.dashstrategy);
    
    
          // init exclusion grid
          let f = new DotGrid(this.params.Paper.usablewidth,
            this.params.Paper.usableheight,
            this.params.stepvectormm,
            this.params.stepvectormm);
          f.setarray(GeomBraille);
          
          // filter edge geometry
          let FilteredVector = f.filter(GeomVector);
    
          // add filtered geometry to global geometry
          let FilteredGeomBraille = f.filteredge(GeomBraille);
          GeomTotal = FilteredGeomBraille.concat(FilteredVector);
          


          // build filling pattern geometry
                   
          
          /* brut strategy*/
          /*
          if (canv.paper.project.activeLayer.children && patstrategy.isStrategyValid ())
          {
            this.FillPattern(element, bounds, GeomPattern, patstrategy, patternsvg);
            let FilteredPattern = f.filter(GeomPattern);
            GeomTotal = GeomTotal.concat(FilteredPattern);
          }
          */
          // hit test strategy
          
          if (canv.paper.project.activeLayer.children && this.patstrategy.isStrategyValid ())
          {
            let usedpattern = {};
    
            this.FillPatternList(element, bounds,  this.patstrategy, 
              usedpattern, patternsvg,
              this.patternrule === 0 ? fillColorUsedPredicate : strokeColorUsedPredicate
            );
            
            //console.dir (usedpattern);
                        
            for (const patternid in usedpattern)
            {
              this.FillPatternHitTest (patternsvg[patternid], patternid, 
                  GeomPattern, this.patstrategy,
                  this.patternrule === 0 ? fillColorPredicate : strokeColorPredicate,
                );
            }  
            let FilteredPattern = f.filter(GeomPattern);
            GeomTotal = GeomTotal.concat(FilteredPattern);
          }
          else
          {
            //console.log (">>>>>>>>> no pattern");
            if (! canv.paper.project.activeLayer.children)
              console.log (">>>>>>>>>no children");
            if (!this.patstrategy.isStrategyValid ())
              console.log (">>>>>>>>>>>>>no strategy");
          }
         
          // sort dots on page
          let sorted = [];
          if (this.params.OptimLevel === 2)
          {
            sorted = b.SortGeomBloc(GeomTotal);
          }
          else if (this.params.OptimLevel === 1) {
            sorted = b.SortGeomZigZagBloc(GeomTotal);
          }
          else
            sorted = b.SortGeomZigZag(GeomTotal);
    
          
          return (sorted);
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
    
      FillPatternList(item, bounds, patstrategy, usedpattern, patternsvg, predicat) 
      {
        if (!item.visible) {
          //console.log ("hidden item");
          return;
        }
        if (item.locked === true)
          return;
        //console.log (item.className);
        if (item.className === 'Shape') {
          // element is shape => convert to path
          let shape = item;
          //console.log ("shape in pattern");
          if (this.itemMustBeDrawn(shape)) {
            let path = shape.toPath(true);
            item.parent.addChildren(item.children);
            item.remove();
            item = path;
            //console.log ("shape in pattern transformed");
          }
        }
        
        if ((item.className === 'Path' ||
          item.className === 'CompoundPath') && item.strokeWidth > 0.001) 
        {
          let path = item;
          // item is path => build dots positions along all vectors
          
          let patternid = predicat (path, patstrategy);
          if (patternid >= 0 && patternid < patternsvg.length)
          {
            //console.log ("selected pattern " + patternid);
            usedpattern[patternid] = true;
          }
          
        }
        
        if (item.children == null) {
          return;
        }
        for (let child of item.children) {
          this.FillPatternList(child, bounds, patstrategy, usedpattern, patternsvg, predicat);
        }
      }
    
  FillPatternHitTest(itempattern, patternid, GeomPattern, strategy, predicat) 
  {
    let canv = this.papercanvas;
    
    const hitOptions = {
      segments: true,
      stroke: false,
      fill: true,
      tolerance: 0
    };

    
    if (itempattern.className === 'Shape') {

      let patseg = itempattern.toPath(true);
      if (patseg.segments != null) {
        for (let i = 0; i < patseg.length; i += (this.params.stepvectormm * PATTERNS_STEP_FACTOR)) {
          let dot = patseg.getPointAt(i);
          let tdot = canv.paper.project.activeLayer.localToGlobal(dot);
          let hitResult = canv.paper.project.hitTest(tdot, hitOptions);

          if (hitResult && hitResult.item) 
          {
            let item = hitResult.item;
            
            if (hitResult.type === 'fill') {
              if (predicat (item, strategy, patternid)) {
                GeomPattern.unshift(new GeomPoint(dot.x, dot.y));
              }
            }
            else {
              console.log("unknown hit result");
              console.log(hitResult);
            }
          }
        }
      }
    }
    else if ((itempattern.className === 'Path' ||
      itempattern.className === 'CompoundPath') && itempattern.strokeWidth > 0.001) {
      
      let path = itempattern;
      // item is path => build dots positions along all vectors
      if (path.segments != null) {
        for (let i = 0; i < path.length; i += (this.params.stepvectormm * PATTERNS_STEP_FACTOR)) {
          let dot = path.getPointAt(i);
          let tdot = canv.paper.project.activeLayer.localToGlobal(dot);

          let hitResult = canv.paper.project.hitTest(tdot, hitOptions);

          if (hitResult && hitResult.item) {
            let item = hitResult.item;
            

            if (hitResult.type === 'fill') {

              if (predicat (item, strategy, patternid)) {
                GeomPattern.unshift(new GeomPoint(dot.x, dot.y));
              }

            }
            
          }
        }
      }
    }

    if (itempattern.children == null) {
      return;
    }
    for (let child of itempattern.children) {
      this.FillPatternHitTest(child, patternid, GeomPattern, strategy, predicat)
    }
  }


    
      
      
    
      FillPattern(item, bounds, GeomPattern, patstrategy, patternsvg) 
      {
        if (!item.visible) {
          return;
        }
        if (item.locked === true)
          return;
        
        if (item.className === 'Shape') {
          // element is shape => convert to path
          let shape = item;
          console.log ("shape in pattern");
          if (this.itemMustBeDrawn(shape)) {
            let path = shape.toPath(true);
            item.parent.addChildren(item.children);
            item.remove();
            item = path;
            console.log ("shape in pattern transformed");
          }
          else
            console.log ("shape in pattern refused" );
        }
        
        if ((item.className === 'Path' ||
          item.className === 'CompoundPath') && item.strokeWidth > 0.001) 
        {
          let path = item;
          // item is path => build dots positions along all vectors
          if (path.fillColor && path.closed)
          {
            console.log ("path.fillColor" + path.fillColor);
    
            let patternid = -1;
            let patfill = null;
            if (patstrategy)
            {
              // find the associate pattern
              patternid = patstrategy.getPatternId(path.fillColor);
              if (patternid >= 0 && patternid < patternsvg.length)
                patfill = patternsvg[patternid];
            }
            console.log ("selected pattern " + patternid);
            console.log ("selected pattern " + patfill);
            
            if (patfill != null && patfill.children)
            {
              for (let childpat of patfill.children) 
              {
                //if (childpat.name)
                //  console.log ("childpat.name " + childpat.name);
                //  console.log ("childpat.className  " + childpat.className);  
                if (childpat.className === 'CompoundPath')
                {
                  for (let patseg of childpat.children)
                  {
                    //console.log ("patseg.className  " + patseg.className);  
                    if (patseg.segments != null) 
                    {
                      for (let i = 0; i < patseg.length; i += this.context.Params.stepvectormm) 
                      {
                        let dot = patseg.getPointAt(i);
                        
                        if (path.contains (dot))
                        {
                          console.log (dot);
                          GeomPattern.unshift(new GeomPoint(dot.x, dot.y));
                        }
                      }
                    }
                    else
                      console.log ("no segments in pattern");
                  }
                  
            
                }
                else if (childpat.className === 'Shape')
                {
                  
                  let patseg = childpat.toPath(true);
                  if (patseg.segments != null) 
                  {
                    for (let i = 0; i < patseg.length; i += this.params.stepvectormm) 
                    {
                      let dot = patseg.getPointAt(i);
                      
                      if (path.contains (dot))
                      {
                        console.log (dot);
                        GeomPattern.unshift(new GeomPoint(dot.x, dot.y));
                      }
                    }
                  }
                }
              }
              
            }
            
          }
        }
        
        if (item.children == null) {
          return;
        }
        for (let child of item.children) {
          this.FillPattern(child, bounds, GeomPattern, patstrategy, patternsvg)
        }
      }
    
      plotItem(item, 
        bounds, 
        GeomBraille, 
        GeomVector, 
        edgepredicat,
        dashlist,
        dashstrategy) {
        if (!item.visible) {
          return
        }
        
        if (item.className === 'Shape') {
          // element is shape => convert to path
          console.log ("item.className = 'Shape'")
          let shape = item;
          if (this.itemMustBeDrawn(shape)) {
            let path = shape.toPath(true);
            item.parent.addChildren(item.children);
            item.remove();
            item = path;
          }
        }
        if (item.locked === true)
          return;
        if ((item.className === 'PointText')) {
          // element is text => convert in Braille
          if (this.louis.isInit()) {
            let g = new BrailleToGeometry();
    
            // TODO : build a true translator to avoid inline translation
            let transcript = this.louis.unicode_translate_string(item.content, this.params.brailletbl);
            if (this.braillereverse) // some language : ie ARABIC are ltr language but RTL in Braille
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
    
            let pts = g.BrailleStringToGeom(transcript, item.matrix.tx, item.matrix.ty + BASELINE_OFFSET,
                 v.x, v.y, n.x, n.y);
            
            //console.log ("text " + item.content + " x=" + item.position.x + " y=" +item.position.y);
            //console.log ("text " + item.content + " x=" + item.matrix.tx + " y=" +item.matrix.ty);
            //console.log (item);
            for (let i = 0; i < pts.length; i++)
              GeomBraille.push(pts[i]);
          }
        }
        //if ((item.className === 'Path' ||
        //  item.className === 'CompoundPath') && item.strokeWidth > 0.001 && item.strokeColor) {
        if (edgepredicat (item))
        {
            //console.log (item);
            let path = item;
            let defdash = [[8,0]]; // default dash style to full

            // select dash style if any
            if (path.strokeColor)
            {
              let sid = dashstrategy.getPatternId (path.strokeColor);
              if (sid >= 0 && sid < dashlist.length)
              {
                defdash = dashlist[sid].dash;
              }
            }
            let dashit = new DashIterator (defdash, this.params.stepvectormm);
      
            // item is path => build dots positions along all vectors
            if (path.segments != null && ! dashit.isempty()) {

              for (let i = dashit.reset(); i < path.length; i += dashit.next()) {
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
          this.plotItem(child, 
            bounds, 
            GeomBraille, 
            GeomVector, 
            edgepredicat, 
            dashlist,
            dashstrategy)
        }
      }
}

export default PageBuilder;