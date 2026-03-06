package com.oceanview.service;

import com.oceanview.domain.Reservation;
import com.oceanview.dto.ReservationResponse;
import com.oceanview.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReservationRepository reservationRepository;
    private final BillingService billingService;

    public ReportService(ReservationRepository reservationRepository, BillingService billingService) {
        this.reservationRepository = reservationRepository;
        this.billingService = billingService;
    }

    public List<ReservationResponse> getDailyCheckIns(LocalDate date) {
        return reservationRepository.findByCheckInDate(date).stream()
                .map(ReservationResponse::from)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getReservationsByRoomType(String roomTypeCode) {
        return reservationRepository.findByRoomTypeCode(roomTypeCode.toUpperCase()).stream()
                .map(ReservationResponse::from)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getUpcomingCheckOuts(int limitDays) {
        LocalDate from = LocalDate.now();
        LocalDate to = from.plusDays(limitDays);
        return reservationRepository.findByCheckOutDateBetweenOrderByCheckOutDateAsc(from, to).stream()
                .map(ReservationResponse::from)
                .collect(Collectors.toList());
    }

    public BigDecimal getRevenueByDateRange(LocalDate from, LocalDate to) {
        List<Reservation> reservations = reservationRepository.findByCheckOutDateBetweenOrderByCheckOutDateAsc(from, to);
        BigDecimal total = BigDecimal.ZERO;
        for (Reservation r : reservations) {
            try {
                total = total.add(billingService.calculateBill(r.getReservationNumber()).getTotal());
            } catch (Exception ignored) { }
        }
        return total;
    }
}
