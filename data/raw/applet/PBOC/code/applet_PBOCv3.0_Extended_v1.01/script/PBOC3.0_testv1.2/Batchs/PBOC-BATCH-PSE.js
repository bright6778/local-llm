print("\n\n\n*********************************************");
print("* PBOC Test Batch PSE");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(0, APP_DC_LEVEL, SINGLE_CURRENCY); // PSE NULL
include("..\\PBOC-PSE-012.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-PSE-060.js");
include("..\\PBOC-PSE-080.js");
include("..\\PBOC-PSE-011.js");
include("..\\PBOC-PSE-020.js");
include("..\\PBOC-PSE-030.js");
include("..\\PBOC-PSE-040.js");
include("..\\PBOC-PSE-050.js");
include("..\\PBOC-PSE-090.js");
if (isCardBlockTest){
	include("..\\PBOC-PSE-100.js");
}
