/* Application Block Command with an longer MAC is unsuccessful */

include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

print('\n* TEST NO : AUK062');

include("pboc_CLN001.js");

print('App Unblock Command with Longer MAC');
send('8418000009 112233445566778899');
assertSW("6700");
