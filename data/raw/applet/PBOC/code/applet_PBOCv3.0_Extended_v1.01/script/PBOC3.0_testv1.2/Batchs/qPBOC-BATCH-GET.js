print("\n\n\n*********************************************");
print("* qPBOC Test Batch GET");
print("*********************************************");

if (!isDualTest) {
		if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(3, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-GET-001.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(31, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-GET-002.js"); 
	include("..\\qPBOC-GET-003.js");
	include("..\\qPBOC-GET-004.js");
	include("..\\qPBOC-GET-005.js");
	include("..\\qPBOC-GET-006.js");
	include("..\\qPBOC-GET-007.js");
	include("..\\qPBOC-GET-008.js");
	
	include("..\\qPBOC-GET-009.js"); 
	include("..\\qPBOC-GET-010.js"); 
}