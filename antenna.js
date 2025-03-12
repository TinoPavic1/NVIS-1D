function antennaGain(nvis) {      // Gets Gtx and Grx and updates nvis class
  var s1, s2;                 // declare few strings
  var g=[-20.0,-20];              // initialise gain array
  var fr=nvis.freq, a=nvis.antenna,  h=nvis.mast, e=nvis.elev;  // ant parameters
  s1="antennaGain() ";            // needed for console debug
  s2=s1+"fr="+fr.toFixed(1) + " e="+e.toFixed(1) + ", h=" + h.toFixed(1); // more console debug
  console.log(s2);  // show f,e and h
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
  s2=s1+" Gtx=" + nvis.gain.toFixed(1) + ",Grx=" + nvis.gain2.toFixed(1);  
  console.log(s2) ;   // show gains on console
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
  if(a == 12)  {  // OE-505 is like whip 3m - 6 dB
    g=antennaWhp3M(fr, h, e);  g[0] -= 6;  g[1] -= 6;
  }
  if(a == 13)  {  // DAE is like short dipole 3m high
    g=antennaDipole(fr, 3, e);
    if(fr<2.0)  { g[0] -= -23;  g[1] -= 23; } 
    if(fr<3.9)  { g[0] -= 13;   g[1] -= 13; }
    if(fr<4.5)  { g[0] -= 10;   g[1] -= 10; }
    if(fr<6.5)  { g[0] -= 6;    g[1] -= 6;  }
    if(fr<8.5)  { g[0] -= 3;    g[1] -= 3;  }
    if(fr<10.5) { g[0] -= 1;    g[1] -= 1;  } 
  }
  if(a == 14)  g=antennaCasgA2(fr, h, e);   // RF-1950 is like CASG-A2
  if(a == 15)  {  // RF-1912 is very similar to dipole
    g=antennaDipole(fr, h, e);  g[0] -= 3;  g[1] -=3;
  }
  if(a == 16)  {  // HT-21B is very similar to dipole
    g=antennaDipole(fr, h, e);  g[0] -= 2;  g[1] -=2;
  }
  return g;
}
