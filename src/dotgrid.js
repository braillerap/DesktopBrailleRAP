
class DotGrid
{
    constructor(width, height, stepx, stepy)
    {
        this.mmwidth = width; 
        this.mmheight = height;
        this.stepx = stepx / 3;
        this.stepy = stepy / 3;
        this.width = Math.floor(width / this.stepx);
        this.height = Math.floor(height / this.stepy);
        console.log ("grid xy " + this.width + " " + this.height + 
                    " stepx " + this.stepx + " stepy " + this.stepy);
        this.grid = new Array(this.width);
        for (let i = 0; i < this.width; i++)
        {
            this.grid[i] = new Array(this.height);
            this.grid[i].fill(0);
        }
        //console.log (this.grid);

    }    

    //set a dot at x, y
    set(x, y)
    {
        
        let px = Math.floor(x / this.stepx);
        let py = Math.floor(y / this.stepy);
        
        if (px < 0 || px >= this.width || py < 0 || py >= this.height) 
            return;
        this.grid[px][py] = 1;
    }    
    get (x,y)
    {
        let px = Math.floor(x / this.stepx);
        let py = Math.floor(y / this.stepy);
        
        if (px < 0 || px >= this.width || py < 0 || py >= this.height) return 1;

        return this.grid[px][py];
    }
    getmat(x,y)
    {
        let px = Math.floor(x / this.stepx);
        let py = Math.floor(y / this.stepy);
        
        let total = 0;
        for (let x = px-1; x <= px+1; x++)
        {
            for (let y = py-1; y <= py+1; y++)
            {
                
                if (x < 0 || x >= this.width || y < 0 || y >= this.height || total > 0) 
                    continue;
                total = total + this.grid[x][y];
            }
        }
        return total;
    }
    filter (pts)
    {
        
        let filtered = [];
        for (let i = 0; i < pts.length; i++)
        {
            
            let t = this.getmat(pts[i].x, pts[i].y);
            if (t === 0)
            {
                this.set(pts[i].x, pts[i].y);
                filtered.push(pts[i]);
            }
        }
        return filtered;
    }

    setarray(pts)
    {
        for (let i = 0; i < pts.length; i++)
        {
            this.set(pts[i].x, pts[i].y);
        }
    }
}   

export default DotGrid;