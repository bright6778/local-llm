print("\n\n\n*********************************************");
print("* PBOC Test Batch EAU");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-EAU-071.js");
include("..\\PBOC-EAU-072.js");