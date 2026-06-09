print("\n\n\n*********************************************");
print("* PBOC Test Batch CVL");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);

perso_process(38, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-CVL-001.js");
include("..\\PBOC-CVL-002.js");
include("..\\PBOC-CVL-003.js");
include("..\\PBOC-CVL-004.js");