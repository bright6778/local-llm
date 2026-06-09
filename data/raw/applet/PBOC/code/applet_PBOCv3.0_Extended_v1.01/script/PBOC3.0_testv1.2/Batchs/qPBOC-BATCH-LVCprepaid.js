print("\n\n\n*********************************************");
print("* qPBOC Test Batch LVCprepaid");
print("*********************************************");

if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(44, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCprepaid-001-2CJ.001.00.00.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(44, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-LVCprepaid-002-2CJ.002.00.00.js");
}
