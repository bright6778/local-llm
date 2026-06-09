print("\n\n\n*********************************************");
print("* PBOC Test Batch VLC");
print("*********************************************");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(7, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-VLC-050.js");
include("..\\PBOC-VLC-051.js");
include("..\\PBOC-VLC-054.js");

if (isStaticCard)
	include(INIT_E2P_PATH);
perso_process(1, APP_DC_LEVEL, SINGLE_CURRENCY);
include("..\\PBOC-VLC-056.js");