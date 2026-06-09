print("\n\n\n*********************************************");
print("* PBOC Test Batch AUS");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-AUS-001.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
include("..\\PBOC-AUS-002.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
include("..\\PBOC-AUS-003.js");

if (isPBOC30) {
	if (isStaticCard)
		include(INIT_E2P_PATH);
	perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
	include("..\\PBOC-AUS-004.js");
	include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
}

include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
include("..\\PBOC-AUS-005.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
include("..\\PBOC-AUS-008.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
include("..\\PBOC-AUS-009.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
include("..\\PBOC-AUS-010.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
include("..\\PBOC-AUS-011.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");
include("..\\PBOC-AUS-012.js");