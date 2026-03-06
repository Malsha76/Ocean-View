package com.oceanview.repository;

import com.oceanview.domain.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends MongoRepository<Reservation, String> {

    Optional<Reservation> findByReservationNumber(String reservationNumber);

    List<Reservation> findByCheckInDate(LocalDate checkInDate);

    List<Reservation> findByRoomTypeCode(String roomTypeCode);

    List<Reservation> findByCheckOutDateBetweenOrderByCheckOutDateAsc(LocalDate from, LocalDate to);

    boolean existsByReservationNumber(String reservationNumber);
}
