print("\n\n\n*********************************************");
print("* PBOC Test Batch IAU");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-IAU-020.js");
include("..\\PBOC-IAU-040.js");
include("..\\PBOC-IAU-050.js");
include("..\\PBOC-IAU-061.js"); 
include("..\\PBOC-IAU-062.js");
include("..\\PBOC-IAU-100.js"); 
if (isCardBlockTest){
	include("..\\PBOC-IAU-110.js");
}
if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
//!!Issue!!
//include("..\\PBOC-IAU-120.js");
include("..\\PBOC-IAU-130.js");
include("..\\PBOC-IAU-151.js");
include("..\\PBOC-IAU-152.js");
