print("\n\n\n*********************************************");
print("* PBOC Test Batch APG");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-APG-001.js");
include("..\\PBOC-APG-002.js");
include("..\\PBOC-APG-003.js");
include("..\\PBOC-APG-004.js");
include("..\\PBOC-APG-005.js");
include("..\\PBOC-APG-006.js");

// N/A
//include("..\\PBOC-APG-007.js");

include("..\\PBOC-APG-009.js");
include("..\\PBOC-APG-010.js");
include("..\\PBOC-APG-011.js");
include("..\\PBOC-APG-012.js");
include("..\\PBOC-APG-013.js");

include("..\\pboc_AppBlk.js");
include("..\\PBOC-APG-014.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-APG-016.js");
include("..\\PBOC-APG-017.js");

if (isCardBlockTest){
	if (isStaticCard)
		include(INIT_E2P_PATH);
	perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
	include("..\\pboc_CardBlockTest.js");
	include("..\\PBOC-APG-015.js");
}