print("\n\n\n*********************************************");
print("* PBOC Test Batch DIR");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-DIR-006.js");
include("..\\PBOC-DIR-007.js");
include("..\\PBOC-DIR-008.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-DIR-001.js");
include("..\\PBOC-DIR-002.js");
include("..\\PBOC-DIR-003.js");
include("..\\PBOC-DIR-004.js");
include("..\\PBOC-DIR-005.js");

if (isCardBlockTest){
	if (isStaticCard)
		include(INIT_E2P_PATH);
	perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
	include("..\\pboc_CardBlockTest.js");
	include("..\\PBOC-DIR-009.js");
}