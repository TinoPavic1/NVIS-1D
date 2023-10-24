function sunLat(nvis) {  // latitude where sun is vertically up at noon
  var co=0;
  mo = nvis.month;
  if(mo ==1) co=-16;  
  if(mo ==2) co=-8;     
  if(mo ==3) co=0;
  if(mo ==4) co=8;    
  if(mo ==5) co=16;     
  if(mo ==6) co=23;
  if(mo ==7) co=16;   
  if(mo ==8) co=8;      
  if(mo ==9) co=0;
  if(mo ==10) co=-8;  
  if(mo ==11) co=-16;   
  if(mo ==12) co=-23;
  //console.log("sunLat() mo=", mo+", co="+ co);
  return co;
}

function calcFSPL(nvis) {   // FSPL = free space path loss
  var li1=0, li2=0, li3=0;
  li1= 20 * Math.log10(nvis.pathdist * nvis.freq) + 32.44; // single hop FSPL
  li2 = 20 * Math.log10(nvis.hops);  // multihop - square of distance
  li3 = 2 * (nvis.hops - 1);         // multihop - loss from ground reflections
  return (li1 + li2 + li3);
}

function calcDrap(nvis) {   // calculate D region absorption 
  // predicting DRAP at 2.2 MHz
  var ls = sunLat(nvis) - nvis.lat; // sun angle from normal at noon
  var ld = Math.cos(ls * 3.1414 / 180);  
  var ld2 = 30 + 25 * ld; 
  var a = nvis.pathdist / (2 * nvis.hF2); 
  var ld3 = ld2 * a;    // DRAP at 2.2 MHz
  //console.log("calcDrap(1) ls=" +ls + ", ld=" + ld.toFixed(0) + ", ld2=" + ld2.toFixed(0));
  // Frequency correction
  var n = 2.2 / nvis.freq;      // freq ratio with 2.2 MHz
  var n2 = Math.pow(n, 1.5);    // ratio to power of 1.5  
  ld3 *= n2;                    // frequency correction
  var ld4 = ld3 * nvis.hops;    // multihop link DRAP correction
  //console.log("calcDrap(2) a=" + a.toFixed(0) + ", ld3=" + ld3.toFixed(0) + ",'ld4=" + ld4.toFixed(0));
  return ld4;
}

function calcNoise(nvis) {     // ITU recommendation for radio noise ITU-R P.373
  var s="calcNoise(" + nvis.freq.toFixed(1) + ") ";
  var f = nvis.freq;
  // Atmospheric noise exceeded 0.5% of time
  var a = 92 - 60.412 * Math.log10(f/1.5); // 92 at 1.5, 0 at 50
  if(f > 15) a -= 30 + Math.log10(f/15);   // quicker descent above 15 MHz
  // Atmospheric noise exceeded 99.5% of time
  var b = 2+ 41.45 * Math.log10(f/1.5);     // 2 at 1,5, 27 at 6    
  if(f > 6) b = 27;                         // flat around 6 MHz
  if(f > 10) b = 27 - 56.59 * Math.log10(f / 10); // descends after 10 MHz
  if(f > 20) b -= 30 * Math.log10(f / 20);  // quicker descent after 20 MHz
  // Atmospheric noise for selected weather 
  var ab = b;
  if(nvis.storm == 2)  ab += (a-b) / 3;
  if(nvis.storm == 3)  ab += (a-b) / 2;
  if(nvis.storm == 4)  ab = a;
  //console.log(s + " a=", a.toFixed(0) + ", b= "+ b.toFixed(0) + ", ab=" + ab.toFixed(0));
  // man made noise, quiet receiving site  
  var c = 48 - 28.75 * Math.log10(f/1.5); // 48 at 1.5 MHz, 0 at 70 MHz   
  // man made noise, city
  var e = 72 - 25.76 * Math.log10(f/1.5); // 72 at 1.5 MHz, 25 at 100 MHz 
  // man made noise for selected location type
  var ce = c;                             // rural
  if(nvis.location == 3)  ce = e;         // city
  if(nvis.location == 2)  ce = (c+e)/2;   // subburb in between  
  //console.log(s + " c=", c.toFixed(0) + ", e= "+ e.toFixed(0) + ", ce=" + ce.toFixed(0));
  // galactic noise
  var d = 0;                                // 0 under 3 MHz
  if(f > 3) d = 20 + 136 * Math.log10(f/3);   // 20 at 3 MHz, 37 at 4 MHz
  if(f > 3.95) d=37;
  if(f > 4.95) d -= 21.52 * Math.log10(f/5);  // 37 at 5 MHz, 9 at 100 MHz 
  // find the strongest noise type 
  var n = ab;
  if(ce > n)   n = ce;  
  if( d > n)   n = d;
  //console.log(s+"d=" + d.toFixed(0) + ", n=" + n.toFixed(0) + ", n+139=" + (n-139).toFixed(0));
  return (n - 139.0);    // Johnston Nyquist noise level for BW=3 kHz
}




 

 