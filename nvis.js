class myNvis {
    constructor(name, c) {
        console.log("nvisContructor");
        this.id=name;       
        this.code=c; 
        this.canW=300; 
        this.canH=300; 
        this.snrM = [0,0,0,0];      
        this.snrD = [0,0,0,0];   
        this.snrN = [0,0,0,0];
        this.Lii  = [0,0,0,0];      
        this.Ldd  = [0,0,0,0];  
        this.Eii  = [0,0,0,0];       
        this.Nnn  = [0,0,0,0];
        this.Gtx  = [0,0,0,0];
        this.Grx  = [0,0,0,0];
        this.skipDist = [0,0,0,0];  
        this.skipSlm =  [0,0,0,0]; 
        this.skipB =  [0,0,0,0];  
        nvisInit(this);
    }
}

function nvisInit(nvis) {
  var dt = new Date(); // Current date 
  nvis.year = dt.getFullYear();  
  nvis.month = dt.getMonth()+1; 
  nvis.canW=screen.width; nvis.canH=screen.height;  // initial canvas size
  nvis.lat=-38;       nvis.lon=-144;    
  nvis.month=3;       nvis.year=2022;     nvis.ssn=80;
  nvis.viewMode=1;    nvis.distance=100;  
  nvis.gain=6;        nvis.power=52;      nvis.hops=1; 
  nvis.location=0;    nvis.storm=0;     nvis.eirp = 64;  
  nvis.hF2 = 300.0;   nvis.elev=90;     nvis.elevMin=10; nvis.freq=2.2;
  nvis.mast=12;       nvis.antenna=1;             //dipole at 12 m
  nvis.cycleCoe=1.0;  nvis.seasonCoe=1.0; nvis.latCoe=1.0; // Correction factors 
  nvis.fc1=2.3;  nvis.fc2=4.0;  nvis.fc3=5.0;     // foF2 (night, day, noon)
  nvis.muf1=2.5; nvis.muf2=4.1; nvis.muf3=5.1;    // MUF (night, day, noon)
  nvis.slm=1.0;  nvis.pathdist=100.0;  nvis.B=0.2; // secant law multiplier
  nvis.tria=6731; nvis.trib=7031; nvis.tric=300;  // great circle trianlge sides
  nvis.triAA=1;   nvis.triBB=1; nvis.triCC=1;     // great circle triangle angles
  nvis.maxHop = 3000.0;
  nvis.grxMode = 0;
  for(i=0; i<62; i++) {
    nvis.Eii[i]=47.0;     nvis.Lii[i]=200.0;    nvis.Ldd[i]=200.0;  
    nvis.Nnn[i]=-130;
    nvis.snrM[i]=-30.0;   nvis.snrD[i]=-30.0;   nvis.snrN[i]=-30.0;   
    nvis.Gtx[i] = -40.0;  nvis.Grx[i]=-40.0;      
  }
  for(i=0; i<92; i++) {
    nvis.skipDist[i]=0;  nvis.skipSlm[i]=1.0; nvis.skipB[i]=0.0;
  }  
  console.log("nvisInit() id="+nvis.id+",code="+nvis.code+", len=" + nvis.skipSlm.length);
  return nvis;
}

function nvisCheck(nvis) {
  var s="nvisCheck(): id="+nvis.id+", code="+nvis.code;
  if(nvis.id == "Nvis") { console.log(s+" OK!"); return 1;}
  console.log(s+ "  Error !!! Warning !"); return 0;
}

function D2R (n) { var n2 = Math.PI / 180; return n*n2;}
function R2D (n) { var n2 = Math.PI / 180; return n/n2;}

function maxHop(nvis) {      // Maximum hop distance on great circle
  var A, B,C;                // Triangle angles
  var a, b = 6371, c;        // Triangle sides, b=earth radius
  c= b + nvis.hF2;           // sides b and c are known 
  C = D2R(90 + 0);           // C = 90deg + elev, max hop is for elev=0 
  a = Math.sqrt(c*c - b*b);  // Pythagoras
  A = Math.asin(a/c);        // sina A = a/c
  var d = 40000.0 * A / Math.PI ; // great circle perimeter is 40,000 km
  d -= 50;
  console.log("maxHop(" + nvis.hF2 + ")="+ d.toFixed(1));
  nvis.maxHop = d;
  return d;
}

function D2E(nvis) {      // Distance to elevation on great circle
  var d, e;
  d = nvis.distance;
  var s = "D2E(" + d.toFixed(0) + ") ";
  if(d > maxHop(nvis)) {
    nvis.elev=-1.0;
    nvis.pathDistance=5000.0;
    console.log(s + " Error  d=", nvis.distance.toFixed(1));
    return -1;
  }
  var A, B,C;                   // Triangle angles
  var a, b = 6371, c;           // Triangle sides
  c= b + nvis.hF2;              // sides b and c are known constants
  A = Math.PI * d / 40000;      // calc A from great circle angular distance
  a = (c*c) + (b*b) - 2 * (b*c) * Math.cos(A);    // cos rule
  a = Math.sqrt(a);                         // side a = path.dist/2
  console.log(s + ") A=" + R2D(A).toFixed(2) + ",  a=" + a.toFixed(1));
  B = (b / a) * Math.sin(A); 
  B = Math.asin(B);                           // sine law => B
  C = Math.PI - A - B;                        // C = 180-A-B
  console.log(s+ "B:" + R2D(B).toFixed(2) + ", C=" + R2D(C).toFixed(C));
  nvis.elev = C - Math.PI / 2;                // Elev = C-90deg
  nvis.slm = 1.0 / Math.cos(B);               // secant law multiplier
  nvis.pathdist = a * 2;                      // FSPL distance
  nvis.B = B;
  console.log(s+ "El=" + R2D(nvis.elev).toFixed(1) + ", PaDi=" + nvis.pathdist.toFixed(1)+", slm=" + nvis.slm.toFixed(3)); 
  return nvis.elev;
}

function calcHops(nvis) {   // No of hops, limited by minimum site elevation
  var el1, el2, di1, hops=1;
  el1 = D2R(nvis.elevMin);   // site minimum elevation - deg to rad
  di1 = nvis.distance;
  el2 = D2E(nvis);      // elevation angle in radians
  while (el2 < el1) {
    hops++;
    nvis.distance = di1 / hops;
    el2 = D2E(nvis); // elevation angle in radians
  }
  console.log("calcHops(1) hops="+hops+", el1="+ R2D(el1).toFixed(1)+", el2="+R2D(el2).toFixed(1));
  nvis.elev = el2;  
  nvis.hops = hops; 
  nvis.elev *= 180 / 3.1414;   // into degrees
  //console.log("calcHops(2)Dist="+ nvis.distance+", hops="+nvis.hops);
}

function calcCoe(nvis) { // Current SSN, cycleCoe, seasonCoe, latCoe
  var yr = (12*nvis.year+ nvis.month)/12;
  nvis.cycleCoe = 1.0 - (Math.abs(2025.5 - yr)) / 6.0; 
  nvis.ssn = nvis.cycleCoe * 170;
  //console.log("cycleCor() Yr=" + nvis.year + ",cycleCoe=" + nvis.cycleCoe);
  nvis.seasonCoe = (Math.abs(nvis.month - 6.0)) / 6.0;
  //console.log("cycleCor() Mo=" + nvis.month + ",seasonCoe=" + nvis.seasonCoe);
  nvis.latCoe = (nvis.lat + 43) / 31;
  console.log("cycleCor() lat=" + nvis.lat.toFixed(3) + ", latCoe=" + nvis.latCoe.toFixed(3));
} 

function calcfoF2(nvis) {  // foF2 daily minimum   min 2.0, lat+0.5, fold at S 23 
  var c, d, e, f;
  c = nvis.latCoe;  d = nvis.seasonCoe; e = nvis.cycleCoe;  
  // find minimum foF2
  f = 1.8 + (d * 0.8);     // winter 1.8, summer 2.6
  f *= (e + 1);            // Solar peak doubles
  if(f < 1.8) { f = 1.8;}    // Low limit
  if(f > 6.5) { f = 6.5;}    // hi limit
  nvis.fc1=f;
  // find maximum foF2 
  c=nvis.latCoe;  d = nvis.seasonCoe; e = nvis.cycleCoe;
  f = 4.7 + c;             // low season first 4.7 to 5.7
  if(d > 0.5  &&  c < 0.65 ) { d = 0.5 }  // summer and equinox equal
  f *= 1 + 0.9*d;   // summer almost doubles in tropics
  f *= (1 + 1.8*e);   // half cycle is 10% improvement
  if(f < 4.7)  { f = 4.7; } 
  if(f > 14.3) { f = 14.3;}
  nvis.fc3 = f;                   // daily maximum
  nvis.fc2 = (f + nvis.fc1) / 2;    // mid value
  console.log("caclfoF2() fc1=" + nvis.fc1.toFixed(1) + ", fc3=" + nvis.fc3.toFixed(1));
} 


function latestfoF2(nvis) {  // current foF2 min max from Ionosondes
  var t=nvis.lat;
  var f1=3.0, f3=0.0;          // Mawson Station, Antarctica   
  if(t>-50) {f1=3.5; f3=7.7; } // Hobart
  if(t>-40) {f1=5.0; f3=10.0; } // Learmonth, Vic
  if(t>-36) {f1=3.5; f3=8.0; } // Canberra
  if(t>-34.5) {f1=4.2; f3=9.0; } // Camden, Sydney
  if(t>-32.5) {f1=4.2; f3=9.0; } // Perth
  if(t>-31) {f1=5.0;  f3=11.5;  } // Brisbane
  if(t>-23) {f1=5.5; f3=12.6; }    // Townsville
  if(t>-15) {f1=6.0; f3=14.5; }   // Darwin
  f2 = (f1+f3)/2;// adjust f2
  console.log("latestfoF2(), f1= " + f1.toFixed(1) + ",f3=" + f3.toFixed(1));
  // Mix with prediction
  var ye=2025, mo=3, da=17;   // date when Ionosonde adjusted  
  var d1 = ye*365 + mo*30.5 + da;
  var d2 = nvis.year*365 + nvis.month*30.5 + 15; // adjustment age in days
  var me=(d2-d1)/90; me=Math.abs(me); // mix factor
  if(me > 1.0) me=1.0;
  nvis.fc1*=me; nvis.fc1+=f1*(1-me);
  nvis.fc2*=me; nvis.fc2+=f2*(1-me);
  nvis.fc3*=me; nvis.fc3+=f3*(1-me);
  console.log("MixfoF2(), f1= " + f1.toFixed(1) + ",f3=" + f3.toFixed(1) + ",me=" + me.toFixed(2));
}  

function calcMuf(nvis) {   // Maximum Usable Frequencies (MUF)
  var c = nvis.fc2;
  var fh=0.6;
  if(nvis.distance > 150)   fh = 0.45;  // half gyro frequency in MHz
  if(nvis.distance > 600)   fh = 0.32;
  if(nvis.distance > 1200)  fh = 0.23;
  if(nvis.distance > 2500)  fh = 0.15;
  nvis.muf1 = nvis.fc1 + fh;            // add half gyro
  nvis.muf1 *= 0.9 * nvis.slm;          // multiply with SLM
  nvis.muf2 = nvis.fc2 + fh;  
  nvis.muf2 *= 0.9 * nvis.slm;
  nvis.muf3 = nvis.fc3 + fh;  
  nvis.muf3 *= 0.9 * nvis.slm;
  console.log("calcMuf(), f1= " + nvis.muf1.toFixed(1) + ",muf3=" + nvis.muf3.toFixed(1));
}

function showSel(nvis) {
  var s= "Lat=" + nvis.lat  + ", Mon=" + nvis.month + ", Yr=" + nvis.year;
  return s;
}

function showCoe(nvis) {
  var s;
  s = "showCoe() Cyc=" + nvis.cycleCoe.toFixed(2); 
  s += ", Sea=" + nvis.seasonCoe.toFixed(2); 
  s += ", Lat=" + nvis.latCoe.toFixed(2); 
  return s;
}

function showfoF2(nvis) {
  var s;
  s = "foF2: "+nvis.fc1.toFixed(1)+", "+nvis.fc2.toFixed(1);
  s += ", "+nvis.fc3.toFixed(1);
  s += ", SSN:" + nvis.ssn.toFixed(0)+", SLM:" + nvis.slm.toFixed(2);
  return s;
}

function showMuf(nvis) {
  var s1 = "FOT: " + nvis.muf1.toFixed(1);
  s1 += ", " + nvis.muf2.toFixed(1);
  s1 += ", " + nvis.muf3.toFixed(1);
  s1 += ", Hop:" + nvis.hops;
  var s2 = '\xB0';
  s1 += ", El:" + nvis.elev.toFixed(1) + s2;
  var c = R2D(nvis.B);
  s1 += ", B:" + c.toFixed(1) + s2;
  return s1;  
}

function calcSNR(nvis) {    // frequency scan
  console.log("calcSNR() started, PaDi=" + nvis.pathdist.toFixed(1));
  var i, li, ld, n, mf;
  nvis.freq = 1.5;
  for( i=0; i<58; i++) {   // Calculate SNR data
    nvis.snrM[i]=-30.0; 
    nvis.snrD[i]=-30.0; 
    nvis.snrN[i]=-30.0;
    //nvisCheck(nvis); 
    n=antennaGain(nvis);  // Gt in dBm
    nvis.Gtx[i]=nvis.gain;
    nvis.Grx[i]=nvis.gain2;
    nvis.eirp= nvis.power + nvis.gain; // Eirp in dBm
    nvis.Eii[i]=nvis.eirp;
    li= calcFSPL(nvis); 
    nvis.Lii[i] = li; 
    ld= calcDrap(nvis);  
    nvis.Ldd[i] = ld;
    n = calcNoise(nvis);  
    nvis.Nnn[i] = n;   
    //nvis.snrM[i] = nvis.eirp + nvis.gain2 - li - ld - n; // MidDay Snr
    nvis.snrM[i] = nvis.eirp - li - ld - n + nvis.gain2; // MidDay Snr
    mf= nvis.muf3*1.2;
    if(nvis.freq > mf) nvis.snrM[i] = -50.0;
    nvis.snrD[i] = nvis.snrM[i] + 0.3333 * ld;       // Day SNR
    mf = nvis.muf2 * 1.2; 
    if(nvis.freq > mf) nvis.snrD[i] = -50.0;
    nvis.snrN[i] = nvis.snrM[i] + ld - 10;      // Night SNR
    mf = nvis.muf1 * 1.2; 
    if(nvis.freq > mf) nvis.snrN[i] = -50.0;
    mf = nvis.freq / nvis.fc3;                    // Midday frequency radio
    if(i==0 || i==10) console.log("calcSNR("+nvis.freq.toFixed(2)+") FSPL="+nvis.Lii[i].toFixed(0)); 
    nvis.freq += 0.5
  } 
}

// Use hF2 and loop elevation angle C => calculate SLM and skip distance
function caclSkip(nvis) {    // save skip and slm for each degree elev (0 to 90)
  var el, v1, v2, di;        
  var a, b=6371, c, A, B,C;       // Triangle with b = Earth radius 
  c= b + nvis.hF2;                // triangle side c = b+hF2
  // sides b and c are known , angle C will loop
  for(el=0; el<91; el++) {        // wave elevation angle (horizon=0)
    C = 90 + el;                  // triangle angle C for given el
    C  =D2R(C);                   // angle C in radians
    v1 = (b / c) * Math.sin(C);   // sinus rule: b/c = sinB/sinC => sinB= (b/c) *sinC
    B = Math.asin(v1);            // wave incidence angle into F2 (vertical=normal=0)
    v2 = 1.0 / Math.cos(B);       // secant law multiplier (SLM)
    nvis.skipSlm[el] = v2;        // store SLM into array, 1 for every elevation
    nvis.skipB[el] = R2D(B);      // store angle B in degrees (incident angle into F2 layer)
    A = Math.PI - C - B;          // angle A from A+B+C=180 degrees
    di= 40000.0 * A / Math.PI;    // terrestrial distance as arc of great circle
    nvis.skipDist[el]= di;        // save skip distance into array
    if(el==0)  console.log("calcSkip(" + el + ") Di=" + di.toFixed(0) + " slm=" + v2.toFixed(3)+",B="+R2D(B).toFixed(1));
  }
}

// Single function does all required data processing
function nvisPredict (nvis) {
  console.log("nvisPredict(1)");
  nvisCheck(nvis);    // check if class object is OK
  maxHop(nvis);       // max hop distance
  calcHops(nvis);     // calc hops and elevation, calls Dist2El()
  calcCoe(nvis);      // calc cycleCoe, latCoe and seasonCoe
  calcfoF2(nvis);     // estimate foF2 
  latestfoF2(nvis);   // latest Ionosonde data mixed with estimate
  calcMuf(nvis);      // calc MUF from foF2 (add half gyro, mult with SLM)
  caclSkip(nvis);     // calc skip zone, SLM and angle B
  calcSNR(nvis);      // calc SNR for night, day and midday
}
