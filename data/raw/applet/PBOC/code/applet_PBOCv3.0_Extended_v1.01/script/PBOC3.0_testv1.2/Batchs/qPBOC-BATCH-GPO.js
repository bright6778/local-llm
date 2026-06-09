print("\n\n\n*********************************************");
print("* qPBOC Test Batch GPO");
print("*********************************************");


if (!isDualTest) {
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(31, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-GPO-001.js");
	include("..\\qPBOC-GPO-003.js");
	include("..\\qPBOC-GPO-004.js");
	include("..\\qPBOC-GPO-005.js");
	include("..\\qPBOC-GPO-006.js");
	include("..\\qPBOC-GPO-007.js");
	include("..\\qPBOC-GPO-014.js"); // It's defferent with qVSDC and PBOC
	include("..\\qPBOC-GPO-015.js");
	include("..\\qPBOC-GPO-016.js");
	include("..\\qPBOC-GPO-018.js");
	include("..\\qPBOC-GPO-019.js");
	
	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(31, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-GPO-002.js");

	if (isStaticCard)
	include(INIT_E2P_PATH);
	perso_process(36, APP_QPBOC_LEVEL, SINGLE_CURRENCY);
	include("..\\qPBOC-GPO-017.js");
}