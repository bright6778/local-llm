print("\n\n\n*********************************************");
print("* PBOC Test Batch CVD");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);

perso_process(38, APP_DC_LEVEL, DUAL_CURRENCY);

include("..\\PBOC-CVD-003.js");
include("..\\PBOC-CVD-006.js");
include("..\\PBOC-CVD-009.js");
include("..\\PBOC-CVD-012.js");