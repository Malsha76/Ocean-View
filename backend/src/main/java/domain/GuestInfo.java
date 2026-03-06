package com.oceanview.domain;

import org.springframework.data.mongodb.core.mapping.Field;

public class GuestInfo {

    @Field("guestName")
    private String guestName;
    @Field("address")
    private String address;
    @Field("contactNumber")
    private String contactNumber;

    public GuestInfo() {}

    public GuestInfo(String guestName, String address, String contactNumber) {
        this.guestName = guestName;
        this.address = address;
        this.contactNumber = contactNumber;
    }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}
