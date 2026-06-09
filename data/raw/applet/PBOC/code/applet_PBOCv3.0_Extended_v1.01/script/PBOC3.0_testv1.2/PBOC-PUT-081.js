/*******************************************
 Test Name  : PUT DATA Command (PUT 081)
 Objective  : A PUT DATA command with a MAC of less than 4 bytes is unsuccessful.
*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");

print("\n* TEST CASE : PUT 081");

reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW("9000");

var tag = "9F58";
var value = "03";
var mac = calc_MAC_forDUS(tag, value);
mac =  "11223344";
send("04DA" + tag + toHex(value.length / 2 + mac.length/2) + value + mac);

// send("04DA9F58050311223344");
assertSW('6988');