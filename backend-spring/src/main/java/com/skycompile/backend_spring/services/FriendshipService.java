package com.skycompile.backend_spring.services;

import com.skycompile.backend_spring.entities.Friendship;
import com.skycompile.backend_spring.entities.User;
import com.skycompile.backend_spring.repositories.FriendshipRepository;
import com.skycompile.backend_spring.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    @Autowired
    public FriendshipService(FriendshipRepository friendshipRepository, UserRepository userRepository) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Not authenticated");
    }

    public Friendship sendFriendRequest(String addresseeEmail) {
        User requester = getCurrentUser();
        User addressee = userRepository.findByEmail(addresseeEmail)
                .orElseThrow(() -> new RuntimeException("Addressee not found"));

        if (requester.getId().equals(addressee.getId())) {
            throw new RuntimeException("Cannot send a friend request to yourself");
        }

        Optional<Friendship> existingOpt = friendshipRepository.findFriendshipBetweenUsers(requester, addressee);
        if (existingOpt.isPresent()) {
            throw new RuntimeException("Friendship or pending request already exists between these users");
        }

        Friendship friendship = new Friendship();
        friendship.setRequester(requester);
        friendship.setAddressee(addressee);
        friendship.setStatus("pending");
        friendship.setCreatedAt(LocalDateTime.now());
        
        return friendshipRepository.save(friendship);
    }

    public Friendship acceptFriendRequest(UUID friendshipId) {
        User user = getCurrentUser();
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        if (!friendship.getAddressee().getId().equals(user.getId())) {
            throw new RuntimeException("Only the addressee can accept the request");
        }

        if (!"pending".equals(friendship.getStatus())) {
            throw new RuntimeException("Friendship status is not pending");
        }

        friendship.setStatus("accepted");
        return friendshipRepository.save(friendship);
    }

    public void rejectFriendRequest(UUID friendshipId) {
        User user = getCurrentUser();
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        if (!friendship.getAddressee().getId().equals(user.getId()) && !friendship.getRequester().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to reject this request");
        }

        friendshipRepository.delete(friendship);
    }

    public List<Friendship> getUserFriends() {
        User user = getCurrentUser();
        return friendshipRepository.findByUserAndStatus(user, "accepted");
    }

    public List<Friendship> getPendingRequests() {
        User user = getCurrentUser();
        return friendshipRepository.findByAddresseeAndStatus(user, "pending");
    }
}
