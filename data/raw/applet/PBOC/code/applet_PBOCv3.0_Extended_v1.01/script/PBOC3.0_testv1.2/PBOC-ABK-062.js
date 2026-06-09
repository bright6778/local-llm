/* Application Block Command with an longer MAC is unsuccessful */
include("_PBOC_COMMON.js");

print("ABK062");

print("\n* Transaction 1");
include("pboc_CLN001.js");

print('App Block Command with Longer MAC'); 
send('841E000009 112233445566778899');
assertSW("6700");
