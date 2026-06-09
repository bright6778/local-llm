print("\n\n\n*********************************************");
print("* PBOC Test Batch VLT");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-VLT-001.js");
include("..\\PBOC-VLT-002.js");
include("..\\PBOC-VLT-003.js");
include("..\\PBOC-VLT-005.js");
include("..\\PBOC-VLT-007.js");
include("..\\PBOC-VLT-009.js");
include("..\\PBOC-VLT-011.js");
include("..\\PBOC-VLT-017.js");
include("..\\PBOC-VLT-018.js");
include("..\\PBOC-VLT-019.js");
include("..\\PBOC-VLT-020.js");
include("..\\PBOC-VLT-021.js");


if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(6, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-VLT-004.js");
include("..\\PBOC-VLT-006.js");
include("..\\PBOC-VLT-010.js");
include("..\\PBOC-VLT-012.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(3, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-VLT-013.js");
include("..\\PBOC-VLT-022.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(2, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-VLT-015.js");
include("..\\PBOC-VLT-023.js");