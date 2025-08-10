const AppOption = {
    comport:"COM1",
   
   
    brailletbl:70,
    Paper: { width: 210, height: 297, usablewidth: 190, usableheight: 250 },
    stepvectormm:2.5,
    lang:"fr",
    SvgInterpol:false,
    ZigZagBloc:false,
    Optimbloc:false,
    OptimLevel:0,
    Speed:6000,
    Accel:1500,
    PaperUsableSize:[
        {name:"A4",usablewidth:210, usableheight:250,lock:true},
        {name:"A3",usablewidth:297, usableheight:420-47,lock:true},
        {name:"A4 (BrailleRAP)",usablewidth:190, usableheight:250,lock:true}
    ]
}

export default AppOption;