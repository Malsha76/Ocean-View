package com.oceanview.controller;

import com.oceanview.domain.RoomType;
import com.oceanview.repository.RoomTypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
public class RoomTypeController {

    private final RoomTypeRepository roomTypeRepository;

    public RoomTypeController(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    @GetMapping
    public ResponseEntity<List<RoomType>> list() {
        return ResponseEntity.ok(roomTypeRepository.findAll());
    }
}
