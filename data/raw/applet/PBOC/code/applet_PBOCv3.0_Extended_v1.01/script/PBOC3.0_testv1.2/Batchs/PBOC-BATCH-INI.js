print("\n\n\n*********************************************");
print("* PBOC Test Batch INI");
print("*********************************************");

include("_TEST_CONF.js");
	
include("\\Images\\PERSO_SCRIPT.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);

include("..\\PBOC-INI-021.js");
include("..\\PBOC-INI-030.js");
include("..\\PBOC-INI-051.js");
include("..\\PBOC-INI-052.js");
include("..\\PBOC-INI-053.js");
include("..\\PBOC-INI-054.js");
include("..\\PBOC-INI-060.js");
include("..\\PBOC-INI-080.js");