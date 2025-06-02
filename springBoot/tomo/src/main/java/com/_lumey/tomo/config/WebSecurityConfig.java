package com._lumey.tomo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@Component
public class WebSecurityConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOrigins(
            "http://localhost:5173"
        )
        .allowedMethods("*")
        .allowCredentials(true)
        .maxAge(3600);
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .httpBasic(httpBasic -> httpBasic.disable())
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/auth/**").permitAll()
            .anyRequest().permitAll()
        );

    return http.build();
  }
}
