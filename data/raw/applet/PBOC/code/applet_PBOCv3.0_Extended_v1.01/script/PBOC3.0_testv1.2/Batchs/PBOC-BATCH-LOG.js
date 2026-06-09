print("\n\n\n*********************************************");
print("* PBOC Test Batch LOG");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-LOG-001.js");
include("..\\PBOC-LOG-002.js");
include("..\\PBOC-LOG-003.js");
include("..\\PBOC-LOG-004.js");
include("..\\PBOC-LOG-014.js");
include("..\\PBOC-LOG-015.js");
include("..\\PBOC-LOG-016.js");
include("..\\PBOC-LOG-017.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(3, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-LOG-008.js");
include("..\\PBOC-LOG-010.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-LOG-018.js");
include("..\\PBOC-LOG-019.js");