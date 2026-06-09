print("\n\n\n*********************************************");
print("* PBOC Test Batch RED");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);

perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-RED-011.js");