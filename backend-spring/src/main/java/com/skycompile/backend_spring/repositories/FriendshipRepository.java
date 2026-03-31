package com.skycompile.backend_spring.repositories;

import com.skycompile.backend_spring.entities.Friendship;
import com.skycompile.backend_spring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {
    
    // Find friendships where the user is either the requester or the addressee
    @Query("SELECT f FROM Friendship f WHERE f.requester = :user OR f.addressee = :user")
    List<Friendship> findByUser(@Param("user") User user);
    
    // Find all accepted friends of a user
    @Query("SELECT f FROM Friendship f WHERE (f.requester = :user OR f.addressee = :user) AND f.status = :status")
    List<Friendship> findByUserAndStatus(@Param("user") User user, @Param("status") String status);

    // Find pending friend requests received by a user
    List<Friendship> findByAddresseeAndStatus(User addressee, String status);

    // Find a specific friendship link between two users
    @Query("SELECT f FROM Friendship f WHERE (f.requester = :user1 AND f.addressee = :user2) OR (f.requester = :user2 AND f.addressee = :user1)")
    Optional<Friendship> findFriendshipBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);
}
