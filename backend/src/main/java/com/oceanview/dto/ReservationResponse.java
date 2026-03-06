package com.oceanview.dto;

import com.oceanview.domain.GuestInfo;
import com.oceanview.domain.Reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReservationResponse {

    private String id;
    private String reservationNumber;
    private String roomTypeCode;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private GuestInfo guestInfo;
    private String status;
    private LocalDateTime createdAt;

    public static ReservationResponse from(Reservation r) {
        ReservationResponse resp = new ReservationResponse();
        resp.setId(r.getId());
        resp.setReservationNumber(r.getReservationNumber());
        resp.setRoomTypeCode(r.getRoomTypeCode());
        resp.setCheckInDate(r.getCheckInDate());
        resp.setCheckOutDate(r.getCheckOutDate());
        resp.setGuestInfo(r.getGuestInfo());
        resp.setStatus(r.getStatus());
        resp.setCreatedAt(r.getCreatedAt());
        return resp;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getReservationNumber() { return reservationNumber; }
    public void setReservationNumber(String reservationNumber) { this.reservationNumber = reservationNumber; }
    public String getRoomTypeCode() { return roomTypeCode; }
    public void setRoomTypeCode(String roomTypeCode) { this.roomTypeCode = roomTypeCode; }
    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }
    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }
    public GuestInfo getGuestInfo() { return guestInfo; }
    public void setGuestInfo(GuestInfo guestInfo) { this.guestInfo = guestInfo; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
