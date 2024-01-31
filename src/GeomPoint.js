class GeomPoint
{
    constructor (x = 0,y = 0)
    {
        this.x = x;
        this.y = y;
    }

    add (x,y)
    {
        this.x += x;
        this.y += y; 
    }

    add_geom (pt)
    {
        this.x += pt.x;
        this.y += pt.y;
    }
    
    x()
    {
        return this.x;
    }
    
    y()
    {
        return this.y;
    }
    

}

export default GeomPoint;