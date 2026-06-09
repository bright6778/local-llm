/* Application Block Command with an invalid MAC is unsuccessful */

include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

print('\n* TEST NO : AUK081');

include("pboc_CLN001.js");

print('App Unblock Command with Invalid MAC');
send('8418000004 11223344');
assertSW("6988");
