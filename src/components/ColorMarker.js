const ColorMarker = (props) => {
    let fcolor = "red";
    let scolor = "black";
    let size ="2rem";
    if (props.fillcolor) {
        fcolor = props.fillcolor;
    }
    if (props.strokecolor) {
        scolor = props.strokecolor;
    }
    if (props.size) {
        size = props.size;
    }
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill={fcolor} strokeWidth="1" stroke={scolor} />
        </svg>
    );
}
export default ColorMarker;