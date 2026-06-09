print("\n\n\n*********************************************");
print("* PBOC Test Batch CLEAN");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\pboc_CLN001.js");
include("..\\pboc_CLN002.js");