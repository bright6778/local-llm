print("\n\n\n*********************************************");
print("* PBOC Test Batch GET");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(38, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-GET-011.js");