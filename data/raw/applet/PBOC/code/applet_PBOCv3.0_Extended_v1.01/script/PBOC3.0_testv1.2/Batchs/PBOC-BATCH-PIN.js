print("\n\n\n*********************************************");
print("* PBOC Test Batch PIN");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);

perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-PIN-001.js");
include("..\\PBOC-PIN-002.js");
include("..\\PBOC-PIN-003.js");
include("..\\PBOC-PIN-004.js");
include("..\\PBOC-PIN-005.js");
include("..\\PBOC-PIN-006.js");
include("..\\PBOC-PIN-007.js");
include("..\\PBOC-PIN-008.js");
include("..\\PBOC-PIN-009.js");
include("..\\PBOC-PIN-010.js");