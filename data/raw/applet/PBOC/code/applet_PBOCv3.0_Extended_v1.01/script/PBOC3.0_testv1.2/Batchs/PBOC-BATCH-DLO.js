print("\n\n\n*********************************************");
print("* PBOC Test Batch DLO");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);	
perso_process(21, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-DLO-001.js");
include("..\\PBOC-DLO-002.js");
include("..\\PBOC-DLO-003.js");
include("..\\PBOC-DLO-004.js");
include("..\\PBOC-DLO-005.js");
include("..\\PBOC-DLO-006.js");
include("..\\PBOC-DLO-007.js");
include("..\\PBOC-DLO-009.js");
include("..\\PBOC-DLO-010.js");
include("..\\PBOC-DLO-011.js");
include("..\\PBOC-DLO-012.js");
include("..\\PBOC-DLO-013.js");
include("..\\PBOC-DLO-016.js");
include("..\\PBOC-DLO-017.js");
include("..\\PBOC-DLO-020.js");
include("..\\PBOC-DLO-021.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(22, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-DLO-022.js");
include("..\\PBOC-DLO-022.js");
