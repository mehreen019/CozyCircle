package com.event_management.event_management_system_backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final UserAuthenticationProvider userAuthenticationProvider;
    private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .exceptionHandling().authenticationEntryPoint(userAuthenticationEntryPoint)
                .and()
                .addFilterBefore(new JWTAuthFilter(userAuthenticationProvider), BasicAuthenticationFilter.class)
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(HttpMethod.POST, "/login", "/register", "/addattendee","/events/rate","/addevent", "/count", "/events/ranked/ratings", "/events/ranked/attendees", "/events/ranked/capacity", "/events/ranked/available-capacity", "/events/ranked/all").permitAll()
                        .requestMatchers(HttpMethod.GET, "/getallevents", "/count", "/events/ranked/ratings", "/events/ranked/attendees", "/events/ranked/capacity", "/events/ranked/available-capacity", "/events/ranked/all","/events/category/count").permitAll()
                        .requestMatchers(HttpMethod.POST, "/login", "/register", "/addattendee","/events/rate","/addevent", "/count", "/events/ranked/ratings", "/events/ranked/attendees", "/events/ranked/capacity", "/events/ranked/available-capacity", "/events/ranked/all", "/events/filter").permitAll()
                        .requestMatchers(HttpMethod.GET, "/getallevents", "/count", "/events/ranked/ratings", "/events/ranked/attendees", "/events/ranked/capacity", "/events/ranked/available-capacity", "/events/ranked/all", "events/search?*").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/unregister").permitAll()
                        .anyRequest().authenticated())
        ;

        return http.build();
    }
}
