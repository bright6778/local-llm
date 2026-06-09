/* Card Block Command */

include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

print('\n* TEST NO : Card Block test');

include("pboc_CLN001.js");

print('\n* Card Block Command with valid MAC');
send_CardBlock();
assertSW("9000");
