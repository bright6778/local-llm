print("\n\n\n*********************************************");
print("* PBOC Test Batch APP");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-APP-002.js");
include("..\\PBOC-APP-003.js");
include("..\\PBOC-APP-004.js");
include("..\\PBOC-APP-005.js");
include("..\\PBOC-APP-006.js");
include("..\\PBOC-APP-007.js");
include("..\\PBOC-APP-008.js");
include("..\\PBOC-APP-014.js");
if (isCardBlockTest){
	if (isStaticCard)
		include(INIT_E2P_PATH);
	perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
	include("..\\pboc_CardBlockTest.js");
	include("..\\PBOC-APP-009.js");
	include("..\\PBOC-APP-012.js");
}
if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-APP-015.js");
