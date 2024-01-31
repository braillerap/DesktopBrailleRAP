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

class BrailleToGeometry
{
    constructor ()
    {
        this.dotx_padding = 2.2 ;
        this.doty_padding = 2.2 ;
        this.char_paddingx = 6 ;
        this.char_paddingy = 12;
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

		if (inputgeom == null)
			return (sorted);
        for (let i=0; i < inputgeom.length; i++)
        {
            geom.push (inputgeom[i]);
        }
        geom.sort ((a,b) => {
            if (a.y === b.y) return (a.x - b.x);
			return (a.y - b.y);
        });

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
				tmp.sort ((a,b) => {
					if (a.y === b.y) return ((a.x - b.x) * dir);
						return (a.y - b.y);
				})

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