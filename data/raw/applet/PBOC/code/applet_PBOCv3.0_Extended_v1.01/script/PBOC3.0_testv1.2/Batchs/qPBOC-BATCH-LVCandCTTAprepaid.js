print("\n\n\n*********************************************");
print("* qPBOC Test Batch LVCandCTTAprepaid");
print("*********************************************");
	
if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(42, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTAprepaid-001-2CI.001.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(58, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTAprepaid-002-2CI.001.01.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(42, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTAprepaid-003-2CI.002.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(58, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTAprepaid-004-2CI.002.01.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(48, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTAprepaid-005-2CI.003.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(49, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTAprepaid-006-2CI.003.01.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(58, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTAprepaid-007-2CI.004.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(49, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTAprepaid-008-2CI.004.01.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(48, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTAprepaid-009-2CI.005.00.00.js");

	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(49, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTAprepaid-010-2CI.005.01.00.js");
}

