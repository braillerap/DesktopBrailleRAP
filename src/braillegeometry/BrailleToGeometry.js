import GeomPoint from "./GeomPoint";

const _dots = [
     {x:0, y:0},
     {x:0, y:1},
     {x:0, y:2},
     {x:1, y:0},
     {x:1, y:1},
     {x:1, y:2},
     {x:0, y:3},
     {x:1, y:3},
];
const _permanent_offset = {x: 0, y: 5};

class BrailleToGeometry
{
    constructor ()
    {
        this.dotx_padding = 2.2 ;
        this.doty_padding = 2.2 ;
        this.char_paddingx = 6 ;
        this.char_paddingy = 12;
        this.blocsize = this.char_paddingy;
    }
    BrailleStringToGeom (str, x, y, vx, vy, ox, oy)
    {
        let geom = [];
        let px = x;
        let py = y;
        
        for (let l = 0; l < str.length; l++)
        {
            let pts = this.BrailleCharToGeom (str[l], px, py, vx, vy, ox, oy);
            geom = geom.concat (pts);
            
            px += this.char_paddingx * vx;
            py += this.char_paddingx * vy;
        }

        return geom;
    }
    BrailleCharToGeom (char, offsetx, offsety, vx=1, vy=0, ox=0, oy =1)
    {
        //console.log (char);
        let val = char.charCodeAt (0);
        //console.log (val);
        let pts = [];

        for (let i = 0; i < 8; i++)
        {
            if ((val & (1 << i)) !== 0)
            {
                let x = _dots[i]['x'];
                let y = _dots[i]['y'];
                
                
                
                let pt = new GeomPoint(
                        (((x * vx) + (y * ox)) / 1) * this.dotx_padding + offsetx, 
                        (((x * vy) + (y * oy)) / 1) * this.doty_padding + offsety
                        );
                pt.x = pt.x + _permanent_offset.x * vx;
                pt.y = pt.y + _permanent_offset.y * oy;
                
                pts.push (pt);
            }
        }
        
        return (pts);
    }
    setPaddingY (value)
    {
        this.char_paddingy = value;
    }
    SortGeom (geom)
    {
        geom.sort (function (a,b) {
			if (a.y === b.y) return (a.x - b.x);
			return (a.y - b.y);
		});
        return geom;
    }
    SortGeomZigZag (inputgeom)
    {
        let i;
		let  s = 0;
		let e = 0;
		let dir = 1;
		let tmp = [];
		let sorted = [];
        let geom = [];
        
        const sort_predicate_y = (a,b) => {
            if (a.y === b.y) return (a.x - b.x);
			return (a.y - b.y);
        }
		if (inputgeom == null)
			return (sorted);
        for (let i=0; i < inputgeom.length; i++)
        {
            geom.push (inputgeom[i]);
        }
        geom.sort (sort_predicate_y);

		e = 0;
        while (e < geom.length)
		{
			while ((geom[s].y === geom[e].y) )
			{
				e++;
				if (e === (geom.length))
				{
						break;
				}
			}

			//if (e - s >= 0)
			{
				for (i = s; i < e; i++)
				{
					tmp.push (geom[i]);
				}
				tmp.sort (sort_predicate_y);

				for(i = 0; i < tmp.length; i++)
					sorted.push (tmp[i]);
				tmp = [];
				dir = - dir;

				s = e;
			}
			
		}

		return (sorted);
    }

    SortGeomBloc (inputgeom)
    {
        let sorted = [];
        const blocsize = this.blocsize;
        const sort_predicate_y = (a,b) => {
            if (a.y === b.y) return (a.x - b.x);
			return (a.y - b.y);
        }
        const sort_predicate_bloc = (a,b) => {
            if (Math.floor(a.y / blocsize) === Math.floor (b.y / blocsize)) 
            {
                if (a.x === b.x)
                    return (a.y - b.y);    
                
                return (a.x - b.x);
            }
            return (a.y - b.y);
        }
        const sort_dist =(a,b)  => {
           
            return (b.d - a.d);
        }
        
        const isinbloc = (blocpos, dot) => {
            if (Math.floor(Math.abs(blocpos.y - dot.y)) < blocsize) 
            {
                return true;
            }
            return false;

        }
        const dist2 = (dot1, dot2) => {
            
            let dist = ((dot1.x - dot2.x) * (dot1.x - dot2.x)) + ((dot1.y - dot2.y) * (dot1.y - dot2.y));
            return (dist);
        }
        
        const builddist = (ref, dot) => {
            let dist = dist2(ref, dot);

            return ({pt:dot,d:dist});
        }
        if (inputgeom == null)
			return (sorted);
        let geom =[];
        
        for (let i=0; i < inputgeom.length; i++)
        {
            geom.push (inputgeom[i]);
        }
        geom.sort (sort_predicate_y);

        let ref = new GeomPoint(0,0);
        let p = 0;
        while (p < geom.length)
        {
            
            let bloc = [];

            console.log ("next " + p + " length =" + geom.length);
            while (p < geom.length && (isinbloc (ref, geom[p]) || bloc.length < 3) )
            {
                bloc.push (builddist(ref, geom[p]));
                console.log (p);
                p++;
                
            }
            console.log ("consumed " + p + " length =" + geom.length);
            while (bloc.length > 0)
            {    
                bloc.sort (sort_dist);
                console.log (bloc);
                for (let d = 0; d < bloc.length; d++)
                    console.log (" " + bloc[d].d + " " + bloc[d].pt.x + " " + bloc[d].pt.y);
              
                // get nearest point from ref
                let dotdist = bloc.pop();
                ref = dotdist.pt;  // update ref
                
                sorted.push (dotdist.pt);  // store point in result

               
                // update dist    
                for (let i =0; i < bloc.length; i++)
                {
                  
                    bloc[i].d = dist2(bloc[i].pt, ref);
                }
            }
            console.log ("end consuming dot");
        }
        console.log (sorted);
        return (sorted);
    }
    SortGeomZigZagBloc (inputgeom)
    {
        let i;
		let  s = 0;
		let e = 0;
		let dir = 1;
		let tmp = [];
		let sorted = [];
        let geom = [];
        let bloc = 2;

        const sort_predicate_bloc = (a,b) => {
            if (Math.floor(a.y / bloc) === Math.floor (b.y / bloc)) 
            {
                if (a.x === b.x)
                    return (a.y - b.y);    
                
                return (a.x - b.x);
            }
            return (a.y - b.y);
        }
        const sort_predicate_y = (a,b) => {
            if (Math.floor (a.y / bloc) === Math.floor (b.y / bloc)) 
                return ((a.x - b.x) * dir);
            return (a.y - b.y);
        }

		if (inputgeom == null)
			return (sorted);
        for (let i=0; i < inputgeom.length; i++)
        {
            geom.push (inputgeom[i]);
        }
        geom.sort (sort_predicate_bloc);

		e = 0;
        while (e < geom.length)
		{
			while ( Math.floor (geom[s].y / bloc) === Math.floor (geom[e].y / bloc) )
			{
				e++;
				if (e === (geom.length))
				{
						break;
				}
			}

			//if (e - s >= 0)
			{
				for (i = s; i < e; i++)
				{
					tmp.push (geom[i]);
				}
				tmp.sort (sort_predicate_y);

				for(i = 0; i < tmp.length; i++)
					sorted.push (tmp[i]);
				tmp = [];
				dir = - dir;

				s = e;
			}
			
		}

		return (sorted);
    }
    BraillePageToGeom (lines, offsetx, offsety)
    {
        
        let starty = offsety;
        let geom = [];
        for (let l = 0; l < lines.length; l++)
        {
            let startx = offsetx;
            let line = lines[l];
            for (let c = 0; c < line.length; c++)
            {
                let pts = this.BrailleCharToGeom (line[c], startx, starty);
                geom = geom.concat (pts);
                startx += this.char_paddingx;
            }
            starty += this.char_paddingy;
        }
        
        this.SortGeom(geom);
        let sorted = this.SortGeomZigZag(geom);

        //console.log (geom);

        return sorted;
    }
   
}

export default BrailleToGeometry;