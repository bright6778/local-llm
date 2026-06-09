print("\n\n\n*********************************************");
print("* qPBOC Test Batch LVC");
print("*********************************************");

if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(47, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVC-001.js");
	include("..\\qPBOC-LVC-002.js");
	include("..\\qPBOC-LVC-003.js");

	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(47, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVC-004.js");

	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(36, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVC-005.js");
	include("..\\qPBOC-LVC-006.js");
	include("..\\qPBOC-LVC-007.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(47, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVC-008.js");

	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(36, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVC-009.js");
}