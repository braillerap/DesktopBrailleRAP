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
    VectorIndex:0,
    VectorSteps:[
        {name:"Paper", step:2.4, lock:true},
        {name:"Aluminium Can", step:1.8, lock:true}
    ],
    PaperUsableSize:[
        {name:"A4",width:210, height:250,lock:true},
        {name:"A3",width:297, height:420-47,lock:true},
        {name:"A4 (BrailleRAP)",usablewidth:190, usableheight:250,lock:true}
    ],
    PaperSize:[
        { name: "A4", width: 210, height: 297 , lock:true},
        { name: "A3", width: 297, height: 420 , lock:true}
        
    ],
    SizeIndex:0,
    UsableSizeIndex:0
}

export default AppOption;