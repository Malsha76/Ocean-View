package com.oceanview.billing;

import com.oceanview.domain.RoomType;

import java.math.BigDecimal;

/**
 * Default strategy: use the room type's stored rate.
 */
public class DefaultRoomRateStrategy implements RoomRateStrategy {

    @Override
    public BigDecimal getRatePerNight(RoomType roomType) {
        if (roomType == null || roomType.getRatePerNight() == null) {
            return BigDecimal.ZERO;
        }
        return roomType.getRatePerNight();
    }
}
