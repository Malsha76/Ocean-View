package com.oceanview.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Document(collection = "reservations")
public class Reservation {

    @Id
    private String id;
    @Indexed(unique = true)
    private String reservationNumber;
    private String roomTypeCode;  // denormalized for queries; full RoomType can be loaded when needed
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private GuestInfo guestInfo;
    private String status = "CONFIRMED";  // CONFIRMED, CANCELLED, CHECKED_OUT
    private LocalDateTime createdAt;

    public Reservation() {
        this.createdAt = LocalDateTime.now();
    }

    public long getNights() {
        if (checkInDate == null || checkOutDate == null) return 0;
        return ChronoUnit.DAYS.between(checkInDate, checkOutDate);
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
