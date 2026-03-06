package com.oceanview.service;

import com.oceanview.domain.GuestInfo;
import com.oceanview.domain.Reservation;
import com.oceanview.domain.RoomType;
import com.oceanview.dto.ReservationRequest;
import com.oceanview.dto.ReservationResponse;
import com.oceanview.repository.ReservationRepository;
import com.oceanview.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final ReservationValidator reservationValidator;

    public ReservationService(ReservationRepository reservationRepository,
                              RoomTypeRepository roomTypeRepository,
                              ReservationValidator reservationValidator) {
        this.reservationRepository = reservationRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.reservationValidator = reservationValidator;
    }

    public ReservationResponse addReservation(ReservationRequest request) {
        List<String> errors = reservationValidator.validate(request);
        if (!errors.isEmpty()) {
            throw new ValidationException(String.join("; ", errors));
        }
        String code = request.getRoomTypeCode().toUpperCase();
        RoomType roomType = roomTypeRepository.findByCode(code)
                .orElseThrow(() -> new ValidationException("Room type not found: " + code));
        String reservationNumber = generateUniqueReservationNumber();
        GuestInfo guestInfo = new GuestInfo(
                request.getGuestName().trim(),
                request.getAddress().trim(),
                request.getContactNumber().trim()
        );
        Reservation reservation = new Reservation();
        reservation.setReservationNumber(reservationNumber);
        reservation.setRoomTypeCode(code);
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setGuestInfo(guestInfo);
        reservation.setStatus("CONFIRMED");
        reservation = reservationRepository.save(reservation);
        return ReservationResponse.from(reservation);
    }

    public ReservationResponse getByReservationNumber(String reservationNumber) {
        Reservation r = reservationRepository.findByReservationNumber(reservationNumber.trim())
                .orElseThrow(() -> new NotFoundException("Reservation not found: " + reservationNumber));
        return ReservationResponse.from(r);
    }

    private String generateUniqueReservationNumber() {
        String number;
        do {
            number = "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (reservationRepository.existsByReservationNumber(number));
        return number;
    }

    public static class ValidationException extends RuntimeException {
        public ValidationException(String message) { super(message); }
    }

    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String message) { super(message); }
    }
}
