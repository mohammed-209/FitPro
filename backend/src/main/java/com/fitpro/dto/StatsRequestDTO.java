package com.fitpro.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class StatsRequestDTO {
    private Double weight;
    private Double height;
    
    @JsonProperty("bodyFatPercentage")
    private Double bodyFatPercentage;
    
    @JsonProperty("measurementDate")
    private ZonedDateTime measurementDate;
} 