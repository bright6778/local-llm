print("\n\n\n*********************************************");
print("* PBOC Test Batch ONA");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(2, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONA-001.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONA-002.js");
include("..\\PBOC-ONA-003.js");
include("..\\PBOC-ONA-004.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(2, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONA-005.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(3, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONA-006.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONA-009.js");
include("..\\PBOC-ONA-010.js");
include("..\\PBOC-ONA-011.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(12, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONA-012.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(13, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONA-013.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ONA-014.js");
include("..\\PBOC-ONA-017.js");
include("..\\PBOC-ONA-019.js");
include("..\\PBOC-ONA-020.js");