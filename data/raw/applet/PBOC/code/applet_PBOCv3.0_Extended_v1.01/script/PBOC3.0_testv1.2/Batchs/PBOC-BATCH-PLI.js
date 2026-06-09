print("\n\n\n*********************************************");
print("* PBOC Test Batch PLI");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);

perso_process(7, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-PLI-001.js");
include("..\\PBOC-PLI-003.js");
include("..\\PBOC-PLI-004.js");