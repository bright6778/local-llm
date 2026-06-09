print("\n\n\n*********************************************");
print("* qPBOC Test Batch CRM");
print("*********************************************");

if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(40, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-001.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(41, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-002.js");
	
	/*perso_process(2, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-003.js");
	
	perso_process(32, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-004.js");  
	
	perso_process(39, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-005.js");
	include("..\\qPBOC-CRM-006.js");
	
	perso_process(40, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-008.js");
	
	//!!이슈 미분석!!
	//perso_process(39, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	//include("..\\qPBOC-CRM-009.js");
	
	perso_process(45, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-010.js"); 
	
	perso_process(39, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-011.js"); 
	include("..\\qPBOC-CRM-012.js"); 
	
	perso_process(45, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-013.js");
	
	perso_process(46, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-014.js");
	
	perso_process(2, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-017.js");*/
}
if (isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(42, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-018.js");
	
	//Put Data로 VLP_Funds_Limit을 확인하여  VLP_Available_Funds를 초기화 하는 테스트
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(6, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-022.js"); 
	if (isStaticCard)
	include(INIT_E2P_PATH);
	
	perso_process(39, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CRM-027.js");
}