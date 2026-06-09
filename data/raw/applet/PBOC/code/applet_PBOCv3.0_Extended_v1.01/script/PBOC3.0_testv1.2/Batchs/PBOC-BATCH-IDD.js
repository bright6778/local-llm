print("\n\n\n*********************************************");
print("* PBOC Test Batch IDD");
print("*********************************************");
/*
if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(3, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-IDD-001.js");
include("..\\PBOC-IDD-002.js"); 
include("..\\PBOC-IDD-003.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(35, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-IDD-004.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(36, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-IDD-005.js");
*/
if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(2, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-IDD-006.js");