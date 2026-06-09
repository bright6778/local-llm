print("\n\n\n*********************************************");
print("* qPBOC Test Batch LVCorCTTA");
print("*********************************************");

if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(38, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCorCTTA-001-2CH.001.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(57, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCorCTTA-002-2CH.001.01.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(38, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCorCTTA-003-2CH.002.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(57, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCorCTTA-004-2CH.002.01.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(38, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCorCTTA-005-2CH.003.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(57, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCorCTTA-006-2CH.003.01.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(38, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCorCTTA-007-2CH.004.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(57, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCorCTTA-008-2CH.004.01.00.js");
}