include("_PBOC_COMMON.js");

print('\n* Test Case : GET011');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

send_GetData('9F13'); //Last Online ATC Register (LOATC)
assertSW('9000');
send_GetData('9F17'); //PIN Try Counter
assertSW('9000');
send_GetData('9F36'); //Application Transaction Counter (ATC)
assertSW('9000');
send_GetData('9F51'); //Application Currency Code
assertSW('9000');
send_GetData('9F52'); //Application Default Action
assertSW('9000');
send_GetData('9F53'); //Consecutive Transaction Limit(International)
assertSW('9000');
send_GetData('9F56'); //Issuer Authentication Indicator
assertSW('9000');
send_GetData('9F57'); //Issuer Country Code
assertSW('9000');
send_GetData('9F58'); //Lower Consecutive Offline Limit VIS pA-35 1 byte
assertSW('9000');
send_GetData('9F59'); //Uppper Consecutive Offline Limit VIS pA-42 1 byte
assertSW('9000');
send_GetData('9F5C'); //CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_UPPER_LIMIT
assertSW('9000');
send_GetData('9F4F'); //Log Format
assertSW('9000');
send_GetData('9F72'); //Consecutive Transaction Limit (International Country)
assertSW('9000');
send_GetData('9F73'); //CONVERSION_FACTOR
assertSW('9000');
send_GetData('9F75'); //CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT_DUAL
assertSW('9000');
send_GetData('9F76'); //Secondary Application Currency Code
assertSW('9000');