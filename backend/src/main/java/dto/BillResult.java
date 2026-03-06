package dto;

import com.oceanview.domain.GuestInfo;

import java.math.BigDecimal;

public class BillResult {

    private String reservationNumber;
    private long nights;
    private BigDecimal ratePerNight;
    private BigDecimal total;
    private GuestInfo guestInfo;
    private String roomTypeCode;

    public BillResult(String reservationNumber, long nights, BigDecimal ratePerNight, BigDecimal total,
                      GuestInfo guestInfo, String roomTypeCode) {
        this.reservationNumber = reservationNumber;
        this.nights = nights;
        this.ratePerNight = ratePerNight;
        this.total = total;
        this.guestInfo = guestInfo;
        this.roomTypeCode = roomTypeCode;
    }

    public String getReservationNumber() { return reservationNumber; }
    public long getNights() { return nights; }
    public BigDecimal getRatePerNight() { return ratePerNight; }
    public BigDecimal getTotal() { return total; }
    public GuestInfo getGuestInfo() { return guestInfo; }
    public String getRoomTypeCode() { return roomTypeCode; }
}
