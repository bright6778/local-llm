/* Application Block Command with an invalid MAC is unsuccessful */
include("_PBOC_COMMON.js");

print("ABK081");

print("\n* Transaction 1");
include("pboc_CLN001.js");

print('App Block Command with Invalid MAC'); 
send('841E000004 11223344');
assertSW("6988");
