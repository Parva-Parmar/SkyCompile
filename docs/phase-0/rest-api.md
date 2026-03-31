# SkyCompile REST API – Phase 0 Documentation

> This document describes the **current** REST APIs exposed by the Node.js backend.
> No behavior changes were introduced while creating this documentation.

---

## Conventions

- Base URL: `/api/v1`
- Authentication: JWT (Bearer Token)
- Content-Type: `application/json`
- Auth Middleware: `authMiddleware`

---

## Health / Landing

### GET `/api/v1/landing`

**Auth:** ❌  

**Description:** Backend connectivity & health check.

**Response**

```json
{
  "appName": "SkyCompile",
  "tagline": "Collaborative project builder",
  "status": "Backend connected successfully 🚀"
}
```

## Authentication

### POST `/api/v1/auth/signup`

**Auth:** ❌  

**Description:** Register a new user.

**middleware** signupValidator

**Request**

```json
{
  "email": "string",
  "username": "string",
  "password": "string"
}
```

**Response**

```json
{
  "message": "User created successfully",
  "user": {}
}
```

### POST `/api/v1/auth/signin`

**Auth:** ❌  

**Description:** Authenticate user and issue JWT.

**middleware** signinValidator

**Request**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response**

```json
{
  "token": "jwt-string",
  "user": {}
}
```

## Users

### GET `/api/v1/users/me`

**Auth:** ✅

**Description:** Get the currently authenticated user profile

**Headers** `Authorization: Bearer <jwt>`

**Response**

```json
{
  "id": "string",
  "email": "string",
  "username": "string"
}
```

## Projects

### GET `/api/v1/projects`

**Auth:** ✅

**Description:** List all projects owned by the authenticated user.

**Headers** `Authorization: Bearer <jwt>`

**Response**

```json
[
  {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
]
```

### POST `/api/v1/projects`

**Auth:** ✅

**Description:** Create a new project.

**Request**

```json
{
  "name": "string"
}
```

**Response**

```json
{
  "id": "string",
  "name": "string",
  "ownerId": "string"
}
```

### DELETE `/api/v1/projects/:id`

**Auth:** ✅

**Description:** : Delete a project by ID.

**Path Params** :
| Name | Type |
| ---- | ------ |
| id | string |

**Response**

```json
{
  "message": "Project deleted successfully"
}
```

## Friends

### POST `/api/v1/friends/request`

**Auth:** ✅

**Description:**: Send a friend request using email.

**Request**

```json
{
  "email": "string"
}
```

### GET `/api/v1/friends/requests`

**Auth:** ✅

**Description:**: List incoming friend requests.

```json
[
  {
    "id": "string",
    "sender": {}
  }
]
```

### POST `/api/v1/friends/accept/:id`

**Auth:** ✅
**Description:**: Accept a friend request.
**Path Params**:
| Name | Type |
| ---- | ------ |
| id | string |

### DELETE `/api/v1/friends/reject/:id`

**Auth:** ✅
**Description:**: Reject a friend request.
**Path Params**:
| Name | Type |
| ---- | ------ |
| id | string |

### GET `/api/v1/friends`

**Auth:** ✅
**Description:**: List all friends.

**Response**

```json
[
  {
    "id": "string",
    "username": "string"
  }
]
```

### DELETE `/api/v1/friends/:id`

**Auth:** ✅
**Description:**: Remove a friend.
**Path Params**:
| Name | Type |
| ---- | ------ |
| id | string |

## Files & Workspace (Filesystem-backed)

### ⚠️ All endpoints below are filesystem-coupled and migration-sensitive. All routes require authentication.


### GET `/api/v1/projects/:projectId/files`

**Auth:** ✅
**Description:** Get project file tree.
**Response**
```json
{
  "name": "root",
  "type": "folder",
  "children": [ ]
}
```

### GET `/api/v1/projects/:projectId/files/content`

**Auth:** ✅
**Description:**: Read file content.
**Query Params**:
| Name | Type   |
| ---- | ------ |
| path | string |
**Response**
```json
{
  "content": "string"
}
```

### PUT `/api/v1/projects/:projectId/files/content`

**Auth:** ✅
**Description:**: Save file content.
**Request**
```json
{
  "path": "string",
  "content": "string"
}
```

### POST `/api/v1/projects/:projectId/files`

**Auth:** ✅
**Description:**: Create a new file.
**Request**
```json
{
  "path": "string"
}
```

### POST `/api/v1/projects/:projectId/folders`

**Auth:** ✅
**Description:**: Create a new folder.
**Request**
```json
{
  "path": "string"
}
```

### DELETE `/api/v1/projects/:projectId/files`

**Auth:** ✅
**Description:**: Delete file or folder.
**Request**
```json
{
  "path": "string"
}
```

### PUT `/api/v1/projects/:projectId/files/rename`

**Auth:** ✅
**Description:**: Rename file or folder.
**Request**
```json
{
  "oldPath": "string",
  "newPath": "string"
}
```


| Area                  | Risk        |
| --------------------- | ----------- |
| Auth                  | 🔴 Critical |
| Projects              | 🟡 Medium   |
| Friends               | 🟡 Medium   |
| Filesystem APIs       | 🔴 High     |
| WebSockets / Terminal | 🔴 High     |
