package com.oceanview.service;

import com.oceanview.dto.ReservationRequest;
import com.oceanview.repository.ReservationRepository;
import com.oceanview.repository.RoomTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationValidatorTest {

    @Mock
    private RoomTypeRepository roomTypeRepository;
    @Mock
    private ReservationRepository reservationRepository;

    private ReservationValidator validator;

    @BeforeEach
    void setUp() {
        validator = new ReservationValidator(roomTypeRepository, reservationRepository);
        com.oceanview.domain.RoomType rt = new com.oceanview.domain.RoomType();
        rt.setCode("STANDARD");
        lenient().when(roomTypeRepository.findByCode("STANDARD")).thenReturn(Optional.of(rt));
    }

    @Test
    void validate_rejectsWhenCheckOutBeforeCheckIn() {
        ReservationRequest req = new ReservationRequest();
        req.setGuestName("John");
        req.setAddress("123 St");
        req.setContactNumber("0771234567");
        req.setRoomTypeCode("STANDARD");
        req.setCheckInDate(LocalDate.of(2025, 3, 10));
        req.setCheckOutDate(LocalDate.of(2025, 3, 8));

        List<String> errors = validator.validate(req);

        assertThat(errors).anyMatch(e -> e.contains("Check-out date"));
    }

    @Test
    void validate_rejectsWhenCheckOutEqualsCheckIn() {
        ReservationRequest req = new ReservationRequest();
        req.setGuestName("John");
        req.setAddress("123 St");
        req.setContactNumber("0771234567");
        req.setRoomTypeCode("STANDARD");
        req.setCheckInDate(LocalDate.now().plusDays(3));
        req.setCheckOutDate(LocalDate.now().plusDays(3));

        List<String> errors = validator.validate(req);

        assertThat(errors).anyMatch(e -> e.contains("must be after"));
    }

    @Test
    void validate_rejectsMissingGuestName() {
        ReservationRequest req = new ReservationRequest();
        req.setGuestName("");
        req.setAddress("123 St");
        req.setContactNumber("0771234567");
        req.setRoomTypeCode("STANDARD");
        req.setCheckInDate(LocalDate.now().plusDays(1));
        req.setCheckOutDate(LocalDate.now().plusDays(2));

        List<String> errors = validator.validate(req);

        assertThat(errors).anyMatch(e -> e.toLowerCase().contains("guest name"));
    }

    @Test
    void validate_rejectsInvalidRoomType() {
        ReservationRequest req = new ReservationRequest();
        req.setGuestName("John");
        req.setAddress("123 St");
        req.setContactNumber("0771234567");
        req.setRoomTypeCode("INVALID");
        req.setCheckInDate(LocalDate.now().plusDays(1));
        req.setCheckOutDate(LocalDate.now().plusDays(2));

        List<String> errors = validator.validate(req);

        assertThat(errors).isNotEmpty();
    }

    @Test
    void validate_rejectsWhenContactNumberNotTenDigits() {
        ReservationRequest req = new ReservationRequest();
        req.setGuestName("John");
        req.setAddress("123 St");
        req.setContactNumber("071234567");
        req.setRoomTypeCode("STANDARD");
        req.setCheckInDate(LocalDate.now().plusDays(1));
        req.setCheckOutDate(LocalDate.now().plusDays(2));

        List<String> errors = validator.validate(req);

        assertThat(errors).anyMatch(e -> e.contains("10 digits"));
    }

    @Test
    void validate_acceptsValidRequest() {
        ReservationRequest req = new ReservationRequest();
        req.setGuestName("John Doe");
        req.setAddress("123 Main St");
        req.setContactNumber("0771234567");
        req.setRoomTypeCode("STANDARD");
        req.setCheckInDate(LocalDate.now().plusDays(1));
        req.setCheckOutDate(LocalDate.now().plusDays(3));

        List<String> errors = validator.validate(req);

        assertThat(errors).isEmpty();
    }
}
