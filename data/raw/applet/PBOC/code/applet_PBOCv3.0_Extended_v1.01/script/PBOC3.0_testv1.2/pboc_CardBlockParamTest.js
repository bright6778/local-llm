include("_PBOC_COMMON.js");

s = new ShellScript();

print('\n* Test Case : Card Block Parameter Test');
reset();
select_PBOC();


s.send("00 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("01 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("02 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("03 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("04 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("05 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("06 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("07 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("08 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("09 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("0a 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("0b 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("0c 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("0d 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("0e 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("0f 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("10 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("11 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("12 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("13 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("14 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("99 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("9a 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("9b 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("9c 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("9d 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("9e 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("9f 16 00 00 04 AD1DA4EF");
s.assertSW("6881");
print("COMMENT : PBOC test script에서는 6E00을 요구하나 잘못된 체널비트 설정으로 카드는 6881을 반환한다.\n");

s.send("a0 16 00 00 04 AD1DA4EF");
s.assertSW("6E00");

s.send("84 16 00 00 05 FFFFFFFFFF");
s.assertSW("6700");

s.send("84 16 00 00 06 FFFFFFFFFFFF");
s.assertSW("6700");
   
s.send("84 16 00 00 07 FFFFFFFFFFFFFF");
s.assertSW("6700");

s.send("84 16 00 00 08 FFFFFFFFFFFFFFFF");
s.assertSW("6700");

s.send("84 16 00 00 09 FFFFFFFFFFFFFFFFFF");
s.assertSW("6700");
    
s.send("84 16 00 00 0a FFFFFFFFFFFFFFFFFFFF");
s.assertSW("6700");

s.send("84 16 00 00 0b FFFFFFFFFFFFFFFFFFFFFF");
s.assertSW("6700");

s.send("84 16 00 00 0c FFFFFFFFFFFFFFFFFFFFFFFF");
s.assertSW("6700");
