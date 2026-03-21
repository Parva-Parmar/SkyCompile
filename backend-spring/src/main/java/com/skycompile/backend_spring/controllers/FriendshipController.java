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

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "*", maxAge = 3600)
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

    @PostMapping("/reject/{id}")
    public ResponseEntity<String> rejectFriendRequest(@PathVariable UUID id) {
        try {
            friendshipService.rejectFriendRequest(id);
            return new ResponseEntity<>("Request rejected and deleted.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Friendship>> getUserFriends() {
        try {
            List<Friendship> friends = friendshipService.getUserFriends();
            return new ResponseEntity<>(friends, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Friendship>> getPendingRequests() {
        try {
            List<Friendship> requests = friendshipService.getPendingRequests();
            return new ResponseEntity<>(requests, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
