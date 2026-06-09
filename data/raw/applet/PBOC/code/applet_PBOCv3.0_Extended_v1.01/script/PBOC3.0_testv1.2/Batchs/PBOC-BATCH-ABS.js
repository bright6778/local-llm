print("\n\n\n*********************************************");
print("* PBOC Test Batch ABS");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-ABS-001.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABS-002.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABS-003.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABS-004.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

//ABS005, ABS006 External Authenticate is required before Issuer Script
if (isPBOC30) {
	include("..\\PBOC-ABS-005.js");
	include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
	
	//N/A
	//include("..\\PBOC-ABS-006.js");
	//include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
}

include("..\\PBOC-ABS-007.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABS-008.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABS-009.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABS-010.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABS-011.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(19, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-ABS-012.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABS-013.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(40, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ABS-014.js");