print("\n\n\n*********************************************");
print("* PBOC Test Batch UPR");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);

perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-UPR-001.js");
include("..\\PBOC-UPR-005.js");
include("..\\PBOC-UPR-007.js");