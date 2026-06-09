print("\n\n\n*********************************************");
print("* PBOC Test Batch ONO");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(2, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONO-001.js");
include("..\\PBOC-ONO-002.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONO-003.js");
include("..\\PBOC-ONO-004.js");
include("..\\PBOC-ONO-005.js");
include("..\\PBOC-ONO-006.js");
include("..\\PBOC-ONO-007.js");
include("..\\PBOC-ONO-008.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(3, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONO-009.js");
include("..\\PBOC-ONO-010.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONO-011.js");
include("..\\PBOC-ONO-012.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(2, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONO-014.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONO-015.js");
include("..\\PBOC-ONO-016.js");
include("..\\PBOC-ONO-017.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(3, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONO-018.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONO-019.js");
include("..\\PBOC-ONO-021.js");
include("..\\PBOC-ONO-022.js");