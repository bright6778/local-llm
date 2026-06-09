print("\n\n\n*********************************************");
print("* PBOC Test Batch SEL");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-SEL-010.js");
include("..\\PBOC-SEL-081.js");
include("..\\PBOC-SEL-082.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(27, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-SEL-083.js");