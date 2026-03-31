# SkyCompile - Development Setup

## 🚀 Quick Start

```bash
# Clean start all services
docker-compose down

# Build and start all services  
docker-compose build --no-cache && docker-compose up -d
```

## 📋 Services Overview

| Service | Port | Description |
|----------|-------|-------------|
| Frontend | 5173 | React development server |
| Spring Boot | 8081 | Java backend with JWT auth |
| Go Backend | 8082 | File operations & collaboration |
| PostgreSQL | 5432 | Database |

## 🧪 User Management

### ✅ **Fixed Issues**
- **Name Display**: Welcome message and profile now show proper first/last names
- **Profile Counts**: Projects and friends counts are accurate
- **File Sharing**: Projects properly shared between users with permissions
- **Permission System**: Collaborator access control working

### 🔐 **Test Users**
- `malharpatel@gmail.com` / `password123` - Main test user
- `divyapatel@example.com` / `password123` - Friend test user  
- Create new users via signup endpoint

## 🛠️ Development Notes

- **Single Database**: Uses `skycompile_db` for all testing
- **Docker Volumes**: Files stored in `./skycompiler_projects/`
- **JWT Secret**: Shared between Spring Boot and Go backends
- **Health Checks**: All services have health monitoring

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User login
- `GET /api/v1/users/me` - Current user profile with counts

### Projects  
- `GET /api/v1/projects` - User's projects
- `POST /api/v1/projects` - Create new project
- `DELETE /api/v1/projects/{id}` - Delete project

### Files (Go Backend)
- `GET /api/v1/projects/{id}/files` - List project files
- `POST /api/v1/projects/{id}/files` - Create file
- `PUT /api/v1/projects/{id}/files/content` - Update file content
- `DELETE /api/v1/projects/{id}/files` - Delete file

### Permissions
- `GET /api/v1/projects/{id}/permissions?action={action}` - Check user permissions

---

**All major frontend-backend integration issues have been resolved!** 🎉
