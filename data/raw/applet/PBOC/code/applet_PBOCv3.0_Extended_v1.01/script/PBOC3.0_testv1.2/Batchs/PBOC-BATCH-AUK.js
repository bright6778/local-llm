print("\n\n\n*********************************************");
print("* PBOC Test Batch AUK");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-AUK-061.js");
include("..\\PBOC-AUK-062.js");
include("..\\PBOC-AUK-081.js");
include("..\\PBOC-AUK-082.js");