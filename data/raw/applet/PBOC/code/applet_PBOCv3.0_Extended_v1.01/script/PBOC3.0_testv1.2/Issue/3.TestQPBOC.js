print('* Transaction');
include("FunctionCheckAFL.js");
reset();

select('325041592E5359532E4444463031');
select_PBOC();
send_GPO();
checking_AFL_related_record(AFL);