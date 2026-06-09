print("\n\n\n*********************************************");
print("* PBOC Test Batch APD");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-APD-001.js");
include("..\\PBOC-APD-002.js");
include("..\\PBOC-APD-005.js");
include("..\\PBOC-APD-006.js");
include("..\\PBOC-APD-007.js");
include("..\\PBOC-APD-008.js");
include("..\\PBOC-APD-009.js");
include("..\\PBOC-APD-010.js");
include("..\\PBOC-APD-011.js");
include("..\\PBOC-APD-012.js");
include("..\\PBOC-APD-013.js");
include("..\\PBOC-APD-014.js");
include("..\\PBOC-APD-016.js");
include("..\\PBOC-APD-017.js");
include("..\\PBOC-APD-018.js");

include("..\\PBOC-APD-019.js");
include("..\\PBOC-APD-020.js");
include("..\\PBOC-APD-021.js");
include("..\\PBOC-APD-022.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-APD-023.js");

if (isCardBlockTest){

	if (isStaticCard)
		include(INIT_E2P_PATH);
	perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
	include("..\\PBOC-APD-024.js");

}