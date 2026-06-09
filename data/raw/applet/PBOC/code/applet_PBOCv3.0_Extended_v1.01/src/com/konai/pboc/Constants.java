/*
 * Copyright (c) 2013 KEBTechnology Co., Ltd. All rights reserved.
 * KEBT PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.konai.pboc;

/**
 * @author cyf
 * created on 2013. 4. 25.
 */
public class Constants {
	
	// phases
    public static final byte PERSONALISATION_PHASE = (byte) 0x03;
    public static final byte USE_PHASE = (byte) 0x0F;
    public static final byte BLOCKED_PHASE = (byte) 0x1F;
    public static final byte TERMINATED_PHASE = (byte) 0x3F;
	
    
    
	//ZERO Array
	static final byte[] ZERO =
		{
			(byte) 0x00,
			(byte) 0x00,
			(byte) 0x00,
			(byte) 0x00,
			(byte) 0x00,
			(byte) 0x00,
			(byte) 0x00,
			(byte) 0x00,
			(byte) 0x00,
			(byte) 0x00,
			(byte) 0x00,
			(byte) 0x00 };
	
	//ZERO Array
	static final byte[] MAX_BCD =
		{
			(byte) 0x09,
			(byte) 0x09,
			(byte) 0x09,
			(byte) 0x09,
			(byte) 0x09,
			(byte) 0x09,
			(byte) 0x09,
			(byte) 0x09,
			(byte) 0x09,
			(byte) 0x09,
			(byte) 0x09,
			(byte) 0x09 };
    
    /** Code execution value */
    public static final byte CV_INIT = (byte)0x00; 
    
	public static final byte CP_INIT_UPDATE = (byte) 0x50;
    public static final byte CP_EXT_AUTH = (byte) 0x82;
    public static final byte CP_STORE_DATA = (byte) 0xE2;

    

	
	public static final byte SECURITY_LEVEL_NO_SM = (byte) 0;
	
	/**
	 * Application life cycle state indicating the application is BLOCKED.
	 * The application, due to some off-card or internal event, has
	 * transitioned itself to the life cycle state of BLOCKED.
	 */
	public static final byte APPLET_BLOCKED = (byte) 0x7f;

	/**
	 * Application life cycle state indicating the application is PERSONALIZED.
	 * The applet has been loaded with application specific data and has
	 * transitioned itself to the life cycle state of PERSONALIZED.
	 */
	public static final byte APPLET_PERSONALIZED = (byte) 0x0f;

	/**	
	 * Application life-cycle state indicating the application is INSTALLED.
	 * The applet has been instantiated and has completed the install() method.
	 */
	public static final byte APPLET_INSTALLED = (byte) 0x03;

	/**
	 * Application life cycle state indicating the application is SELECTABLE.
	 * The applet has reached the life cycle state of SELECTABLE and is 
	 * available to receive SELECT commands from outside the card.
	 */
	public static final byte APPLET_SELECTABLE = (byte) 0x07;
	
   // public static final byte APPLET_PERSONALIZED     	= (byte)0x0F;
   // public static final byte APPLET_LOCKED             	= (byte)0x80;
	
    // global
    public static final byte TRUE = (byte) 0x5A;
    public static final byte FALSE = (byte) 0xA5;
	
	public static final byte INS_READ_RECORD  	= (byte)0xB2;
	public static final byte INS_SELECT		= (byte)0xA4;
	
	static final byte   APPTYPE_PSE 	= (byte)0x01;
    static final byte   APPTYPE_PPSE  	= (byte)0x02;
    static final byte   APPTYPE_PBOC 	= (byte)0x08;
	
	//Mask for ADA
	static final byte ADA_B1_ISS_AUTH_FAIL_NEXT_TRANS_ONLINE 			= (byte) 0x80;
	static final byte ADA_B1_ISS_AUTH_FAIL_DECLINE 						= (byte) 0x40;
	static final byte ADA_B1_ISS_AUTH_MAND_NOARPC_DECLINE 				= (byte) 0x20;
	static final byte ADA_B1_TRANS_DECL_OFFL_CREATE_ADVICE 				= (byte) 0x10;
	static final byte ADA_B1_PIN_EXCDD_TRANS_DECL_CREATE_ADVICE			= (byte) 0x08;
	static final byte ADA_B1_ISS_AUTH_FAIL_TRANS_DECLINE_CREATE_ADVICE	= (byte) 0x04;
	static final byte ADA_B1_NEW_CARD_GO_ONLINE 						= (byte) 0x02;
	static final byte ADA_B1_NEW_CARD_DECLINE_IF_UNABLE_TO_ONLINE 		= (byte) 0x01;

	static final byte ADA_B2_PIN_EXCDD_CURR_TRANS_BLOCK_APP 			= (byte) 0x80;
	static final byte ADA_B2_PIN_EXCDD_PREV_TRANS_DECLINE_TRANS 		= (byte) 0x40;
	static final byte ADA_B2_PIN_EXCDD_PREV_TRANS_GO_ONLINE 			= (byte) 0x20;
	static final byte ADA_B2_PIN_EXCDD_PREV_TRANS_CANT_ONLINE_DECLINE 	= (byte) 0x10;
	static final byte ADA_B2_ISS_SCRIPT_FAIL_PREV_TRANS_GO_ONLINE 		= (byte) 0x08;
	static final byte ADA_B2_PIN_EXCDD_PREV_TRANS_BLOCK_APP 			= (byte) 0x04;
	static final byte ADA_B2_BIT2_RFU 									= (byte) 0x02;
	static final byte ADA_B2_BIT1_RFU 									= (byte) 0x01;
	
	
	//Mask for AIP	
	static final short AIP_SDA_SUPP 		= (short) 0x4000;
	static final short AIP_DDA_SUPP 		= (short) 0x2000;
	static final short AIP_CV_SUPP 			= (short) 0x1000;
	static final short AIP_TERM_RISK_PERF 	= (short) 0x0080;
	static final short AIP_ISS_AUTH_SUPP 	= (short) 0x0400;
	static final short AIP_CDA_GENAC_SUPP 	= (short) 0x0100;
	
	//Mask for Authorization Response Code
	static final short ARC_APPROVED_1_ONLINE = (short) 0x3030;
	static final short ARC_APPROVED_2_ONLINE = (short) 0x3031;
	static final short ARC_APPROVED_3_ONLINE = (short) 0x3032;
	static final short ARC_APPROVED_4_ONLINE = (short) 0x3130;
	static final short ARC_APPROVED_5_ONLINE = (short) 0x3131;
	static final short ARC_APPROVED_ONLINE_FAILED = (short) 0x5933; //Y3
	static final short ARC_DECLINED_ONLINE_FAILED = (short) 0x5A33; //Z3
	
	/* Bit Mask */
	public static final byte BIT_8 = (byte) 0x80;
	public static final byte BIT_7 = (byte) 0x40;
	public static final byte BIT_6 = (byte) 0x20;
	public static final byte BIT_5 = (byte) 0x10;
	public static final byte BIT_4 = (byte) 0x8;
	public static final byte BIT_3 = (byte) 0x4;
	public static final byte BIT_2 = (byte) 0x2;
	public static final byte BIT_1 = (byte) 0x1;
	
	//Bytes of Card Additional Processes 9F68
	static final short CAP_BYTE_1 = (short) 0x0000;
	static final short CAP_BYTE_2 = (short) 0x0001;
	static final short CAP_BYTE_3 = (short) 0x0002;
	static final short CAP_BYTE_4 = (short) 0x0003;
	
	
	//CheckIncoming method 
	//0000 XXX1 -> receive mode
	//0000 XX1X -> p1 check
	//0000 X1XX -> p2 check
	//0000 1XXX -> lc check
	//0001 XXXX -> cla check
	static final byte CHECK_RECEIVE = (byte) 0x01;
	static final byte CHECK_P1		= (byte) 0x02;
	static final byte CHECK_P2		= (byte) 0x04;
	static final byte CHECK_LC		= (byte) 0x08;
	static final byte CHECK_CLA		= (byte) 0x10;
	
	//Mask for CID
	static final byte CID_AAC 					= (byte) 0x00;
	static final byte CID_TC 					= (byte) 0x40;
	static final byte CID_ARQC 					= (byte) 0x80;
	static final byte CID_AAR 					= (byte) 0x0B;
	static final byte CID_ADV_REQD				= (byte) 0x08;
	static final byte CID_SERVICE_NOT_ALLOWED 	= (byte) 0x01;
	static final byte CID_PIN_TRY_EXCDD 		= (byte) 0x02;
	static final byte CID_ISS_AUTH_FAILED 		= (byte) 0x03;
	
	//Mask for CVR
	//first byte of CVR is length byte, value is 03
	static final short CVR_BYTE_1 = (short) 0x0002;
	static final short CVR_BYTE_2 = (short) 0x0003;
	static final short CVR_BYTE_3 = (short) 0x0004;
	static final short CVR_BYTE_4 = (short) 0x0005;

	static final byte CVR_B2_GAC1_ARQC 								= (byte) 0xA0;
	static final byte CVR_B2_GAC1_TC 								= (byte) 0x90;
	static final byte CVR_B2_GAC1_AAC 								= (byte) 0x80;
	static final byte CVR_B2_GAC2_TC 								= (byte) 0x40;
	static final byte CVR_B2_CLEAR_2MSBITS 							= (byte) 0x3F;
	static final byte CVR_B2_ISS_AUTH_FAILED 						= (byte) 0x01;
	static final byte CVR_B2_ISS_AUTH_PERFORM_AND_FAILED 			= (byte) 0x08;
	static final byte CVR_B2_OFFLINE_PIN_VERIF_PERFORMED 			= (byte) 0x04;
	static final byte CVR_B2_OFFLINE_PIN_VERIF_FAILED 				= (byte) 0x02;
	static final byte CVR_B2_UNABLE_TO_GO_ONLINE 					= (byte) 0x01;

	static final byte CVR_B3_LAST_ONLINE_TRANS_NOT_COMPLTD 			= (byte) 0x80;
	static final byte CVR_B3_PIN_TRY_LIMIT_EXCDD 					= (byte) 0x40;
	static final byte CVR_B3_VELOC_EXCDD 							= (byte) 0x20;
	static final byte CVR_B3_NEW_CARD 								= (byte) 0x10;
	static final byte CVR_B3_ISS_AUTHENT_FAIL_ON_LAST_ONLINE 		= (byte) 0x08;
	static final byte CVR_B3_ISS_AUTH_NOT_DONE_AFTER_ONLINE_AUTH 	= (byte) 0x04;
	static final byte CVR_B3_APP_BLKD_PIN_LIMIT_EXCDD 				= (byte) 0x02;
	static final byte CVR_B3_SDA_FAIL 								= (byte) 0x01;

	static final byte CVR_B4_ISS_SCRIPT_RECEIVE_NUM 				= (byte) 0xF0;
	static final byte CVR_B4_ISS_SCRIPT_FAIL						= (byte) 0x08;
	static final byte CVR_B4_DDA_FAIL 								= (byte) 0x04;
	static final byte CVR_B4_DDA_PERF 								= (byte) 0x02;
	
	
	//Mask for TVR
	static final byte TVR_B1_OFFLINE_SDA_FAIL = (byte) 0x40;
	static final byte TVR_B1_OFFLINE_DDA_FAIL = (byte) 0x08;
	static final byte TVR_B1_CDA_FAIL = (byte) 0x04;
	
	static final short NUMBER_RECORD_FILE=(short)30;
	
	//DES Key index
	static final byte DESKEY_UDK = (byte) 0x02;
	static final byte DESKEY_MAC = (byte) 0x01;
	static final byte DESKEY_ENC = (byte) 0x03;
	
	//Status Word Definition
	public static final short SW_PBOC_INVALID_STATE 				= (short) 0x9481; //proprietary SW
	public static final short SW_UDK_FAILED_CHECK 					= (short) 0x9311;
	public static final short SW_MAC_UDK_FAILED_CHECK 				= (short) 0x9312;
	public static final short SW_ENC_UDK_FAILED_CHECK 				= (short) 0x9313;
	public static final short SW_PBOC_SELECTED_FILE_INVALIDATED 	= (short) 0x6283;
	public static final short SW_PBOC_AUTHENTICATION_FAILED 		= (short) 0x6300;
	public static final short SW_AUTH_METHOD_BLOCKED 				= (short) 0x6983;
	public static final short SW_SM_MISSING 						= (short) 0x6987;
	public static final short SW_SM_INCORRECT 						= (short) 0x6988;
	public static final short SW_REFERENCED_DATA_NOT_FOUND 			= (short) 0x6A88;
	public static final short SW_CLA_INCORRECT 						= (short) 0x6800;
	public static final short SW_MEMORY_CORRUPTED 					= (short) 0x6581;

	 //extended SW
    static final short 	SW_CONSECCUTIVE_4TH_OFFLINE_PREAUTHOEITY = (short) 0x6971;
    static final short 	SW_CONSECCUTIVE_SAME_OFFLINE_PREAUTHOEITY = (short) 0x6972;
    static final short 	SW_PREAUTHOEITY_TRSANSACTION = (short) 0x6973;
    static final short 	SW_UPDATE_WRONG = (short) 0x6974;
    static final short 	SW_TC_NOT_USABLE = (short) 0x9406;
    static final short  SW_PUT_WRANG_DATA= (short) 0x6976;
    
    static final short SW_EXTENDED_KEY_CHECK = (short) 0x9500;
	
	/* CLASS byte definition */
	public static final byte CLA_EMV = (byte)0x80;
	public static final byte CLA_EMV_MAC = (byte)0x84;
	public static final byte CLA_EMV_PROP = (byte)0x90;
	public static final byte CLA_ISO = (byte)0x00;
	public static final byte CLA_ISO_MAC = (byte)0x04;
	
	/* MASKING */
	public static final byte MASK_CLA_CHANNEL = (byte) 0xFC;
	public static final short MASK_CLA_INS_CHANNEL = (short) 0xFCFF;
	public static final byte MASK_FF = (byte)0xFF;
	public static final byte MASK_FF00 = (byte)0xFF00;
	public static final short MASK_00FF = (short)0x00FF;
	
	static final byte INS_GET_RESPONSE = (byte)0xC0;
	/* INStruction byte definition*/
	public static final byte INS_CP_INIT_UPDATE = (byte) 0x50;
    public static final byte INS_CP_EXT_AUTH = (byte) 0x82;
    public static final byte INS_CP_STORE_DATA = (byte) 0xE2;    
    
	public static final byte INS_EMV_SELECT = (byte)0xA4;
	public static final byte INS_EMV_GENERATE_AC = (byte)0xAE;
	public static final byte INS_EMV_GET_PROCESSING_OPTIONS = (byte)0xA8;
	public static final byte INS_EMV_GET_CHALLENGE = (byte)0x84; // If RSA supported
	public static final byte INS_EMV_VERIFY = (byte)0x20;
	public static final byte INS_EMV_INTERNAL_AUTHENTICATE = (byte)0x88;
	public static final byte INS_EMV_EXTERNAL_AUTHENTICATE = (byte)0x82;
	public static final byte INS_EMV_READ_RECORD  	= (byte)0xB2;
	public static final byte INS_EMV_APP_BLOCK  = (byte)0x1E;
	public static final byte INS_EMV_APP_UNBLOCK = (byte)0x18;
	public static final byte INS_EMV_CARD_BLOCK = (byte)0x16;
	public static final byte INS_EMV_UPDATE_RECORD = (byte)0xDC;
	public static final byte INS_EMV_PIN_CHANGE = (byte) 0x24;	
	public static final byte INS_EMV_PUT_DATA = (byte)0xDA;
	public static final byte INS_EMV_GET_DATA = (byte)0xCA;
	
	  //extended INS
    static final byte INS_READ_CAPP_DATA 	= (byte) 0xB4;
    static final byte INS_UPDATE_CAPP_DATA 	= (byte) 0xDE;
    static final byte INS_APPEND_RECORD 	= (byte) 0xE2;
    static final byte INS_GET_TRANS_PROVE 	= (byte) 0x5A;
	
	public static final byte VERIFY_ENCIPHERED_PIN	 = (byte)0x88;
	public static final byte VERIFY_PLAIN_PIN	 = (byte)0x80;
	
	
	static final short CARD_CHALLENGE_LENGTH = (short) 0x08;
	
	
    static final short LEN_FILE_INFO = (short) 7;
    static final short OFFSET_FILE_INFO_SFI = (short)0;    
    static final short OFFSET_FILE_INFO_TYPE = (short)1;
    static final short OFFSET_FILE_INFO_READ = (short)2;
    static final short OFFSET_FILE_INFO_WRITE = (short)3;
    static final short OFFSET_FILE_INFO_MAX_REC_NUM = (short)4;
    static final short OFFSET_FILE_INFO_REC_NUM = (short)5;
    static final short OFFSET_FILE_INFO_REC_LEN  = (short)6;
	
	
	
	/* DGIs */
	public static final short DGI9102 = (short) 0x9102; /* for FCI Contact */
	public static final short DGI9103 = (short) 0x9103; /* for FCI Contactless */
	public static final short DGI9104 = (short) 0x9104; /* for Debit/Credit  */
	public static final short DGI9203 = (short) 0x9203; /* for E-Cash  */
	public static final short DGI9207 = (short) 0x9207; /* for qPBOC Contactless */
	public static final short DGI9200 = (short) 0x9200; /* for IAD */
	
	/*Internal Data GDI */
	public static final short DGI0D01 = (short) 0x0D01;	
	public static final short DGI0E01 = (short) 0x0E01;
	

	
	/* TAGs of DGI 0E01 or 0D01*/
	public static final short TAG5F28 = (short) 0x5F28;
	public static final short TAG5F2D = (short) 0x5F2D;
	public static final short TAG9F11 = (short) 0x9F11;
	public static final short TAG9F12 = (short) 0x9F12;
	public static final short TAG9F13 = (short) 0x9F13;
	public static final short TAG9F17 = (short) 0x9F17;
	public static final short TAG9F42 = (short) 0x9F42;
	public static final short TAG9F36 = (short) 0x9F36;
	public static final short TAG9F4F = (short) 0x9F4F;
	public static final short TAG9F53 = (short) 0x9F53;
	public static final short TAG9F54 = (short) 0x9F54;
	public static final short TAG9F55 = (short) 0x9F55;
	public static final short TAG9F58 = (short) 0x9F58;
	public static final short TAG9F59 = (short) 0x9F59;
	public static final short TAG9F5C = (short) 0x9F5C;
	public static final short TAG9F5E = (short) 0x9F5E;
	public static final short TAG9F63 = (short) 0x9F63;
	public static final short TAG9F72 = (short) 0x9F72;
	public static final short TAG9F6D = (short) 0x9F6D;
	public static final short TAG9F76 = (short) 0x9F76;
	public static final short TAG9F77 = (short) 0x9F77;
	public static final short TAG9F78 = (short) 0x9F78;
	public static final short TAG9F79 = (short) 0x9F79;
	
	public static final short TAG0057 = (short) 0x0057;
	public static final short TAG0050 = (short) 0x0050;
	public static final short TAG0082 = (short) 0x0082;
	public static final short TAG0087 = (short) 0x0087;
	public static final short TAG0094 = (short) 0x0094;
	public static final short TAGBF0C = (short) 0xBF0C;
	public static final short TAG5F20 = (short) 0x5F20;
	public static final short TAG5F34 = (short) 0x5F34;
	public static final short TAG9F10 = (short) 0x9F10;
	public static final short TAG9F1F = (short) 0x9F1F;
	public static final short TAG9F38 = (short) 0x9F38;
	public static final short TAG9F51 = (short) 0x9F51;
	public static final short TAG9F52 = (short) 0x9F52;
	public static final short TAG9F56 = (short) 0x9F56;
	public static final short TAG9F57 = (short) 0x9F57;
	public static final short TAG9F5D = (short) 0x9F5D;
	public static final short TAG9F67 = (short) 0x9F67;
	public static final short TAG9F68 = (short) 0x9F68;// CAP Card Additional Processes
	public static final short TAG9F6B = (short) 0x9F6B;// Card CVM Limit
	public static final short TAGDF72 = (short) 0xDF72;// Card CVM Limit ECS
	public static final short TAG9F6C = (short) 0x9F6C;
	public static final short TAG9F6E = (short) 0x9F6E;
	public static final short TAG9F73 = (short) 0x9F73;
	public static final short TAG9F7C = (short) 0x9F7C;
	
	public static final short TAG9F75 = (short) 0x9F75;//CTTAL Cumulative Total Transaction Amount Limit (Dual Currency)
	public static final short TAG9F4E = (short) 0x9F4E;//MN Merchant Name
	
	public static final short TAGDF71 = (short) 0xDF71;
	public static final short TAGDF77 = (short) 0xDF77;
	public static final short TAGDF78 = (short) 0xDF78;
	public static final short TAGDF79 = (short) 0xDF79;
	public static final short TAGDF76 = (short) 0xDF76;
	public static final short TAGDF4F = (short) 0xDF4F;
	
	/* DGI 8000 */
	public static final short DGI8000 = (short)0x8000;
	
	/* DGI 9000 */
	public static final short DGI9000 = (short)0x9000;
	

	
	/* DGI 8010 */
	public static final short DGI8010 = (short)0x8010;
	
	/* DGI 9010 */
	public static final short DGI9010 = (short)0x9010;
	
	
	/* DGI RSA */
	public static final short DGI8101 = (short)0x8101;
	public static final short DGI8103 = (short)0x8103;
	
	/* DGI CRT RSA */
	public static final short DGI8201 = (short)0x8201;
	public static final short DGI8202 = (short)0x8202;
	public static final short DGI8203 = (short)0x8203;
	public static final short DGI8204 = (short)0x8204;
	public static final short DGI8205 = (short)0x8205;
	
	public static final byte RSA_PART_PQ = 0;
	public static final byte RSA_PART_DQ1 = 1;
	public static final byte RSA_PART_DP1 = 2;
	public static final byte RSA_PART_Q = 3;
	public static final byte RSA_PART_P = 4;
	
	/* Personalization Related Constants */
	public static final short OFF_PERSO_DGI 		= (short)0x05;
	public static final short OFF_PERSO_DGI_LENTH 	= (short)0x07;
	public static final short OFF_PERSO_DGI_DATA 	= (short)0x08;
	
	
	public static final short SPECIAL_INTERNAL_TLV_DGI = (short) 0x7FFE;

	
}
