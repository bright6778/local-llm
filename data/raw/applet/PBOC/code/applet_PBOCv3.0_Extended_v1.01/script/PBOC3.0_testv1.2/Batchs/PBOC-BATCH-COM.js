print("\n\n\n*********************************************");
print("* PBOC Test Batch COM");
print("*********************************************");


if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(23, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-COM-001.js");
include("..\\PBOC-COM-002.js");
include("..\\PBOC-COM-003.js");
include("..\\PBOC-COM-004.js");
include("..\\PBOC-COM-005.js");
include("..\\PBOC-COM-006.js");
include("..\\PBOC-COM-007.js");
include("..\\PBOC-COM-008.js");
include("..\\PBOC-COM-009.js");
include("..\\PBOC-COM-010.js");
include("..\\PBOC-COM-011.js");
include("..\\PBOC-COM-012.js");