package com.oceanview.billing;

import org.springframework.stereotype.Component;

/**
 * Factory pattern: centralises creation of RoomRateStrategy. Enables adding seasonal or
 * room-type-specific strategies without changing BillingService.
 */
@Component
public class RoomRateStrategyFactory {

    private final RoomRateStrategy defaultStrategy = new DefaultRoomRateStrategy();

    public RoomRateStrategy getStrategy(String roomTypeCode) {
        // Could return different strategies by roomTypeCode (e.g. seasonal for SUITE).
        return defaultStrategy;
    }
}
