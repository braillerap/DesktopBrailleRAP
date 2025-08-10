
const DashMarker = (props) => {
    //let fcolor = "red";
    let scolor = "black";
    let size ="2rem";
    let dashstyle = [[1,1]];
    let total = 2;
    let unit = 1;
/*
    const renderfill = (fill) => {
        if (fill)
            return `fill="${props.fill}"`;
        else
            return '';
    }
*/
/*
    if (props.fillcolor) {
        fcolor = props.fillcolor;
    }
*/
    if (props.strokecolor) {
        scolor = props.strokecolor;
    }
    if (props.size) {
        size = props.size;
    }
    if (props.unit) {
        unit = props.unit;
    }
    if (props.dashstyle)
    {
        dashstyle = props.dashstyle;
        total =0;
        for (const pat of dashstyle)
        {
            console.log (pat);
            total += (pat[0] + pat[1]) * unit * 2;
        }
    }
    let x = 0;
    let y = 50;
    
    const renderDash = (dash) => {
        
        return dash.map ((pat, index) => 
            {
                let tmpx = x;
                x += (pat[0] + pat[1]) * unit;
                return (<
                path d={`M ${tmpx} ${y} L ${tmpx + pat[0] * unit} ${y} `}
                strokeWidth={unit} stroke={scolor} 
                
                />)
            }   
        );
        
    }
    return (
        <svg 
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
           
            width={size}  
            height={size} 
            viewBox={`0 0 ${total} ${size}`} >
            {/*<rect x="0" y="0" width={total} height="100" stroke="blue" fill="transparent" stroke-width="2" />*/}
            
            
            {renderDash(dashstyle)}{renderDash(dashstyle)}
        </svg>
    );
}
export default DashMarker;