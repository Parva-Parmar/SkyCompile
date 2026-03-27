# SkyCompile Collaboration Guide

## Overview
SkyCompile provides real-time collaboration capabilities allowing multiple users to work together on the same project simultaneously.

## Features

### ✅ **Implemented Features**

#### 1. **Project Member Management**
- Add collaborators by email address
- Assign roles: Owner, Editor, Viewer
- Remove collaborators
- Permission-based access control

#### 2. **Real-time Collaboration Infrastructure**
- WebSocket-based real-time synchronization
- Conflict-free editing using CRDT (Yjs)
- Live cursor tracking
- Automatic document persistence

#### 3. **User Interface**
- Collaborator management panel
- Member list with role indicators
- Add/remove collaborators interface
- Integration with friends system

## How to Use

### Adding Collaborators

1. **Open the Project Workspace**
   - Navigate to your project
   - Click "Show Team" in the header

2. **Add New Collaborator**
   - Click the "Add" button in the collaborators panel
   - Enter the collaborator's email address
   - Select their role (Viewer, Editor, or Owner)
   - Click "Add Collaborator"

3. **Quick Add from Friends**
   - Click "Load Friends" to see your friend list
   - Click on any friend to auto-fill their email
   - Adjust the role as needed

### Role Permissions

| Role | Permissions | Description |
|------|-------------|-------------|
| **Owner** | Full control | Can manage members, delete project, edit all files |
| **Editor** | Edit + Add members | Can edit files and invite new collaborators |
| **Viewer** | Read-only | Can view files and comment only |

### Real-time Features

When collaboration is enabled (`VITE_COLLAB_ENABLED=true`):

- **Live Editing**: See changes from other users in real-time
- **Cursor Tracking**: See where other users are editing
- **Conflict Resolution**: Automatic merging of simultaneous edits
- **Document Sync**: Changes persist across sessions

## Technical Implementation

### Backend Architecture

#### Spring Boot Backend
- **ProjectMemberController**: REST API for member management
- **ProjectService**: Business logic for permissions and validation
- **User Management**: Authentication and authorization

#### Go Backend
- **WebSocket Hub**: Real-time message broadcasting
- **Room Management**: Separate collaboration rooms per file
- **Persistence**: Document snapshots saved to disk

### Frontend Components

#### Core Components
- **CollaboratorManager**: Main collaboration interface
- **CollaboratorModal**: Add new collaborators
- **CollaboratorList**: Display and manage existing members
- **CollaboratorButton**: Quick access toggle

#### Integration Points
- **ProjectWorkspace**: Main workspace with collaboration panel
- **WorkspaceLayout**: Layout with optional collaborators sidebar
- **MonacoEditor**: Real-time editing with Yjs integration

## API Endpoints

### Project Members
```
GET    /api/v1/projects/{id}/members     // List members
POST   /api/v1/projects/{id}/members     // Add member
DELETE /api/v1/projects/{id}/members/{userId} // Remove member
```

### Friends System
```
GET    /api/v1/friends                   // List friends
POST   /api/v1/friends/request          // Send friend request
GET    /api/v1/friends/requests         // Get pending requests
POST   /api/v1/friends/accept/{id}      // Accept request
DELETE /api/v1/friends/reject/{id}      // Reject request
```

## Configuration

### Environment Variables
```bash
# Enable real-time collaboration
VITE_COLLAB_ENABLED=true

# Use Spring Boot for authentication
VITE_USE_SPRING_BOOT=true
```

### WebSocket Endpoints
```
ws://localhost:8082/ws/{roomId}          // Real-time collaboration
ws://localhost:8082/terminal            // Terminal sharing
```

## Security Features

### Authentication
- JWT-based authentication
- User validation before adding collaborators
- Secure WebSocket connections

### Authorization
- Role-based access control
- Permission validation for all operations
- Audit logging for member changes

## Troubleshooting

### Common Issues

1. **Collaborators not appearing**
   - Check if user is registered in the system
   - Verify email address is correct
   - Ensure user has accepted any friend requests

2. **Real-time updates not working**
   - Verify `VITE_COLLAB_ENABLED=true`
   - Check WebSocket connection status
   - Ensure backend is running on port 8082

3. **Permission denied errors**
   - Check user role in the project
   - Verify you have permission to add members
   - Contact project owner if needed

### Debug Mode
Enable console logging to debug collaboration issues:
```javascript
// In browser console
localStorage.setItem('debug', 'yjs*');
```

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `ProjectMemberController`
2. **Frontend**: Create new components in `components/workspace/`
3. **API**: Update API functions in `src/api/projects.ts`

### Testing Collaboration

1. Open multiple browser windows with different users
2. Add collaborators to a test project
3. Edit files simultaneously to test real-time sync
4. Verify role permissions work correctly

## Future Enhancements

### Planned Features
- [ ] Video/audio chat integration
- [ ] Screen sharing capabilities
- [ ] Advanced permission settings
- [ ] Project templates with default roles
- [ ] Integration with external auth providers

### Performance Improvements
- [ ] Optimized WebSocket message batching
- [ ] Efficient document delta compression
- [ ] Caching layer for frequently accessed projects

## Support

For issues or questions about collaboration features:
1. Check the browser console for error messages
2. Verify backend services are running
3. Review the configuration settings
4. Test with different user roles and permissions
