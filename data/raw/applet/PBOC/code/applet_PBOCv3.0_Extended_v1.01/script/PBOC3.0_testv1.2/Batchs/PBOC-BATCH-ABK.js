print("\n\n\n*********************************************");
print("* PBOC Test Batch ABK");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);

perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-ABK-061.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABK-062.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABK-081.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ABK-082.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");