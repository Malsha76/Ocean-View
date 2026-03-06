package com.oceanview.controller;

import com.oceanview.dto.ReservationRequest;
import com.oceanview.dto.ReservationResponse;
import com.oceanview.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> addReservation(@Valid @RequestBody ReservationRequest request) {
        ReservationResponse created = reservationService.addReservation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{reservationNumber}")
    public ResponseEntity<ReservationResponse> getByNumber(@PathVariable String reservationNumber) {
        ReservationResponse reservation = reservationService.getByReservationNumber(reservationNumber);
        return ResponseEntity.ok(reservation);
    }
}
