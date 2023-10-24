// Functions for determining gain of different antenna types
// Precalculated 3D radiation pattern for antenna is given in array g
// Interpolation of 3D pattern data is done by function antennaInterpolate()

function antennaCasgA2(fr, h, el) {  // CASG-A2 pattern
  var s="antCasgA2() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5,  2,   3,   4.5,    7];   // frequency list 
  var ga = [-8.4,-5.9,-2.7,-1.3, -2.2];   // average gain over elevation
  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ; // Elevation list
 
  var g1 = [-100,-15.7,-11.9,  -9.1,-7,9,-6.6,  -5.9,-6.5,-7.9,  -9.7,-11.4];  // 1.5 MHz
  var g2 = [-100,-15.7,-10.8,  -9.1,-6.3,-4.8,  -4,-4.3,-5.2,     -6.4,-7.4];   // 2 MHz
  var g3 = [-100,-15.1,-10.3,  -7.9,-5.4,-3.7,  -2.1,-1.6,-1.6,   -1.7,-2.0]  ;  // 3 MHz
  var g4 = [-100,-15.1,-10.3,  -7.7,-5.0,-3.5,   -1.1,-0.3,0.1,     0.3,0.2];   // 4.5 MHz
  var g5 = [-100,-13.5,-8.5,   -5.9,-3.1,-1.7,  -0.1,-0.5,-1.6,   -2.4,-3.2];  // 7 M
  var g  = [g1, g2, g3, g4, g5]; // gain packed into one array
  console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}

function antennaHf230(fr, h, el) {  // HF230 pattern
  var s="antHf2302() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5,    2,    3,   4.5,   7,   10,   15];   // frequency list
  var ga = [-30.4,-26.8,-20.3,-14.9,-10.1,-6.9,-3.9];   // average gain over elevation
  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ; // Elevation list

  var g1 = [-100,-43.0,-38.5,  -36.4,-32.8,-31.5,  -30.1,-29.6,-29.2,  -29.2,-29.2];   // 1.5 MHz
  var g2 = [-100,-43.0,-38.5,  -36.4,-32.8,-27.8,  -26.2,-25.5,-25.3,  -24.9,-24.9];   // 2 MHz
  var g3 = [-100,-33.1,-28.3,  -25.9,-23.4,-22.1,  -20.0,-19.1,-19.1,  -19.1,-19.1]  ; // 3 MHz
  var g4 = [-100,-28.0,-23.1,  -20.6,-17.9,-16.3,  -14.4,-13.8,-13.8,  -13.8,-13.8];   // 4.5 MHz
  var g5 = [-100,-22.8,-17.8,  -15.2,-12.5,-11.0,  -8.9,-8.8,-9.0,      -9.7,-10.0];   // 7 M
  var g6 = [-100,-19,-14,      -11.4,-8.6,-7.2,     -5.2,-5.2,-6,        -6.8,-7.7];   // 10 M
  var g7 = [-100,-16.7,-11.7,  -9.1,-6.2,-4.7,      -2.7,-2.6,-2.9,      -3.3,-3.7];   // 15 M
  var g  = [g1, g2, g3, g4, g5, g6, g7]; // gain packed into one array
  console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}    

function antennaWhpBnt(fr, h, el) {  // PMV Bent Whip pattern
  var s="antWhpBnt() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5,2,3,  4.5,7, 10, 15];   // frequency list
  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ; // Elevation list
  var ga = [-26.4,-23.4,-18.9,-14.6,-9.0, -5.9,-3.7];   // average gain over elevation

  var g1 = [-100,-33.0,-28.6,  -26.4,-24.4,-23.2,  -22.7,-23.9,-25.8,  -28.6,-31.4];   // 1.5 MHz
  var g2 = [-100,-30.3,-25.7,  -23.4,-21.2,-20.1,  -19.3,-20.2,-22.4,  -25.7,-30.0];   // 2 MHz
  var g3 = [-100,-26.5,-21.7,  -19.2,-16.9,-15.3,  -14.5,-15.5,-17.6,  -21.0,-26.4];   // 3 MHz
  var g4 = [-100,-23.3,-18.4,  -15.9,-13.3,-11.5,  -10.6,-11.3,-13.6,  -16.8,-20.5] ;  // 4.5 MHz 
  var g5 = [-100,-19.0,-13.9,   -11.3,-8.6,-6.7,    -5.5,-6.2,-8.1,    -10.6,-13.7];   // 7 M
  var g6 = [-100,-16.4,-11.3,    -8.7,-5.9,-3.9,     -2.8,-3.5,-5.3,     -7.3,-9.2];   // 10 M
  var g7 = [-100,-14.0,-8.9,     -6.3,-3.3,-1.5,     -0.7,-1.9,-3.8,     -5.0,-5.2];   // 15 M
  var g  = [g1, g2, g3, g4, g5, g6, g7]; // gain packed into one array
  console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}

function antennaWhp3M(fr, h, el) {  // PMV Bent Whip pattern
  var s="antWhp3M() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5,2,3,  4.5,7, 10, 15];   // frequency list
  var ga = [-24.3,-20.7,-15.8,-11.5,7-7.5,-5.2,-3.4];   // average gain over elevation
  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ; // Elevation list

  var g1 = [-100,-28.5,-24.1,  -21.9,-19.9,-18.7,   -18.3,-19.7,-22.1,   -26.6,-37.9];   // 1.5 MHz
  var g2 = [-100,-25.9,-21.3,   -19.0,-16.8,-15.4,  -14.9,-16.2,-18.6,   -22.9,-33.3];   // 2 MHz
  var g3 = [-100,-22.1,-17.5,  -15.1,-12.7,-11.1,   -10.4,-11.5,-13.9,   -18.0,-26.8];   // 3 MHz
  var g4 = [-100,-19.1,-14.1,  -11.6,-9.0,-7.3,       -6.4,-7.4,-9.7,    -13.5,-21.2] ;  // 4.5 MHz 
  var g5 = [-100,-16.1,-11.1,    -8.5,-5.7,-3.8,      -2.9,-4.0,-6.1,     -9.5,-14.5];   // 7 M
  var g6 = [-100,-14.2,-9.1,    -6.5,-3.7,-1.8,       -0.9,-2.3,-4.5,     -7.7,-10.5];   // 10 M
  var g7 = [-100,-12.3,-7.2,      -4.5,-1.7,0.1,       0.4,-1.8,-3.8,      -5.5,-6.0];   // 15 M
  var g  = [g1, g2, g3, g4, g5, g6, g7]; // gain packed into one array
  console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}

function antennaVertMono(fr, h, el) {  // PMV Bent Whip pattern
  var s="antVertMono() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5, 2];   // frequency list
  var ga = [-8.4,-8.4];   // average gain over elevation
  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ; // Elevation list

  var g1 = [-100,-10.5,-5.9,     -3.7,-1.6,-0.6,    -0.3,-2.0,-5.4,    -10.9,-28.2];   // 1.5 MHz
  var g2 = [-100,-10.5,-5.9,     -3.7,-1.6,-0.6,    -0.3,-2.0,-5.4,    -10.9,-28.2];   // 2 MHz
  var g  = [g1, g2]; // gain packed into one array
  console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}

function antennaRf1944(fr, h, el) {    // PMV Bent Whip pattern
  var s="antRf1944() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5,    2,    3,   4.5,     7];   // frequency list
  var ga = [-21.8,-18.0,-15.8,-14.2,-12.9];   // average gain over elevation
  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ; // Elevation list

  var g1 = [-100,-33.6,-29.1,  -27.0,-24.9,-23.3,  -21.9,-21.1,-20.7,  -20.4,-20.3];  // 1.5 MHz
  var g2 = [-100,-30.7,-26.0,  -23.8,-21.4,-19.8,  -18.2,-17.4,-16.7,  -16.5,-16.4];   // 2 MHz
  var g3 = [-100,-29.3,-24.5,  -22.1,-19.6,-17.7,  -16.0,-15.0,-14.4,  -14.0,-13.9];   // 3 MHz
  var g4 = [-100,-28.6,-23.7,  -21.1,-18.4,-16.4,  -14.5,-13.5,-12.8,  -12.2,-12.0];   // 4.5 MHz
  var g5 = [-100,-34.0,-28.1,  -24.7,-20.5,-16.8,  -12.7,-11.1,-10.4,  -10.3,-10.3];   // 7 MHz

  var g  = [g1, g2, g3, g4, g5]; // gain packed into one array
  console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}

// Dipole has 5 distinct patterns , based on ratio height / wavelength
function antennaDipole(fr, h, el) {    
  if(h <  4.5)  return antennaDipole1(fr, h, el);  // Low dipole pattern
  if(h <  9)    return antennaDipole2(fr, h, el);
  if(h <  15)   return antennaDipole3(fr, h, el);
  if(h < 21)    return antennaDipole4(fr, h, el);  // High dipole pattern
  return antennaDipole5(fr, h, el);
}

function antennaDipole1(fr, h, el) {    // Inv Vee on 3 m mast
  var s="antDipole1() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5,    2,   3,  4.5,  7,   10,  15];   // frequency list
  var ga = [-10.1,-8.9,-7.5,-6.1,-4.3,-3.5,-2.4];   // average gain over elevation

  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ; // Elevation list

  var g1 = [-100,-22.9,-18.5,  -16.3,-14.1,-12.5,  -10.8,-9.7,-8.7,  -8.1,-7.9];   // 1.5 MHz
  var g2 = [-100,-22.6,-18.0,  -15.7,-13.3,-11.6,  -9.7,-8.3,-7.4,   -6.8,-6.5];   // 2 MHz
  var g3 = [-100,-22.3,-17.5,  -15.0,-12.4,-10.5,  -8.3,-6.8,-5.7,   -5.0,-4.8];   // 3 MHz
  var g4 = [-100,-22.0,-17.0,  -14.5,-11.7,-9.5,   -7.1,-5.3,-4.2,   -3.4,-3.1];   // 4.5 MHz
  var g5 = [-100,-21.6,-16.5,  -13.8,-10.9,-8.6,   -3.6,-3.8,-2.5,   -1.7,-1.3];   // 7 MHz
  var g6 = [-100,-21.0,-15.9,  -13.2,-10.1,-7.7,   -4.8,-2.6,-1.3,    -0.4,0.0];   // 10 MHz
  var g7 = [-100,-20.2,-15.0,  -12.3,-9.2,-6.7,    -3.7,-1.7,0.0,      0.9,1.3];   // 15 MHz

  var g  = [g1, g2, g3, g4, g5, g6, g7]; // gain packed into one array
  console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}
function antennaDipole2(fr, h, el) {    // Inv Vee on 6 m mast
  var s="antDipole2() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5, 2, 3, 4.5, 7, 10, 15];   // frequency list
  var ga = [-6.8, -5.3,-3.5,-2.1,-0.9,-0.4,2.3];   // average gain over elevation
  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ; // Elevation list

  var g1 = [-100,-21.6,-17.1,  -14.9,-12.6,-11.3,  -8.5,-6.5,-4.7,   -3.6,-3.2];   // 1.5 MHz
  var g2 = [-100,-21.2,-16.6,  -14.3,-11.8,-9.9,   -7.2,-4.8,-3.1,   -1.9,-1.5];   // 2 MHz
  var g3 = [-100,-20.9,-16.1,  -13.6,-10.9,-8.7,   -5.7,-2.9,-1.0,      0.2,07];   // 3 MHz
  var g4 = [-100,-20.8,-15.8,  -13.2,-10.3,-7.9,   -4.4,-1.7,0.7,      2.1,2.6];   // 4.5 MHz
  var g5 = [-100,-21.0,-16.0,  -13.2,-10.1,-7.5,   -3.6,-0.1,2.1,      3.6,4.2];   // 7 MHz
  var g6 = [-100,-21.1,-16.0,  -13.2,-10.0,-7.2,   -3.0,0.6,2.8,       4.4,4.8];   // 10 MHz
  var g7 = [-100,-18.0,-12.1,    -8.7,-4.6,-1.0,     2.9,4.3,4.6,      4.5,4.5];   // 15 MHz

  var g  = [g1, g2, g3, g4, g5, g6, g7]; // gain packed into one array
  console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}

function antennaDipole3(fr, h, el) {    // Inv Vee on 12 m mast
  var s="antDipole3() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5, 2, 3, 4.5, 7, 10, 15];   // frequency list
  var ga = [-2.7, -1.6,-0.4, 0.1, 2.2, 2.7, 0.0];   // average gain over elevation
  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ; // Elevation list

  var g1 = [-100,-17.6,-13.1,  -10.9,-8.6,-6.9,    -4.4,-2.2,-0.6,    0.4,0.9];   // 1.5 MHz
  var g2 = [-100,-17.3,-12.7,  -10.4,-7.9,-6.5,    -3.3,-1.0,0.7,     1.7,2.2];   // 2 MHz
  var g3 = [-100,-17.4,-12.5,  -10.1,-7.4,-5.8,    -2.3,0.3,2.0,      3.1,3.5];   // 3 MHz
  var g4 = [-100,-17.5,-12,5,  -10.0,-7.0,-5.4,    -1.6,0.7,2.7,      2.8,4.2];   // 4.5 MHz
  var g5 = [-100,-18.9,-12.9,   -9.5,-5.3,-2.7,     2.5,4.2,4.7,      4.7,4.7];   // 7 MHz
  var g6 = [-100,-14.9,-9.0,    -5.6,-1.5,1.0,      5.2,5.4,4.3,      3.1,2.4];   // 10 MHz
  var g7 = [-100,-10.1,-4,3,    -1.0,3.0,5.1,       6.8,2.8,-6.0,   -3.0,-1.1];   // 15 MHz

  var g  = [g1, g2, g3, g4, g5, g6, g7]; // gain packed into one array
  //console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}

function antennaDipole4(fr, h, el) {    // Inv Vee on 18 m mast
  var s="antDipole4() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5,    2,   3, 4.5, 7,   10,   15];   // frequency list
  var ga = [-1.5,-0.6, 0.2, 2.4, 2.6, 0.8, 2.8];   // average gain over elevation
  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ; // Elevation list

  var g1 = [-100,-16.3,-11.8,  -9.6,-7.3,-5.5,     -3.1,-1.0,0.6,     1.6,2.0];  // 1.5 MHz
  var g2 = [-100,-16.1,-11.6,  -9.1,-6.7,-4.8,     -2.2,-0.2,1.6,     2.6,3.0];   // 2 MHz
  var g3 = [-100,-17.4,-11.3,  -8.9,-6.2,-4.1,     -1.3,0.9,2.4,       3.3,37];   // 3 MHz
  var g4 = [-100,-19.1,-13.1,   -9.7,-5.5,-1.8,     2.5,4.4,4.9,      5.0,5.0];   // 4.5 MHz
  var g5 = [-100,-14.5,-8.6,    -5.2,-1.1,2.3,       5.4,5.4,4.0,     2.4,1.6];   // 7 MHz
  var g6 = [-100,-9.5,-3.6,      -0.3,3.6,6.4,       7.1,2.4,-6.5,   -0.6,0.8];   // 10 MHz
  var g7 = [-100,-6.9,-1.1,       2.0,5.4,6.9,       -1.7,3.3,5.6,    4.0,2.5];   // 15 MHz

  var g  = [g1, g2, g3, g4, g5, g6, g7]; // gain packed into one array
  console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}

function antennaDipole5(fr, h, el) {    // Inv Vee on 26 m mast
  var s="antDipole5() ";
  console.log(s+"fr="+fr.toFixed(1)+",h="+h.toFixed(1)+", el="+el.toFixed(1));
  // Data from antenna pattern table
  var f  = [1.5,   2,   3, 4.5,   7,  10,  15];   // frequency list
  var ga = [0.4, 0.8, 1.1, 3.2, 0.5, 3.1, 3.6];   // average gain g(f)
  var e  = [0,2,4, 6,10,15, 30,45,60, 75,90] ;    // Elevation list

  var g1 = [-100,-14.0,-9.5,   -7.3,-5.1,-3.4,     -1.1,0.9,2.3,      3.2,3.6];  // 1.5 MHz
  var g2 = [-100,-14.1,-9.5,   -7.2,-4.8,-2.9,     -0.5,1.2,2.7,      3.6,3.9];   // 2 MHz
  var g3 = [-100,-17.3,-12.5,  -10.0,-7.1,-4.7,    -1.1,2.0,3.9,      5.2,5.6];   // 3 MHz
  var g4 = [-100,-15.0,-9.1,    -5.7,-1.5,2.0,       5.4,5.9,4.9,     3.7,3.0];   // 4.5 MHz
  var g5 = [-100,-9.0,-3.7,      -0.4,3.5,6.4,      7.3,2.8,-7.6,    -1.4,0.3];   // 7 MHz
  var g6 = [-100,-7.1,-1.4,       1.8,5.3,7.0,       0.1,0.9,5.7,     5.0,4.0];   // 10 MHz
  var g7 = [-100,-6.9,2.0,         4.8,7.1,5.3,       3.8,3.2,0.8,    5.1,5.3];   // 15 MHz

  var g  = [g1, g2, g3, g4, g5, g6, g7]; // gain packed into one array
  console.log(s+"eLen=" + e.length+", fLen=" + f.length);
  return antennaInterpolate(fr, h, el, f, e, g, ga);
}

// Interpolation of antenna pattern for frequency, elevation and height
function antennaInterpolate(fr, h, el, f, e, g, gavg) {
  // fr = operating frequency link uses in MHz
  // h = antenna height in m 
  // el = elevation link uses in degrees
  // f[] = frequency list for antenna pattern in MHz
  // e[] = elevation list for antenna pattern in degrees
  // g[f][e] = antenna pattern data

  var s1="antIntpol() ", s2;
  var eLen, fLen, eInx,fInx;
  var gain=[0, 0];    // gain[0] is exact for given elevation and frequency, gain[1] average gain
  eLen=e.length;
  fLen=f.length;
  //console.log(s1+"eLen=" + eLen+", fLen=" + fLen);

  // Lets find indexes for frequency and elevation
  var i, m;
  eInx=0; fInx=0;
  for(i=0; i<eLen; i++) {  // find elevation index 
    m=e[i]-0.1; 
    if(el > m) eInx=i; 
  }  
  for(i=0; i<fLen; i++) {  // find frequency index 
    m=f[i]-0.1; 
    if(fr > m) fInx=i; 
  } 
  // Update gain[] array using these indexes 
  gain[0] = g[fInx][eInx]; // exact gain for given frequency and elevation 
  gain[1] = gavg[fInx];    // average gain for given frequency
  console.log(s1+"eInx="+eInx+", fInx=", fInx);
  
  //Interpolate exact gain for elevation first,  then frequency
  var ga1, ga2;
  ga1 = g[fInx][eInx];
  //console.log(s1+"eInx="+eInx+", fInx=", fInx+", g="+ga1.toFixed(1));

  // interpolate for elevation first
  var dx=0, dy=0, dxdy=1, ds=0;
  if((eInx+1) < eLen) {                   // interpolate if there is next elevation index
    dy=g[fInx][eInx+1] - g[fInx][eInx];   // gain diff 
    dx = e[eInx+1]-e[eInx];               // elevation diff 
    if(dx>0.01) dxdy = dy/dx;             // gain slope 
    else dxdy=1.0;                        // default gain slope
    ds = dxdy*(el-e[eInx]);               // slope *  
    ga1 += ds;                            // gain change
    s2=s1+"1. dx="+dx.toFixed(3)+", dy="+dy.toFixed(3)+", ds="+ds.toFixed(3)+", ga1="+ga1.toFixed(2);
    //console.log(s2);
  }
  gain[0]=ga1;  // update gain[] with result of elevation interpolation

  if((fInx+2) > fLen)  return gain; // can't interpolate frequency with next index

  //interpolate average gain over frequency
  dx = f[fInx+1]-f[fInx];          // frequency diff on x axes
  dy = gavg[fInx+1]-gavg[fInx];    // gavg diff on y axes
  dxdy = dy/dx;                    // slope gavg(f)
  var dx2 = fr-f[fInx];
  ds = dxdy *(fr-f[fInx]);         // slope * frequency error 
  gain[1]= gavg[fInx] + ds;        // interpolation adjustment
  console.log("Ipol gavg["+fInx+"] dx2="+dx2+", ds="+ds.toFixed(2))

  // Interpolate exact gain for frequency
  ga2 = g[fInx+1][eInx];                      // Gain at the next frequency
  dy = g[fInx+1][eInx+1] - g[fInx+1][eInx];   // Interpolate for elevation 
  dx = e[eInx+1]-e[eInx];
  if(dx>0.01) dxdy = dy/dx;
  else dxdy=1.0;
  ds = dxdy*(el-e[eInx]);
  ga2 += ds;
  s2=s1+"2. dx="+dx.toFixed(3)+", dy="+dy.toFixed(3)+", ds="+ds.toFixed(3)+", ga2="+ga2.toFixed(2);
  //console.log(s2);
  // Interpolate two gains over frequency
  dx = f[fInx+1]-f[fInx];
  dy = ga2 - ga1;
  if(dx>0.01) dxdy = dy/dx;
  else dxdy=1.0;
  ds = dxdy*(fr - f[fInx]);
  ga1 += ds;
  s2=s1+"3. dx="+dx.toFixed(3)+", dy="+dy.toFixed(3)+", ds="+ds.toFixed(3)+", ga1="+ga1.toFixed(2);
  //console.log(s2);
  gain[0]=ga1;
  return gain;
}
 