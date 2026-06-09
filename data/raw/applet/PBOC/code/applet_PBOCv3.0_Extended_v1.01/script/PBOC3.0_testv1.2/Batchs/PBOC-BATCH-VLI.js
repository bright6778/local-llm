print("\n\n\n*********************************************");
print("* PBOC Test Batch VLI");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(7, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-VLI-050.js");
include("..\\PBOC-VLI-051.js");
include("..\\PBOC-VLI-052.js");
include("..\\PBOC-VLI-053.js");