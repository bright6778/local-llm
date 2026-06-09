/*******************************************
 Test Name  : PIN CHANGE/UNBLOCK Command
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CP.003.00.00
 *******************************************/

//PIN Change Unblock Test를 하려면 ATC ARPC AC 등의 데이터가 필요한데
//테스트 케이스 처럼 qPBOC 거래에서 GPO를 보내기 전/후 를 가지고 응답값을 가지고 진행하기엔 무리가 있다.
//특히 ATC 같은 경우 거래 횟수에 따라 변화하는 값인데, 이런 값들을 통해 정확한 MAC을 만들어야하는데 어려움이 있다.