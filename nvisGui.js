  
function selUpdate(nvis) {    // selection has changed
  var sel, inx;
  sel=document.getElementById("selAct").value; 
  inx = parseInt(sel);
  if(inx < 6)   nvis.viewMode=inx;
  if(inx == 9) { window.location.assign("help.htm"); return; }   
  sel=document.getElementById("statex").value; 
  nvis.lat=parseFloat(sel);
  sel=document.getElementById("month").value;   
  nvis.month=parseInt(sel);
  sel=document.getElementById("year").value;  
  nvis.year=parseInt(sel);
  sel=document.getElementById("hiF2").value; 
  nvis.hF2=parseFloat(sel);  
  sel=document.getElementById("mast").value; 
  nvis.mast=parseFloat(sel);
  sel=document.getElementById("antenna").value; 
  nvis.antenna=parseInt(sel);
  sel=document.getElementById("mast2").value; 
  nvis.mast2=parseFloat(sel);
  sel=document.getElementById("antenna2").value; 
  nvis.antenna2=parseInt(sel);
  sel=document.getElementById("power").value; 
  nvis.power=parseInt(sel);
  sel=document.getElementById("elmin").value; 
  nvis.elevMin=parseInt(sel);
  sel=document.getElementById("dist").value;  
  nvis.distance=parseFloat(sel);
  sel=document.getElementById("loc").value;   
  nvis.location=parseInt(sel);
  sel=document.getElementById("storm").value; 
  nvis.storm=parseInt(sel);
  sel=document.getElementById("selGrx").value; 
  nvis.grxMode=parseInt(sel);
  console.log("selChange() ViewMode="+nvis.viewMode+",grxMode="+nvis.grxMode); 
  getCanvasSize(nv);   
  nvisPredict(nvis);
  canvasDraw(nvis);
}

function getCanvasSize(nvis) {  // mobile and viewport issues
  var s="getCanvasSize() ";     // canvas size may change at times
  var canv = document.getElementById("myCanvas");   // find canvas element  
  nvis.canW = canv.width;
  nvis.canH = canv.height;                           
  console.log(s+" w="+nvis.canW+", h="+nvis.canH); 
}

function setCanvasSize(nvis) { // mobile and viewport issues
  // mobile browsers manage divs differently, due to small pixel size
  var mobl=0;                  // can we work out if device is mobile ?
  var w=screen.width; 
  var h=screen.height;         // if height > width => mobile?
  console.log("sizeCanvas(1) Screen=" + w + " x " + h); 
  if(!mobl) {      // non mobile device limits
    if(w > 900 )    w = 900; 
    if(h > 1100)    h = 1100;
  }
  if(w > 2500)    w = 2500; // non-mobile device limits
  if(h > 2500)    h = 2500;
  console.log("sizeCanvas(2) Canvas=" + w + " x " + h); 
  nvis.canH=h; 
  nvis.canW=w;
}


function canvasDraw(nvis) {     // drawing on canvas
  var scr = getCanvasSize(nv);
  var canvas = document.getElementById("myCanvas");   // find canvas element                             // Set canvas size
  canvas.width=nvis.canW;  canvas.height=nvis.canH;   // set canvas size
  var ctx = canvas.getContext("2d");                  // get drawing object
  ctx.clearRect(0, 0, nvis.canW, nvis.canH);          // clear rectangle
  ctx.font = "23px Arial";        // draw text
  var s = showfoF2(nvis) + "--" + showMuf(nvis);
  ctx.fillStyle = "blue"; ctx.fillText(s, 1, 20);   
  
  if(nvis.viewMode==1)  canvasTable(nvis);
  if(nvis.viewMode==2)  canvasSNR(nvis);
  if(nvis.viewMode==3)  canvasSkip(nvis);
  if(nvis.viewMode==4)  canvasSlm(nvis);
}

function canvasTable(nvis) {      // drawing table on canvas
  var s1="canvasTable()", s2, s3; // declare few strings
  var x, y;                       // position variables
  getCanvasSize(nvis);
  var canvas = document.getElementById("myCanvas");   // find canvas element                             // Set canvas size
  var ctx = canvas.getContext("2d");           // get drawing object
  ctx.clearRect(0, 35, nvis.canW, nvis.canH);
  // Work out table dimensions
  var i, rows=26, cols=10;            //Table with 26 rows and 10 columns
  var margL=10, margR=20, margT=30, margB=200;  //Margins - left, right, top,botom,
  var rowH = Math.round(( nvis.canH - margT- margB )/rows); rowH -= 1;
  var colW = Math.round((nvis.canW-margL-margR)/cols);   colW -= 1;
  s2 = "rows="+rows+", cols="+cols+",w="+colW+",h="+rowH;
  console.log(s1+s2);
  // draw horizontal grid lines
  for(i=0; i<(rows+1); i++) {  // Draw horizontal grid lines
    ctx.beginPath();
    ctx.moveTo(margL, margT+rowH*i);
    ctx.lineTo(margL+cols*colW, margT+rowH*i);
    ctx.strokeStyle="lightgray"; 
    ctx.stroke();
  } 
  for(i=0; i<(cols+1); i++) { // Draw vertical grid lines
    ctx.beginPath();
    ctx.moveTo(margL+i*colW, margT);
    ctx.lineTo(margL+i*colW, margT+rows*rowH);
    ctx.strokeStyle="lightgray"; 
    ctx.stroke();
  }
  // Draw header row
  ctx.font = "25px Arial"; 
  if(rowH<30  ||  colW<70) ctx.font = "20px Arial"; 
  ctx.fillStyle="blue";    ;// select font 
  x=margL+10; y=margT+25;
  s3=["f","Eirp","Grx","Lfs", "Ld","Lt","N","SnrM","SnrD","SnrN"];   
  for(i=0;i<cols; i++) { ctx.fillText(s3[i], x, y); x+=colW;};
  // Draw data in table cells
  ctx.fillStyle= "black";
  nvis.freq=1.5;
  var inx=0;
  var mf=nvis.muf1*1.18;
  for ( i=0; i<25; i++) {    // drawing rows
    nvisCheck(nvis);
    x = margL+10;             // text position to col 1
    y=margT + (i+2)*rowH-5;        // text position to row i
    ctx.fillStyle="black";
    mf = nvis.muf3 * 1.18;
    if(nvis.freq > nvis.muf3) ctx.fillStyle="orange";
    if(nvis.freq > mf) ctx.fillStyle="red";
    s = nvis.freq.toFixed(1);   // Frequency field
    ctx.fillText(s, x, y);            
    li =nvis.Eii[inx];          // Eirp field
    s=Math.round(li);  
    x+=colW; ctx.fillText(s, x, y);  
    li =nvis.Grx[inx];          // Grx field
    s=Math.round(li);     
    x+=colW; ctx.fillText(s, x, y); 
    li= nvis.Lii[inx];          // FSPL loss
    s=Math.round(li);     
    x+=colW; ctx.fillText(s, x, y);
    ld= nvis.Ldd[inx];          // DRAP loss
    s=Math.round(ld);      
    x+=colW; ctx.fillText(s, x, y);
    s=Math.round(li+ld);        // Total loss (FSPL+DRAP)
    x+=colW; ctx.fillText(s, x, y);
    n = calcNoise(nvis);        // Noise at Rx site, per ITU recommendation
    s=Math.round(n);     
    x+=colW; ctx.fillText(s, x, y);
    s=Math.round(nvis.snrM[inx]); // MidDay Snr
    x+=colW; ctx.fillText(s, x, y);
    mf = nvis.muf3*1.01;        // Day SNR
    if(nvis.freq > mf) ctx.fillStyle="red";
    s=Math.round(nvis.snrD[inx]); 
    x+=colW; ctx.fillText(s, x, y);  
    mf = nvis.muf1*1.18;        // Night SNR
    if(nvis.freq > mf) ctx.fillStyle="red";
    s=Math.round(nvis.snrN[inx]); 
    x+=colW; ctx.fillText(s, x, y); 
    nvis.freq+=0.5; inx++;              // Indexing 0.5 MHz
    if(i>8) { nvis.freq+=0.5; inx++;}   // Indexing 1 MHz
    if(i>14) { nvis.freq+=1.0; inx+=2;} // Indexing 2 MHz
  }  
  // Add text bellow table
  y=margT+rowH*rows+30;     // position
  ctx.fillStyle="blue";      ctx.font = "20px Arial";        // font select
  ctx.fillText("Eirp is transmitted signal power at origin in dBm units.", 1, y); y+=25;
  ctx.fillText("Lfs is signal loss over signal path in dB units (daily maximum).", 1, y); y+=25;
  ctx.fillText("Ld (DRAP) is signal loss in D layer in dB (daily maximum).", 1, y); y+=25;
  ctx.fillText("Lt is total signal loss(Fspl+Drap) in dB (daily maximum).", 1, y); y+=25;
  ctx.fillText("N is noise power at receive location in dBm units, for BW=3kHz.", 1, y); y+=25;
  ctx.fillText("Snr is ratio of signal S and noise N in dB units.", 1, y); y+=25;
  ctx.fillText("SnrM/D/N are Snr levels for midday/day/night.", 1, y); y+=25;
  ctx.fillStyle="red"; 
  ctx.fillText("Signal must overcome noise, in order to be received.", 1, y); y+=25;
  ctx.fillText("Minimum SNR is 10 dB for SSB voice, and -20 dB for data.", 1, y); y+=25;
}

function canvasSNR(nvis) {    // drawing SNR on canvas
  var s1 ="canvasPlot() ", s2, s3;   // declare few strings
  var x,y;       // position 
  nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 35, nvis.canW, nvis.canH);
  // Work out grid dimensions
  var i, rows=12, cols=15;            //Grid with 12 rows and 15 columns
  var margL=50, margR=20, margT=30, margB=500;  //Margins - left, right, top,botom,
  var xDiv=2, yDiv=6;
  var rowH = Math.round(( nvis.canH - margT- margB )/rows); rowH -= 1;
  var colW = Math.round((nvis.canW-margL-margR)/cols);   colW -= 1;
  var xMin,xMax, yMin,yMax;         // grid min max coordinates
  xMin = margL; xMax = xMin + cols*colW;  // x grid
  yMin = margT; yMax = yMin + rows*rowH;  // y grid

  s2 = "rows="+rows+", cols="+cols+",w="+colW+",h="+rowH;
  console.log(s1+s2);
  ctx.font = "20px Arial";  ctx.fillStyle = "black";   // prepare font
  // draw horizontal grid lines
  ctx.strokeStyle="lightgray";  
  y=margT;
  for(i=0; i<(rows+1); i++) {  // Draw horizontal grid lines
    ctx.beginPath();
    ctx.moveTo(xMin, y);
    ctx.lineTo(xMax, y);  
    ctx.stroke();
    y += rowH;
  }
  // Draw vertical grid lines
  x=margL; 
  for(i=0; i<(cols+1); i++) { 
    ctx.beginPath();
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
    ctx.stroke();
    x+=colW;
  }
  // Mark x axes
  x = margL-10; y = yMax + 20; 
  for(i=0; i<(cols+1); i++) {     
    s3=xDiv*i;
    if(i==cols) { s3="MHz";x-=20;}
    ctx.fillText(s3, x, y); 
    x+=colW;
  }  
  // Mark y axes
  x = margL - 25;   y = yMax - rowH +5;
  for(i=1; i<rows; i++) { 
    s = yDiv*i - 12;
    ctx.fillText(s, x, y);
    y -= rowH;
  }
  // Draw plot title 
  s3="Signal to noise ratio (SNR) 6 dB/div";  
  ctx.fillText(s3, nvis.canW/2, margT+25);
  // Plot SNR data
  ctx.lineWidth=2;
  ctx.beginPath();     // Plot SNR midday data 
  var fr=1.5;
  x = xMin + fr * colW / xDiv;  
  ctx.moveTo(x, yMax);
  for ( i=0; i<58; i++) {   
    sg = nvis.snrM[i];
    if(sg < -12.0)  sg=-12.0;
    if(sg > 60)     sg=60;
    y = sg * rowH / yDiv + 2*rowH;  
    y=Math.round(yMax-y);
    x = fr * colW / xDiv;  
    x=Math.round(xMin+x);
    ctx.lineTo(x,y);  
    fr += 0.5;
  }
  ctx.strokeStyle = "red"; ctx.stroke();
  ctx.fillStyle="red"; ctx.fillText("Midday", xMin+5, yMin+25);
  // Plot SNR day data 
  ctx.beginPath();      
  fr=1.5;
  x = xMin + fr * colW / xDiv;  
  ctx.moveTo(x, yMax);
  for ( i=0; i<58; i++) {   
    sg = nvis.snrD[i];
    if(sg<-12.0)  sg=-12.0;
    if(sg>60)   sg=60;
    y = sg * rowH / yDiv + 2*rowH;  
    y=Math.round(yMax-y);
    x = fr * colW / xDiv;  
    x=Math.round(xMin+x);
    ctx.lineTo(x,y);  
    fr += 0.5;
  }
  ctx.strokeStyle = "green"; ctx.stroke();
  ctx.fillStyle="green"; ctx.fillText("Day", xMin+80, yMin+25);
  // Plot SNR Night data
  ctx.beginPath();      
  fr=1.5;
  x = xMin + fr * colW / xDiv;  
  ctx.moveTo(x, yMax);
  for ( i=0; i<58; i++) {   
    sg = nvis.snrN[i];
    if(sg<-12.0)  sg=-12.0;
    if(sg>60)   sg=60;
    y = sg * rowH / yDiv + 2*rowH;  
    y=Math.round(yMax-y);
    x = fr * colW / xDiv;  
    x=Math.round(xMin+x);
    ctx.lineTo(x,y);  
    fr += 0.5;
  }
  ctx.strokeStyle = "blue"; ctx.stroke();
  ctx.fillStyle="blue"; ctx.fillText("Night", xMin+140, yMin+25);
  // Add text bellow plot
  ctx.fillStyle="blue";      y=yMax+50;  
  ctx.fillText("Graph shows SNR levels for midday, day and night.", 1, y); y+=30;
  ctx.fillText("SNR is ratio of signal S and noise N in decibel (dB) units.", 1, y); y+=30;
  ctx.fillText("Signal must overcome noise, in order to be received.", 1, y); y+=30;
  ctx.fillText("Minimum SNR is 10 dB for SSB voice, and 6 dB for data.", 1, y); y+=30;
  ctx.fillText("Better antenna and more power can improve SNR.", 1, y); y+=30;
  ctx.font="bold 20px arial"; ctx.fillStyle = "red";
  ctx.fillText("Using Frequency of Optimal Transmission (FOT) is the single most important factor.", 1, y); y+=30;
  ctx.fillText("Ionosphere changes all the time, and optimal frequencies also change.", 1, y); y+=30;
  ctx.fillText("Critical frequencies raise during day (say 10 MHz), and drop during night (say 2 MHz).", 1, y); y+=30;
  ctx.fillText("For daytime only link we may need only one frequency.", 1, y); y+=30;
  ctx.fillText("For day and night link we will need at least two frequencies.", 1, y); y+=30;
  ctx.font="italic 20px arial"; ctx.fillStyle = "green";
  ctx.fillText("Some very common mistakes are:", 1, y); y+=30;  
  ctx.fillText("1. Using too high frequency for links under 500 km.", 1, y); y+=30;
  ctx.fillText("         This creates skip zone without coverage, and we can link only over 1000 km and more.", 1, y); y+=30;
  ctx.fillText("2. Using single frequency antenna (say AS-F104) for 3G.", 1, y); y+=30;
  ctx.fillText("         3G can not find optimal frequency, it is stuck unless antenna is retuned.", 1, y); y+=30;
  ctx.fillText("         Ionosphere keeps changing, and link keeps fading in and out.", 1, y); y+=30;
}

function canvasSkip(nvis) {    // drawing skip on canvas
  var s1 ="canvasSkip() ", s2, s3;   // declare few strings
  var x,y;       // position 
  nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 35, nvis.canW, nvis.canH);
  // Work out grid dimensions
  var i, rows=10, cols=15;            //Grid with 10 rows and 15 columns
  var margL=50, margR=20, margT=30, margB=500;  //Margins - left, right, top,botom,
  var xDiv=2;         // x axes grid 2 MHz per division
  var yDiv=500;       // y axes grid 500 km per division
  var rowH = Math.round(( nvis.canH - margT- margB )/rows); rowH -= 1;
  var colW = Math.round((nvis.canW-margL-margR)/cols);   colW -= 1;
  var xMin,xMax, yMin,yMax;         // grid min max coordinates
  xMin = margL; xMax = xMin + cols*colW;  // x grid min max
  yMin = margT; yMax = yMin + rows*rowH;  // y grid min max
  // Talk to console
  s2 = "rows="+rows+", cols="+cols+",w="+colW+",h="+rowH;
  console.log(s1+s2);
  // draw horizontal grid lines
  ctx.font = "20px Arial";  ctx.fillStyle = "black";   // prepare font  
  ctx.strokeStyle="lightgray";  
  y=margT;
  for(i=0; i<(rows+1); i++) {  // Draw horizontal grid lines
    ctx.beginPath();
    ctx.moveTo(xMin, y);
    ctx.lineTo(xMax, y);  
    ctx.stroke();
    y += rowH;
  }
  // Draw vertical grid lines
  x=margL; 
  for(i=0; i<(cols+1); i++) { 
    ctx.beginPath();
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
    ctx.stroke();
    x+=colW;
  }
  // Mark x axes
  x = margL-10; y = yMax + 20; 
  for(i=0; i<(cols+1); i++) {     
    s3=xDiv*i;
    if(i==cols) { s3="MHz";x-=20;}
    ctx.fillText(s3, x, y); 
    x+=colW;
  }  
  // Mark y axes
  x = margL - 25;   y = yMax - rowH +5;
  for(i=1; i<rows; i++) { 
    s = yDiv*i+"km";
    ctx.fillText(s, x, y);
    y -= rowH;
  }
  // Draw plot title 
  s3="Skip Zone 500 km/div";  
  ctx.fillText(s3, nvis.canW/2, yMin+25);  
  // Plot skip data using slm(el) and dist(el)
  var frrat, el, skdi=0, skslm=1.0;
  ctx.lineWidth=2;
  
  ctx.beginPath();          
  fr=1.5;
  x = fr * colW / xDiv;      // calculate starting point for moveTo()
  x = Math.round(xMin+x);    // intercept x
  ctx.moveTo(x, yMax);
  for ( i=0; i<101; i++) {    // loop HF frequencies
    skdi=0.0; skslm=1.0;      // assume no skip zone
    frrat = fr/nvis.fc3;      // ratio of frequency and critical foF2
    if(frrat > 1.05) {        // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    y = skdi * rowH / yDiv;           // slope y
    y=Math.round(yMax - y);           // intercept y
    x = fr * colW / xDiv;             // slope x
    x = Math.round(xMin+x);           // intercept x
    ctx.lineTo(x,y);  
    fr+= 0.285;
  }
  ctx.strokeStyle = "red"; ctx.stroke();
  ctx.fillStyle="red"; ctx.fillText("Midday", xMin, yMin+25);
  // Plot day skip
  ctx.beginPath();          
  fr=1.5;
  x = fr * colW / xDiv;      // calculate starting point for moveTo()
  x = Math.round(xMin+x);    // intercept x
  ctx.moveTo(x, yMax);
  for ( i=0; i<101; i++) {    // loop HF frequencies
    skdi=0.0; skslm=1.0;      // assume no skip zone
    frrat = fr/nvis.fc2;      // ratio of frequency and critical foF2
    if(frrat > 1.05) {        // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    y = skdi * rowH / yDiv;           // slope y
    y=Math.round(yMax - y);           // intercept y
    x = fr * colW / xDiv;             // slope x
    x = Math.round(xMin+x);           // intercept x
    ctx.lineTo(x,y);  
    fr+= 0.285;
  }
  ctx.strokeStyle = "green"; ctx.stroke();
  ctx.fillStyle="green"; ctx.fillText("Day", xMin+80, yMin+25);
  // Plot night skip
  ctx.beginPath();          
  fr=1.5;
  x = fr * colW / xDiv;      // calculate starting point for moveTo()
  x = Math.round(xMin+x);    // intercept x
  ctx.moveTo(x, yMax);
  for ( i=0; i<101; i++) {    // loop HF frequencies
    skdi=0.0; skslm=1.0;      // assume no skip zone
    frrat = fr/nvis.fc1;      // ratio of frequency and critical foF2
    if(frrat > 1.05) {        // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    y = skdi * rowH / yDiv;           // slope y
    y=Math.round(yMax - y);           // intercept y
    x = fr * colW / xDiv;             // slope x
    x = Math.round(xMin+x);           // intercept x
    ctx.lineTo(x,y);  
    fr+= 0.285;
  }
  ctx.strokeStyle = "blue"; ctx.stroke();
  ctx.fillStyle="blue"; ctx.fillText("Night", xMin+130, yMin+25);
  // Add text bellow plot
  ctx.fillStyle="blue";      y=yMax+50;
  ctx.fillText("Graph shows skip zone for day, midday and night.", 1, y); y+=30;
  ctx.fillText("Skip zone is zone around transmiter without signal coverage.", 1, y); y+=30;
  ctx.fillText("It's shape is circle with diameter from 0 to 5,000 km.", 1, y); y+=50;
  ctx.font="bold 20px arial";  ctx.fillStyle="red"; 
  ctx.fillText("If we use frequency below critical foF2, there will be no skip zone.", 1, y); y+=30;
  ctx.fillText("Using frequency over critical creates skip zone.", 1, y); y+=30;
  ctx.fillText("Increasing frequency grows the skip zone (up to 5,000 km).", 1, y); y+=30; 
  ctx.fillText("Too high frequency will not reflect from Ionosphere.", 1, y); y+=50; 
  ctx.font="italic 20px arial"; ctx.fillStyle="green";  
  ctx.fillText("Example: day and night link with distances 1,200 to 3,000 km.", 1, y); y+=30;  
  ctx.fillText("Skip zone must stay under 1,200 km, and this limits frequency.", 1, y); y+=30;  
  ctx.fillText("MUF is 17 MHz for Midday, 11 MHz for day and 5 MHz for night .", 1, y); y+=30; 
  ctx.fillText("Using multiband antenna enables 3G to keep link at optimal frequency.", 1, y); y+=30;   
  ctx.fillText("20 W and CASG-A1 antenna gives adequate cover up to 3,000 km.", 1, y); y+=30;  
  ctx.fillText("Using 150 W is recommended in noisy environment.", 1, y); y+=30;  
}

function canvasSlm(nvis) {    // drawing Secant law multiplier
  var s1 ="canvasSlm() ", s2, s3;   // declare few strings
  var x,y;       // position 
  nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 35, nvis.canW, nvis.canH);
  // Work out grid dimensions
  var i, rows=9, cols=9;            //Grid with 9 rows and 9 columns
  var margL=50, margR=50, margT=30, margB=500;  //Margins - left, right, top,botom,
  var xDiv=10;         // x axes grid 10 degrees per division
  var yDiv=0.5;        // y axes grid 0.5 SLM per division
  var rowH = Math.round(( nvis.canH - margT- margB )/rows); rowH -= 1;
  var colW = Math.round((nvis.canW-margL-margR)/cols);   colW -= 1;
  var xMin,xMax, yMin,yMax;         // grid min max coordinates
  xMin = margL; xMax = xMin + cols*colW;  // x grid min max
  yMin = margT; yMax = yMin + rows*rowH;  // y grid min max
  // Talk to console
  s2 = "rows="+rows+", cols="+cols+",w="+colW+",h="+rowH;
  console.log(s1+s2);
  // draw horizontal grid lines
  ctx.font = "20px Arial";  ctx.fillStyle = "black";   // prepare font  
  ctx.strokeStyle="lightgray";  
  y=margT;
  for(i=0; i<(rows+1); i++) {  // Draw horizontal grid lines
    ctx.beginPath();
    ctx.moveTo(xMin, y);
    ctx.lineTo(xMax, y);  
    ctx.stroke();
    y += rowH;
  }
  // Draw vertical grid lines
  x=margL; 
  for(i=0; i<(cols+1); i++) { 
    ctx.beginPath();
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
    ctx.stroke();
    x+=colW;
  }
  // Mark x axes
  x = margL-10; y = yMax + 20; 
  for(i=0; i<(cols+1); i++) {     
    s3=xDiv*i;
    if(i==cols) { s3="Elev"+'\xB0'; x-=30;}
    ctx.fillText(s3, x, y); 
    x+=colW;
  }  
  // Mark y axes
  ctx.fillStyle="red";
  x = margL - 40;   y = yMax - rowH +5;
  for(i=1; i<rows; i++) { 
    s3 = yDiv*i;
    ctx.fillText(s3, x, y);
    y -= rowH;
  }
  ctx.fillStyle="green";
  x = xMax + 5;   y = yMax - rowH +5;
  for(i=1; i<rows; i++) { 
    s3 = 10*i+'\xB0';
    ctx.fillText(s3, x, y);
    y -= rowH;
  }
  // Draw plot title 
  ctx.fillStyle="red";
  s3="Secant Law Multiplier (SLM) 0.5 / div";  
  ctx.fillText(s3, nvis.canW/2, yMin+25);  
  ctx.fillStyle="green";
  s3="F2 layer incidence angle 10"+'\xB0'+ "/ div";  
  ctx.fillText(s3, nvis.canW/2, yMin+55);     
  // Plot SLM
  var el, B, skslm;
  ctx.lineWidth=2;
  ctx.beginPath();          
  ctx.beginPath();          
  ctx.moveTo(xMin, yMax);
  for (el=0; el<91; el++) {   // loop elevation
    skslm = nvis.skipSlm[el];
    if(skslm<1.0)  skslm=1.0;
    if(skslm>4.5)  skslm=4.5;
    y = skslm * rowH / yDiv;           // slope y
    y=Math.round(yMax - y);           // intercept y
    x = el * colW / xDiv;             // slope x
    x = Math.round(xMin+x);           // intercept x
    ctx.lineTo(x,y);  
  }
  ctx.strokeStyle = "red";    ctx.stroke();
  ctx.fillStyle="red";        ctx.fillText("SLM", margL-45, yMin+25);
  // Plot angle B - incidence into F2 layer
  ctx.lineWidth=2;
  ctx.beginPath();    // Plot B
  ctx.moveTo(xMin, yMax);
  for (el=0; el<91; el++) {   // loop elevation
    B = nvis.skipB[el];
    if(el == 90)  B=0;
    if(B<0)  B=0;
    if(B>90.0)  B=90.0;
    y = B * rowH / 10;           // slope y
    y=Math.round(yMax - y);           // intercept y
    x = el * colW / xDiv;             // slope x
    x = Math.round(xMin+x);           // intercept x
    ctx.lineTo(x,y);  
    x+=9;
  }
  ctx.strokeStyle = "green"; ctx.stroke();
  ctx.fillStyle="green"; ctx.fillText("B", xMax+5, yMin+25);
  // Add text bellow plot
  ctx.fillStyle="blue";      y=yMax+50; 
  ctx.fillText("Graph shows Secant Law Multiplier (SLM) versus elevation angle Elev [0 is horizon].", 1, y); y+=30;
  ctx.fillText("Maximum Usable Frequency (MUF) is the highest frequency Ionosphere will reflect back.", 1, y); y+=30;
  ctx.fillText("Frequencies above MUF will pass through Ionosphere without reflection.", 1, y); y+=30;
  ctx.fillStyle = "red";  ctx.font="bold 20px arial";
  ctx.fillText("Waves using lower elevation angles will have higher MUF.", 1, y); y+=30;
  ctx.fillText("Secant Law:  MUF = foF2 * sec (B)", 50, y); y+=30;
  ctx.fillText("- foF2 is critical frequency for layer F2 at vertical wave incidence.", 100, y); y+=30;
  ctx.fillText("- B is wave ange of incidence into F2 layer.", 100, y); y+=30;
  ctx.fillText("- SLM is expression used for sec(B)", 100, y); y+=30;
  ctx.fillText("Secant Law Multiplier (SLM) multiples critical frequency by factor of 1 to 5.", 1, y); y+=50;
  ctx.fillStyle="green";  ctx.font="italic 20px arial";
  ctx.fillText("Example:     hF2=300 km,      distance=3,000 km,    foF2=4.0 MHz", 1, y); y+=34; 
  ctx.fillText("Single hop wave elevation angle El=4.2"+'\xB0'+" (close to horizon)", 1, y); y+=30; 
  ctx.fillText("300 km above ground wave enters F2 layer at angle B=72.3"+'\xB0', 1, y); y+=30;   
  ctx.fillText("SLM = sec(72.3"+'\xB0'+ ")= 3.28   =>    MUF = 3.28 * 4 = 13.12 MHz", 1, y); y+=30; 
  ctx.fillText("We are using frequency 3.28 times higher than foF2 !", 1, y); y+=30; 
  ctx.fillText("Reflected wave will return to Earth at 3,000 km distance", 1, y); y+=30;     
}









 

 