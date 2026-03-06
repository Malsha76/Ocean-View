package com.oceanview.repository;

import com.oceanview.domain.RoomType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoomTypeRepository extends MongoRepository<RoomType, String> {

    Optional<RoomType> findByCode(String code);
}
