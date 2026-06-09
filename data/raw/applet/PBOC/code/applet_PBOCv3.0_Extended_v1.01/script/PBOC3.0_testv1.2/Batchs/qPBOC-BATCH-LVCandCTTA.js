print("\n\n\n*********************************************");
print("* qPBOC Test Batch LVCandCTTA");
print("*********************************************");

if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(37, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTA-001-2CG.001.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(37, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTA-002-2CG.001.01.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(37, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTA-003-2CG.002.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(37, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTA-004-2CG.003.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(37, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTA-005-2CG.004.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(56, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTA-006-2CG.004.01.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(37, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTA-007-2CG.005.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(56, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCandCTTA-008-2CG.005.01.00.js");
}