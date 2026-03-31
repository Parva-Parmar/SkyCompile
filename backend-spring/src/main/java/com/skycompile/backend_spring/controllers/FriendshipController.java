package com.skycompile.backend_spring.controllers;

import com.skycompile.backend_spring.dto.FriendshipRequest;
import com.skycompile.backend_spring.entities.Friendship;
import com.skycompile.backend_spring.services.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.stream.Collectors;
import com.skycompile.backend_spring.entities.User;

@RestController
@RequestMapping("/api/v1/friends")

public class FriendshipController {

    private final FriendshipService friendshipService;

    @Autowired
    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }

    @PostMapping("/request")
    public ResponseEntity<Friendship> sendFriendRequest(@RequestBody FriendshipRequest request) {
        try {
            Friendship friendship = friendshipService.sendFriendRequest(request.getAddresseeEmail());
            return new ResponseEntity<>(friendship, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/accept/{id}")
    public ResponseEntity<Friendship> acceptFriendRequest(@PathVariable UUID id) {
        try {
            Friendship friendship = friendshipService.acceptFriendRequest(id);
            return new ResponseEntity<>(friendship, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/reject/{id}")
    public ResponseEntity<String> rejectFriendRequest(@PathVariable UUID id) {
        try {
            friendshipService.rejectFriendRequest(id);
            return new ResponseEntity<>("Request rejected and deleted.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getUserFriends() {
        try {
            List<Friendship> friends = friendshipService.getUserFriends();
            UUID currentUserId = friendshipService.getCurrentUser().getId();
            
            List<Map<String, Object>> mapped = friends.stream().map(f -> {
                User friendUser = f.getRequester().getId().equals(currentUserId) ? f.getAddressee() : f.getRequester();
                return Map.of(
                    "id", (Object) f.getId(),
                    "firstname", friendUser.getFirstname(),
                    "lastname", friendUser.getLastname(),
                    "email", friendUser.getEmail()
                );
            }).collect(Collectors.toList());
            
            return new ResponseEntity<>(mapped, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests() {
        try {
            List<Friendship> requests = friendshipService.getPendingRequests();
            
            List<Map<String, Object>> mapped = requests.stream().map(f -> Map.of(
                "id", (Object) f.getId(),
                "firstname", f.getRequester().getFirstname(),
                "lastname", f.getRequester().getLastname(),
                "email", f.getRequester().getEmail(),
                "created_at", f.getCreatedAt() != null ? f.getCreatedAt().toString() : ""
            )).collect(Collectors.toList());
            
            return new ResponseEntity<>(mapped, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeFriend(@PathVariable UUID id) {
        try {
            // Removing a friend natively works identically to securely dropping the matching friendship link
            friendshipService.rejectFriendRequest(id);
            return new ResponseEntity<>("Friend removed successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
