include("_PBOC_COMMON.js");

print('\n* TEST NO : CRM092');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PSE');
select('315041592E5359532E4444463032'); // SELETE INVALID PSE
assertSW("6A82"); // 6A81은 플랫폼에서 내보내야 하는데 PBOC2.0에선 X

print('\n* Select PBOC');
select('A0000003320111'); // SELETE INVALID PBOC
assertSW("6A82"); // 6A81은 플랫폼에서 내보내야 하는데 PBOC2.0에선 X

send_GPO(TEST_PDOL_DATA);

send_ReadRecord(parseInt('0B', 16), parseInt('01',16));

send_GEN_AC_1(ARQC, TEST_CDOL1);
