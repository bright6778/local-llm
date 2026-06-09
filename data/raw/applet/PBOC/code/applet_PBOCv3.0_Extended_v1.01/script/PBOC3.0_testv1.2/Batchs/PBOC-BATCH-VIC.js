print("\n\n\n*********************************************");
print("* PBOC Test Batch VIC");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(27, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-VIC-004.js");
include("..\\PBOC-VIC-006.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(29, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-VIC-014.js");
