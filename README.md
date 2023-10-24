# NVIS-1D

1. Near Vertical Incidence Skywave (NVIS) Introduction

NVIS is HF mode of propagation covering distances from 0 to 500 km. 
Software is meant to be used as NVIS planing and training tool. 


2. Nvis Class Description

2.1. NVIS class needs input to define link: latitude, month, antennas, masts, power, distance, etc.
User provides these inputs using GUI.

2.2. NVIS estimates critical frequency foF2 for: night, day and midday.
Link distance is used to calculate elevation angles and number of hops.
Skip zone is z

2.3. Power and antenna gain are used to determine Eirp (effective isotropic radiated power).
Free Space Path Loss (FSPL) is calculated from path distance and number of hops.
D Region Absorption (DRAP) is estimated form geographical data and sun cycle progression.

2.4. Signal strength on receive site is estimated as : S = EIRP - FSPL - DRAP. 
Noise power N is estimated using ITU Recommendation P.372-13.
Signal to noise ratio (SNR) is: SNR = S - N
SNR must be adequate for link to work (> 12 dB for SSB voice, > 4 dB for data).

2.5. Skip zone is area without signal coverage. It appears when frequency used is above foF2.
As frequency increases, askip zone grows.


3. Nvis class data members

3.1. SNR data is calculated from 1.5 to 30 MHz in 0.5 MHz steps
  var snrM[62], snrD[62], snrN[62]; // SNR midday-day-night
  var Lii[62], Ldd[62];		      // FSPL, DRAP
  var Eii[62], Nnn[62];             // Eirp, noise power

3.3. Skip zone is calculated for every degree of elevation (0 to 90 degrees)
  skipDist[92], skipSlm[92];      // skip distance, secant law multiplier  

3.4. Data decribing location, date, antennas and power is decribes using comments to code.


4. NVIS class functions

4.1. Simple basic functions
nvis constructor(name, ID) - sets name and ID, initializes arrays, calls nvisInit(nvis)
nvisInit(nvis) - initializes data memebers, grows larger arrays
nvisCheck(nvis) - checks name and ID to detect object corruption

4.2. Trigonometry on great circle with origin in Earth centre
D2R(n) - converts degrees to radians
R2D(n) - converts radians to degrees
maxHop(nvis) - calculates max hop distance
	great circle triangle
	two sides known: b=6371, c= b+hF2
	angle C is known C=90+elev = 90
	Phtyagoras a=sqrt(C^2-B^2)
	sin A = a/c

D2E(nvis) - from distance and hF2 to: elev, pathDist, angle B and SLM
calcHops(nvis) - calculates hops, calls Dist2El() to get: elev, pathDist and SLM  

4.3. Frequency prediction 
calcCoe(nvis)- calculates coefs:cycleCoe, seasonCoe and latCoe (values 0 to 1)
calcfoF2(nvis)- estimates foF2 from coefs: cycleCoe, seasonCoe and latCoe
latestfoF2(nvis) - latest ionosonde data, mixed with estimates for foF2 over 90 days
calcMuf(nvis) - calculates MUF from foF2 (adds half gyro, multiplies with SLM)

4.4. Show and tell for debugging using console
showSel(nvis)  - string for lat, month and year
showCoe(nvis)  - string for cycleCoe, latCoe and seasonCoe
showfoF2(nvis) - string for fc1,fc2 and fc2
showMuf(nvis)  - string for muf1, muf2 and muf3

4.5. SNR and Skip calculations
calcSkip(nvis) - for each deg of elevation calc skipSlm[90] and skipDist[90]

calcSNR(nvis) - calculate snrM/D/N[],Lii[],Ldd[],Eii[] and Nnn[] for 58 freq f[0]=1.5, f[57]=30
calls: 
  nvisCheck(nvis)
  antennaGain(nvis)
  calcFSPL(nvis)
  caclDrap(nvis)
  caclNoise(nvis)

4.6. Complete calculation of data
nvisPredict (nvis) - complete calculations for nvis
calls:
  nvisCheck(nvis)
  calcHops(nvis)- calc hops and elevation, calls Dist2El()
  calcCoe(nvis)- calc cycleCoe, latCoe and seasonCoe
  calcfoF2(nvis) - estimate foF2 from coes 
  latestfoF2(nvis) - latest Ionosonde data mixed with estimate
  calcMuf(nvis) - calc MUF from foF2 (add half gyro, mult with SLM)
  caclSkip(nvis) -calc skipSLm[el] and skipDist[el]
  calcSNR(nvis) - calc SNRM/D/N[f], Lii[f], Ldd[f], Eii[f], Nnn[f]


5. GUI 

5.1. Page layout and controls are defined in index.html.

5.2. Event callback functions are in nvisGui.js file.
clbk1(), clbk2(), clbk4() - handle button click events

selUpdate() - reads GUI inputs and recalculated data
canvasDraw() - draws views of calculated data
canvasTable() - draws table
canvasPlot() - plots traces of: snrM, snrD and snrN
canvasSkip() - plots traces of skip distance for: night, day and midday

6. Antenna related
Functions are contained in antenna.js file.
Antenna gain is calculated as function of: frequency, height and wave elevation angle




