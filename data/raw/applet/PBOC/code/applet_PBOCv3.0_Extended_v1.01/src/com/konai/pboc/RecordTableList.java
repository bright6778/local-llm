/*
 * @Date : 2011. 3. 15.
 * @auther: CYF
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package com.konai.pboc;

public class RecordTableList {
	private Object[] m_records;

	RecordTableList(short lenth) {
		
		
		
		m_records = new Object[lenth];
		
	}
	byte[] intializeRecord(short length,  short recordIndex) {
		return (byte[]) (m_records[recordIndex] = new byte[length]);
	}
	void deleteRecord(short recordIndex) {
		m_records[recordIndex] = null;
	}	
	
	byte[] getRecord(short recordIndex) {
		return (byte[]) m_records[recordIndex];
	}
}
