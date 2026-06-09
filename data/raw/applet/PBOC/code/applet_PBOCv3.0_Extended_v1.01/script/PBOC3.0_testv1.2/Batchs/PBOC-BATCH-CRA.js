print("\n\n\n*********************************************");
print("* PBOC Test Batch CRA");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);

perso_process(38, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-CRA-001.js");
include("..\\PBOC-CRA-002.js");
include("..\\PBOC-CRA-003.js");
include("..\\PBOC-CRA-004.js");
include("..\\PBOC-CRA-005.js");

if (isPBOC30) {
	include("..\\PBOC-CRA-006.js");
}