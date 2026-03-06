package com.oceanview.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/help")
public class HelpController {

    @GetMapping
    public ResponseEntity<Map<String, String>> getHelp() {
        String content = """
                === Ocean View Resort - Help for New Staff ===
                1. LOGIN: Use the username and password provided by your administrator.
                2. ADD RESERVATION: Enter guest name, address, contact number, room type (STANDARD, DELUXE, SUITE), check-in and check-out dates. Ensure check-out is on or after check-in.
                3. DISPLAY RESERVATION: Use the reservation number (e.g. RES-XXXXXXXX) to view full details.
                4. CALCULATE & PRINT BILL: Enter the reservation number. The bill is nights × room rate. You can print from the screen.
                5. REPORTS: Use Reports menu for daily check-ins, reservations by room type, upcoming check-outs, and revenue by date range.
                6. EXIT: Use Logout to exit the system safely.
                """;
        return ResponseEntity.ok(Map.of("content", content));
    }
}
