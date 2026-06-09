/* Application Block Command with an shoter MAC is unsuccessful */

include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

print('\n* TEST NO : AUK061');

include("pboc_CLN001.js");

print('App Unblock Command with Shoter MAC');
send('8418000003 112233');
assertSW("6700");
