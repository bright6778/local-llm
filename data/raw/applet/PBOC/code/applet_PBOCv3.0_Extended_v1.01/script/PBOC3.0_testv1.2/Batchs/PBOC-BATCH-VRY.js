print("\n\n\n*********************************************");
print("* PBOC Test Batch VRY");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-VRY-011.js");
include("..\\PBOC-VRY-071.js");