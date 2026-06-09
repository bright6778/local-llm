print("\n\n\n*********************************************");
print("* qPBOC Test Batch CTH");
print("*********************************************");

if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(31, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-CTH-001.js");
	include("..\\qPBOC-CTH-002.js");
	include("..\\qPBOC-CTH-003.js");
}

