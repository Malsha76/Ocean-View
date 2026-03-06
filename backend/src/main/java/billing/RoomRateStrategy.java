package com.oceanview.billing;

import com.oceanview.domain.RoomType;

import java.math.BigDecimal;

/**
 * Strategy pattern: different pricing rules can be implemented (e.g. seasonal, room type specific).
 */
public interface RoomRateStrategy {

    BigDecimal getRatePerNight(RoomType roomType);
}
