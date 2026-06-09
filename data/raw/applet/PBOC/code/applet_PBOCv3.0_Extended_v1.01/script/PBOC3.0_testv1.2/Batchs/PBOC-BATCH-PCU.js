print("\n\n\n*********************************************");
print("* PBOC Test Batch PCU");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-PCU-061.js");
include("..\\PBOC-PCU-062.js");
include("..\\PBOC-PCU-063.js");
include("..\\PBOC-PCU-064.js");
include("..\\PBOC-PCU-065.js");
include("..\\PBOC-PCU-066.js");

include("..\\PBOC-PCU-081.js");
include("..\\PBOC-PCU-082.js");
include("..\\PBOC-PCU-083.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-PCU-084.js");
include("..\\PBOC-PCU-085.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-PCU-086.js");