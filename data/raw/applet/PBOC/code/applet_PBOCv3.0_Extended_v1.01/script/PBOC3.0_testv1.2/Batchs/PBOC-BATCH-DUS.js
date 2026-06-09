print("\n\n\n*********************************************");
print("* PBOC Test Batch DUS");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-DUS-001.js");
include("..\\PBOC-DUS-002.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-DUS-003.js");
include("..\\PBOC-DUS-004.js");
include("..\\PBOC-DUS-005.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

if (isPBOC30)
	include("..\\PBOC-DUS-006.js"); //PBOC 3.0
	
include("..\\PBOC-DUS-007.js");
include("..\\PBOC-DUS-008.js");
include("..\\PBOC-DUS-009.js");
include("..\\PBOC-DUS-010.js");
include("..\\PBOC-DUS-011.js");
