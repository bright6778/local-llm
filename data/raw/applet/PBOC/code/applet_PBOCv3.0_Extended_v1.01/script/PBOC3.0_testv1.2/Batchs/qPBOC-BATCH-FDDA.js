print("\n\n\n*********************************************");
print("* qPBOC Test Batch FDDA");
print("*********************************************");

if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(32, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-FDDA-001-2CM.002.00.00.js");
	include("..\\qPBOC-FDDA-002-2CM.002.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(47, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-FDDA-003-2CM.002.00.00.js");
	include("..\\qPBOC-FDDA-004-2CM.002.00.00.js");
}