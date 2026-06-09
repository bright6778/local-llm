/*
 * Created on 2006. 3. 28.
 *
 */
package com.konai.pboc;

import javacard.framework.ISO7816;
import javacard.framework.ISOException;

/**
 * @author bsoh
 *
 */
class PBOCFile {
	private Object[] m_records;
	private RecordTableList[] record_table_list;
	private byte m_SFI;
	//private byte m_startRecordNum;
	//private byte m_maxRecordNum;
	//private short m_nextRecordNum;
    static final short LENGTH_GLOBAL_RECAORD_TABLE =(short)16; 
	
	
	
	/**
	 * 
	 * 
	 * 
	 * @param sfi
	 * @param startRecordNum
	 * @param maxRecordNum
	 */
/*	PBOCFile(byte sfi, byte startRecordNum, byte maxRecordNum) {
		if (maxRecordNum < startRecordNum) {
			ISOException.throwIt(ISO7816.SW_WRONG_DATA);
		}
		m_SFI = sfi;
		m_startRecordNum = startRecordNum;
		m_maxRecordNum = maxRecordNum;
		m_records = new Object[(short) (maxRecordNum - startRecordNum + (byte) 0x01)];
		m_nextRecordNum = startRecordNum;
	}*/
	
	

	/**
	 * 
	 * 
	 * 
	 * @param sfi
	 * @param startRecordNum
	 * @param maxRecordNum
	 */
	PBOCFile(byte sfi) {
	
		m_SFI = sfi;
	
		
		record_table_list = new RecordTableList[LENGTH_GLOBAL_RECAORD_TABLE];
		//record_table_list[0]=new RecordTableList(LENGTH_GLOBAL_RECAORD_TABLE);
	}

	/**
	 * Retrun SFI of this file
	 * 
	 * @return
	 */
/*	byte getSFI() {
		return m_SFI;
	}*/

	/**
	 * Return true if record specified by recordNum exist in this file
	 *  
	 * @param recordNum
	 * @return
	 */
/*	boolean isRecordExist(byte recordNum) {
		if ((recordNum == 0) || ((recordNum >= m_startRecordNum) && (recordNum <= m_maxRecordNum))) {
			return true;
		} else {
			return false;
		}
	}*/
	
	/**
	 * Append record in this file when recordNum is 0x00  
	 * Otherwise, append record by specified recordNum
	 * 
	 * @param length
	 * @param src
	 * @param recordNum
	 * @return
	 */
/*	byte[] appendRecord(short length, byte[] src, byte recordNum) {
		if (recordNum != 0) {
			m_nextRecordNum = recordNum;
		}
		m_nextRecordNum += (byte) 0x01;

		return (byte[]) (m_records[(short) (m_nextRecordNum - m_startRecordNum - (byte) 0x01)] = new byte[length]);
	}*/
     
	byte[] appendRecord( short length,short recordNum) {
		recordNum=(short)(recordNum-1);
		short num_table=(short)(recordNum/LENGTH_GLOBAL_RECAORD_TABLE);
		short index_table=(short)(recordNum%LENGTH_GLOBAL_RECAORD_TABLE);
		if(record_table_list[num_table]==null){
			record_table_list[num_table]=new RecordTableList(LENGTH_GLOBAL_RECAORD_TABLE);
		}
		
		if(record_table_list[num_table].getRecord(index_table)==null){
			record_table_list[num_table].intializeRecord(length,index_table);
		}
		return record_table_list[num_table].getRecord(index_table);
	}
	
	/**
	 * Get record specified by recordNum in this file.
	 * 
	 * @param recordNum
	 * @return
	 */
	byte[] getRecord(short recordNum) {
		recordNum=(short)(recordNum-1);
		short num_table=(short)(recordNum/LENGTH_GLOBAL_RECAORD_TABLE);
		short index_table=(short)(recordNum%LENGTH_GLOBAL_RECAORD_TABLE);
		return record_table_list[num_table].getRecord(index_table);
	}

	public void updateRecord(short length, short recordNum) {
		recordNum=(short)(recordNum-1);
		short num_table=(short)(recordNum/LENGTH_GLOBAL_RECAORD_TABLE);
		short index_table=(short)(recordNum%LENGTH_GLOBAL_RECAORD_TABLE);
		if(record_table_list[num_table]==null){
			record_table_list[num_table]=new RecordTableList(LENGTH_GLOBAL_RECAORD_TABLE);
		}
		
		record_table_list[num_table].deleteRecord(index_table);
        record_table_list[num_table].intializeRecord(length,index_table);
		
	
		
	}
}
