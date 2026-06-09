print("\n\n\n*********************************************");
print("* PBOC Test Batch ISSUE");
print("*********************************************");

include("_TEST_CT_CONF.js");
if (isDDA) {
	if (isStaticCard)
		include(INIT_E2P_PATH);

	include("..\\Issue\\4.Test_RSACRT_Patch.js");
}

include("_TEST_CL_CONF.js");
if (isCLTest)
	include("..\\Issue\\5.Test_ReadRecord_Patch.js");