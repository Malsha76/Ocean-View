package com.oceanview.service;

import com.oceanview.billing.RoomRateStrategy;
import com.oceanview.billing.RoomRateStrategyFactory;
import com.oceanview.domain.Reservation;
import com.oceanview.domain.RoomType;
import com.oceanview.dto.BillResult;
import com.oceanview.repository.ReservationRepository;
import com.oceanview.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class BillingService {

    private final ReservationRepository reservationRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRateStrategyFactory roomRateStrategyFactory;

    public BillingService(ReservationRepository reservationRepository,
                          RoomTypeRepository roomTypeRepository,
                          RoomRateStrategyFactory roomRateStrategyFactory) {
        this.reservationRepository = reservationRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.roomRateStrategyFactory = roomRateStrategyFactory;
    }

    public BillResult calculateBill(String reservationNumber) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber.trim())
                .orElseThrow(() -> new ReservationService.NotFoundException("Reservation not found: " + reservationNumber));
        RoomType roomType = roomTypeRepository.findByCode(reservation.getRoomTypeCode())
                .orElseThrow(() -> new ReservationService.ValidationException("Room type not found for reservation"));
        long nights = reservation.getNights();
        RoomRateStrategy strategy = roomRateStrategyFactory.getStrategy(reservation.getRoomTypeCode());
        BigDecimal ratePerNight = strategy.getRatePerNight(roomType);
        BigDecimal total = ratePerNight.multiply(BigDecimal.valueOf(nights));
        return new BillResult(
                reservation.getReservationNumber(),
                nights,
                ratePerNight,
                total,
                reservation.getGuestInfo(),
                reservation.getRoomTypeCode()
        );
    }
}
