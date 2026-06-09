print("\n\n\n*********************************************");
print("* qPBOC Test Batch NMCO");
print("*********************************************");

if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(9, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-NMCO-001-2CO.008.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(10, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-NMCO-002-2CO.009.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(10, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-NMCO-003-2CO.010.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(54, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-NMCO-006-2CO.013.00.00.js");
	include("..\\qPBOC-NMCO-007-2CO.014.00.00.js");
} else if (isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(9, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-NMCO-004-2CO.011.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(9, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-NMCO-005-2CO.012.00.00.js");
}