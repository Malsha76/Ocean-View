package com.oceanview.service;

import com.oceanview.billing.RoomRateStrategy;
import com.oceanview.billing.RoomRateStrategyFactory;
import com.oceanview.domain.GuestInfo;
import com.oceanview.domain.Reservation;
import com.oceanview.domain.RoomType;
import com.oceanview.dto.BillResult;
import com.oceanview.repository.ReservationRepository;
import com.oceanview.repository.RoomTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BillingServiceTest {

    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private RoomTypeRepository roomTypeRepository;
    @Mock
    private RoomRateStrategyFactory roomRateStrategyFactory;
    @Mock
    private RoomRateStrategy roomRateStrategy;

    private BillingService billingService;

    @BeforeEach
    void setUp() {
        billingService = new BillingService(reservationRepository, roomTypeRepository, roomRateStrategyFactory);
    }

    @Test
    void calculateBill_returnsCorrectTotal_forThreeNights() {
        Reservation reservation = new Reservation();
        reservation.setReservationNumber("RES-001");
        reservation.setRoomTypeCode("STANDARD");
        reservation.setCheckInDate(LocalDate.of(2025, 3, 1));
        reservation.setCheckOutDate(LocalDate.of(2025, 3, 4));
        reservation.setGuestInfo(new GuestInfo("John Doe", "123 Main St", "0771234567"));

        RoomType roomType = new RoomType();
        roomType.setCode("STANDARD");
        roomType.setRatePerNight(new BigDecimal("100.00"));

        when(roomRateStrategyFactory.getStrategy(anyString())).thenReturn(roomRateStrategy);
        when(reservationRepository.findByReservationNumber("RES-001")).thenReturn(Optional.of(reservation));
        when(roomTypeRepository.findByCode("STANDARD")).thenReturn(Optional.of(roomType));
        when(roomRateStrategy.getRatePerNight(roomType)).thenReturn(new BigDecimal("100.00"));

        BillResult result = billingService.calculateBill("RES-001");

        assertThat(result.getReservationNumber()).isEqualTo("RES-001");
        assertThat(result.getNights()).isEqualTo(3);
        assertThat(result.getRatePerNight()).isEqualByComparingTo("100.00");
        assertThat(result.getTotal()).isEqualByComparingTo("300.00");
        assertThat(result.getGuestInfo().getGuestName()).isEqualTo("John Doe");
    }

    @Test
    void calculateBill_throwsWhenReservationNotFound() {
        when(reservationRepository.findByReservationNumber("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> billingService.calculateBill("INVALID"))
                .isInstanceOf(ReservationService.NotFoundException.class)
                .hasMessageContaining("Reservation not found");
    }
}
