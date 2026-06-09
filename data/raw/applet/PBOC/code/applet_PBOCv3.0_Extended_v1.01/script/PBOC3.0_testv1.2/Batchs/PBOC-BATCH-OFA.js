print("\n\n\n*********************************************");
print("* PBOC Test Batch OFA");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-OFA-002.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(4, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-OFA-004.js");
include("..\\PBOC-OFA-006.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-OFA-008.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-OFA-009.js");
