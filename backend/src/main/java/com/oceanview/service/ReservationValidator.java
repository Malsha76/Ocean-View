package com.oceanview.service;

import com.oceanview.dto.ReservationRequest;
import com.oceanview.repository.RoomTypeRepository;
import com.oceanview.repository.ReservationRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class ReservationValidator {

    private static final List<String> ALLOWED_ROOM_TYPES = List.of("STANDARD", "DELUXE", "SUITE");

    private final RoomTypeRepository roomTypeRepository;
    private final ReservationRepository reservationRepository;

    public ReservationValidator(RoomTypeRepository roomTypeRepository, ReservationRepository reservationRepository) {
        this.roomTypeRepository = roomTypeRepository;
        this.reservationRepository = reservationRepository;
    }

    public List<String> validate(ReservationRequest req) {
        List<String> errors = new ArrayList<>();
        if (req.getGuestName() == null || req.getGuestName().isBlank()) {
            errors.add("Guest name is required");
        }
        if (req.getAddress() == null || req.getAddress().isBlank()) {
            errors.add("Address is required");
        }
        if (req.getContactNumber() == null || req.getContactNumber().isBlank()) {
            errors.add("Contact number is required");
        } else if (!req.getContactNumber().matches("^\\d{10}$")) {
            errors.add("Contact number must be exactly 10 digits");
        }
        if (req.getRoomTypeCode() == null || req.getRoomTypeCode().isBlank()) {
            errors.add("Room type is required");
        } else if (!ALLOWED_ROOM_TYPES.contains(req.getRoomTypeCode().toUpperCase())) {
            errors.add("Room type must be one of: STANDARD, DELUXE, SUITE");
        } else if (roomTypeRepository.findByCode(req.getRoomTypeCode().toUpperCase()).isEmpty()) {
            errors.add("Room type not found in system: " + req.getRoomTypeCode());
        }
        if (req.getCheckInDate() == null) {
            errors.add("Check-in date is required");
        }
        if (req.getCheckOutDate() == null) {
            errors.add("Check-out date is required");
        }
        if (req.getCheckInDate() != null && req.getCheckOutDate() != null) {
            if (!req.getCheckOutDate().isAfter(req.getCheckInDate())) {
                errors.add("Check-out date must be after check-in date");
            }
            if (req.getCheckInDate().isBefore(LocalDate.now())) {
                errors.add("Check-in date cannot be in the past");
            }
        }
        return errors;
    }
}
