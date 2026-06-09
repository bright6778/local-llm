print("\n\n\n*********************************************");
print("* PBOC Test Batch GPO");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-GPO-012.js");
include("..\\PBOC-GPO-081.js");
include("..\\PBOC-GPO-092.js");
include("..\\PBOC-GPO-093.js");