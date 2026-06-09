print("\n\n\n*********************************************");
print("* PBOC Test Batch CRM");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-CRM-011.js");
include("..\\PBOC-CRM-012.js");
include("..\\PBOC-CRM-014.js");
include("..\\PBOC-CRM-015.js");
include("..\\PBOC-CRM-017.js");
include("..\\PBOC-CRM-018.js");
include("..\\PBOC-CRM-019.js");

include("..\\PBOC-CRM-021.js");
include("..\\PBOC-CRM-022.js");
include("..\\PBOC-CRM-024.js");
include("..\\PBOC-CRM-025.js");
include("..\\PBOC-CRM-027.js");
include("..\\PBOC-CRM-028.js");
include("..\\PBOC-CRM-029.js");

include("..\\PBOC-CRM-032.js");
include("..\\PBOC-CRM-034.js");
include("..\\PBOC-CRM-035.js");
include("..\\PBOC-CRM-037.js");
include("..\\PBOC-CRM-038.js");
include("..\\PBOC-CRM-039.js");

include("..\\PBOC-CRM-041.js");
include("..\\PBOC-CRM-042.js");
include("..\\PBOC-CRM-044.js");
include("..\\PBOC-CRM-045.js");
include("..\\PBOC-CRM-047.js");
include("..\\PBOC-CRM-048.js");
include("..\\PBOC-CRM-049.js");

include("..\\PBOC-CRM-052.js");
include("..\\PBOC-CRM-054.js");
include("..\\PBOC-CRM-055.js");
include("..\\PBOC-CRM-057.js");
include("..\\PBOC-CRM-058.js");
include("..\\PBOC-CRM-059.js");

include("..\\PBOC-CRM-061.js");
include("..\\PBOC-CRM-071.js");
include("..\\PBOC-CRM-081.js");
include("..\\PBOC-CRM-091.js");

include("..\\PBOC-CRM-110.js");
include("..\\PBOC-CRM-111.js");

include("..\\PBOC-CRM-210.js");
include("..\\PBOC-CRM-211.js");

include("..\\PBOC-CRM-310.js");
include("..\\PBOC-CRM-311.js");

include("..\\PBOC-CRM-410.js");
include("..\\PBOC-CRM-411.js");

include("..\\PBOC-CRM-510.js");
include("..\\PBOC-CRM-511.js");

if (isCardBlockTest){
	if (isStaticCard)
		include(INIT_E2P_PATH);
	perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
	include("..\\pboc_CardBlockTest.js");
	include("..\\PBOC-CRM-092.js");
}