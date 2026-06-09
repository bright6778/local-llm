/* Application Block Command with an shorter MAC is unsuccessful */
include("_PBOC_COMMON.js");
print("ABK061");

print("\n* Transaction 1");
include("pboc_CLN001.js");

print('App Block Command with Short MAC'); 
send('841E000003 112233');
assertSW("6700");
