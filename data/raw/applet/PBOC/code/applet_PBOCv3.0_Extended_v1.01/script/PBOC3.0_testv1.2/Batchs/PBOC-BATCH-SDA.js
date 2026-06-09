print("\n\n\n*********************************************");
print("* PBOC Test Batch SDA");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);

perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-SDA-001.js");
include("..\\PBOC-SDA-002.js");
include("..\\PBOC-SDA-003.js");
include("..\\PBOC-SDA-004.js");
include("..\\PBOC-SDA-005.js");
include("..\\PBOC-SDA-006.js");
include("..\\PBOC-SDA-008.js");