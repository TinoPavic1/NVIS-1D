function antennaGain(nvis) {      // Gets Gtx and Grx and updates nvis class
  var s1, s2, s3;                 // declare few strings
  var g=[-20.0,-20];              // initialise gain array
  var fr=nvis.freq, a=nvis.antenna,  h=nvis.mast, e=nvis.elev;  // ant parameters
  s1="antennaGain() ";            // needed for console debug
  s2=fr.toFixed(1) + " e="+e.toFixed(1) + ", h=" + h.toFixed(1); // more console debug
  // transmit antenna gain  g=[G,Gavg]
  g = myAntennaGain(a, fr, h, e);  
  nvis.gain=g[0];                  // update nvis class gain= Gtx
  // receive antenna gain Grx
  a=nvis.antenna2; h=nvis.mast2;   
  g = myAntennaGain(a, fr, h, e);  
  // update nvis class gain2= Grx
  nvis.gain2=0;                                 // case Grx off              
  if(nvis.grxMode == 1) nvis.gain2=g[0];        // case Grx on     
  if(nvis.grxMode == 2) nvis.gain2=g[0]-g[1];   // case Grx-Avg
  // console debug
  s3=" Gtx=" + nvis.gain.toFixed(1) + ",Grx=" + nvis.gain2.toFixed(1);  
  //console.log(s1 + "Rx " + s2 + s3); 
  console.log(s1 + s3) ;
  return g;
}

// gain for selected antenna and parameters - returns g=[G, Gavg]
function myAntennaGain(a, fr, h, e) { 
  var g=[-20.0,-20];
  //s1="myAntennaGain() a=" + a + ", fr=" + fr.toFixed(1);
  //s2=", fr=" + fr.toFixed(1) + " e="+e.toFixed(1) + ", h=" + h.toFixed(1);
  // From antenna type a we work out which antenna function to call
  if(a == 1)  g=antennaDipole(fr, h, e); 
  if(a == 2)  {  // CASSG-A1 is very similar to dipole
    g=antennaDipole(fr, h, e);  g[0] -= 1;  g[1] -=1;
  }
  if(a == 3)  {  // AS-F104 is very similar to dipole
    g=antennaDipole(fr, h, e);  g[0] -= 2.5;  g[1] -=2.5;
  }
  if(a == 4)  g=antennaRf1944(fr, h, e); // broadband dipole
  if(a == 5)  {  // MIL2 is very similar to Rf1944
    g=antennaRf1944(fr, h, e);  g[0] -= 2;  g[1] -=2;
  }
  if(a == 6)  g=antennaWhpBnt(fr, h, e);
  if(a == 7)  g=antennaWhp3M(fr, h, e);
  if(a == 8)  g=antennaHf230(fr, h, e);
  if(a == 9)  g=antennaCasgA2(fr, h, e);
  if(a == 10)  {  // Yagi 3el is like dipole +5 dB boost
    g=antennaDipole(fr, h, e);  g[0] += 5;  g[1] += 5;
  }
  if(a == 11) g=antennaVertMono(fr, h, e);
  return g;
}
