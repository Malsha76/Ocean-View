package com.oceanview.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oceanview.dto.ReservationRequest;
import com.oceanview.dto.ReservationResponse;
import com.oceanview.domain.GuestInfo;
import com.oceanview.service.ReservationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservationController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
class ReservationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private ReservationService reservationService;

    @Test
    @WithMockUser
    void addReservation_returns201WithReservationNumber() throws Exception {
        ReservationRequest req = new ReservationRequest();
        req.setGuestName("Test Guest");
        req.setAddress("456 Test Ave");
        req.setContactNumber("0779876543");
        req.setRoomTypeCode("STANDARD");
        req.setCheckInDate(LocalDate.now().plusDays(1));
        req.setCheckOutDate(LocalDate.now().plusDays(3));

        ReservationResponse resp = new ReservationResponse();
        resp.setReservationNumber("RES-ABC12345");
        resp.setGuestInfo(new GuestInfo("Test Guest", "456 Test Ave", "0779876543"));
        when(reservationService.addReservation(any())).thenReturn(resp);

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reservationNumber").value("RES-ABC12345"))
                .andExpect(jsonPath("$.guestInfo.guestName").value("Test Guest"));
    }

    @Test
    @WithMockUser
    void getByNumber_returns404WhenNotFound() throws Exception {
        when(reservationService.getByReservationNumber("NOT-FOUND-123"))
                .thenThrow(new ReservationService.NotFoundException("Reservation not found: NOT-FOUND-123"));

        mockMvc.perform(get("/api/reservations/NOT-FOUND-123"))
                .andExpect(status().isNotFound());
    }
}
