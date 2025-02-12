package com.event_management.event_management_system_backend.services;

import com.event_management.event_management_system_backend.Dto.AdminDto;
import com.event_management.event_management_system_backend.Dto.CredentialsDto;
import com.event_management.event_management_system_backend.Dto.SignUpDto;
import com.event_management.event_management_system_backend.Dto.UserDto;
import com.event_management.event_management_system_backend.exception.AppException;
import com.event_management.event_management_system_backend.mapper.AdminMapper;
import com.event_management.event_management_system_backend.model.admin;
import com.event_management.event_management_system_backend.repositories.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AdminService {
    private final AdminRepository adminRepository;
    private final AdminMapper adminMapper;
    private final PasswordEncoder passwordEncoder;

    public AdminDto login(CredentialsDto credentialsDto){
        admin aadmin = adminRepository.findByUsername(credentialsDto.getUsername())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        if(passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), aadmin.getPassword())) {
            return adminMapper.toAdminDto(aadmin);
        }

        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public AdminDto register(SignUpDto adminSignupDto){
        Optional<admin> optionalAdmin = adminRepository.findByUsername(adminSignupDto.getUsername());

        if(optionalAdmin.isPresent()){
            throw new AppException("Username already exists", HttpStatus.BAD_REQUEST);
        }

        System.out.println(adminSignupDto);
        
        admin aadmin = adminMapper.signUpToAdmin(adminSignupDto);
        aadmin.setPassword(passwordEncoder.encode(CharBuffer.wrap(adminSignupDto.getPassword())));

        System.out.println("gonna be saved " + aadmin.getUsername() + "ok"+ aadmin.getPassword() +"ok"+ aadmin.getName());
        admin savedAdmin = adminRepository.save(aadmin);
        return adminMapper.toAdminDto(savedAdmin);
    }

    public AdminDto findByUsername(String username){
        System.out.println(username);
        admin aadmin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        return adminMapper.toAdminDto(aadmin);
    }
}
