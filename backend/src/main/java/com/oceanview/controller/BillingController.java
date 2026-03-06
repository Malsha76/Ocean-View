package com.oceanview.controller;

import com.oceanview.dto.BillResult;
import com.oceanview.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/{reservationNumber}")
    public ResponseEntity<BillResult> calculateBill(@PathVariable String reservationNumber) {
        BillResult bill = billingService.calculateBill(reservationNumber);
        return ResponseEntity.ok(bill);
    }
}
