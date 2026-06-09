print("\n\n\n*********************************************");
print("* PBOC Test Batch ISL");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-ISL-001.js");
include("..\\PBOC-ISL-002.js");
include("..\\PBOC-ISL-004.js");
include("..\\PBOC-ISL-005.js");
include("..\\PBOC-ISL-006.js");
include("..\\PBOC-ISL-007.js");
include("..\\PBOC-ISL-008.js");
include("..\\PBOC-ISL-009.js");
include("..\\PBOC-ISL-010.js");
include("..\\PBOC-ISL-011.js");
include("..\\PBOC-ISL-012.js");
include("..\\PBOC-ISL-013.js");
include("..\\PBOC-ISL-014.js");
include("..\\PBOC-ISL-015.js");
include("..\\PBOC-ISL-016.js");
include("..\\PBOC-ISL-017.js");
include("..\\PBOC-ISL-018.js");
include("..\\PBOC-ISL-019.js");
include("..\\PBOC-ISL-020.js");
include("..\\PBOC-ISL-021.js");
include("..\\PBOC-ISL-022.js");

include("..\\PBOC-ISL-023.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ISL-024.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ISL-025.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ISL-026.js");
include("..\\PBOC-UTILITY-001-APPUNBLOCK.js");

include("..\\PBOC-ISL-027.js");
include("..\\PBOC-ISL-028.js");
include("..\\PBOC-ISL-029.js");
include("..\\PBOC-ISL-030.js");
include("..\\PBOC-ISL-031.js");
include("..\\PBOC-ISL-032.js");
include("..\\PBOC-ISL-033.js");
include("..\\PBOC-ISL-034.js");
include("..\\PBOC-ISL-035.js");
include("..\\PBOC-ISL-036.js");
include("..\\PBOC-ISL-038.js");
include("..\\PBOC-ISL-039.js");


if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(3, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ISL-040.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ISL-041.js");
include("..\\PBOC-ISL-042.js");
include("..\\PBOC-ISL-043.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(3, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ISL-045.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-ISL-046.js");
include("..\\PBOC-ISL-047.js");
include("..\\PBOC-ISL-048.js");
include("..\\PBOC-ISL-049.js");
include("..\\PBOC-ISL-051.js");
include("..\\PBOC-ISL-052.js");
include("..\\PBOC-ISL-053.js");
include("..\\PBOC-ISL-055.js");
include("..\\PBOC-ISL-056.js");
include("..\\PBOC-ISL-057.js");
include("..\\PBOC-ISL-058.js");
include("..\\PBOC-ISL-059.js");
include("..\\PBOC-ISL-060.js");

if (isPBOC30) {
	if (isStaticCard)
		include(INIT_E2P_PATH);
	perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
	include("..\\PBOC-ISL-061.js");
}