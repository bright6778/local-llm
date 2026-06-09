/* Application Block Command with an invalid MAC is unsuccessful */

include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

print('\n* TEST NO : AUK082');

include("pboc_CLN001.js");

print('\n* App Unblock Command with valid MAC');
send_AppUnblock();
assertSW("9000");
