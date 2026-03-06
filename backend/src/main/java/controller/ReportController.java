package com.oceanview.controller;

import com.oceanview.dto.ReservationResponse;
import com.oceanview.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/daily-checkins")
    public ResponseEntity<List<ReservationResponse>> dailyCheckIns(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(reportService.getDailyCheckIns(date));
    }

    @GetMapping("/by-room-type")
    public ResponseEntity<List<ReservationResponse>> byRoomType(@RequestParam String roomTypeCode) {
        return ResponseEntity.ok(reportService.getReservationsByRoomType(roomTypeCode));
    }

    @GetMapping("/upcoming-checkouts")
    public ResponseEntity<List<ReservationResponse>> upcomingCheckOuts(
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(reportService.getUpcomingCheckOuts(days));
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> revenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        BigDecimal total = reportService.getRevenueByDateRange(from, to);
        return ResponseEntity.ok(Map.of("from", from, "to", to, "totalRevenue", total));
    }
}
