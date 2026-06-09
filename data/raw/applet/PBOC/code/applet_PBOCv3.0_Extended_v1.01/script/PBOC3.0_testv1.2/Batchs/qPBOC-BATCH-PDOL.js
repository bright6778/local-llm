print("\n\n\n*********************************************");
print("* qPBOC Test Batch PDOL");
print("*********************************************");

if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH)
	perso_process(55, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-PDOL-001.js");
	include("..\\qPBOC-PDOL-002.js");
	include("..\\qPBOC-PDOL-003.js");
	
	
  if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(31, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-PDOL-004.js");
}