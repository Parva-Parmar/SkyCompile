package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type FileTreeNode struct {
	Name     string          `json:"name"`
	Type     string          `json:"type"`
	Children []*FileTreeNode `json:"children,omitempty"`
}

type ProjectPermission struct {
	CanCreateFiles bool `json:"canCreateFiles"`
	CanDeleteFiles bool `json:"canDeleteFiles"`
	CanEditFiles   bool `json:"canEditFiles"`
}

func getProjectRoot(userId, projectId string) string {
	return filepath.Join("/app/skycompiler_projects", userId, projectId)
}

// Check if user has permission to perform action on project
func checkProjectPermission(r *http.Request, userId, projectId, action string) (bool, error) {
	fmt.Printf("DEBUG: checkProjectPermission called with userId=%s, projectId=%s, action=%s\n", userId, projectId, action)
	
	// Call Spring Boot API to check user permissions
	url := fmt.Sprintf("http://localhost:8081/api/v1/projects/%s/permissions?action=%s", projectId, action)
	fmt.Printf("DEBUG: Calling permission API at URL: %s\n", url)
	
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return false, err
	}
	
	// Forward the user's token from the original request
	authHeader := r.Header.Get("Authorization")
	if authHeader != "" {
		req.Header.Set("Authorization", authHeader)
	}
	req.Header.Set("X-User-ID", userId)
	fmt.Printf("DEBUG: Setting headers - Authorization: %s, X-User-ID: %s\n", authHeader, userId)
	
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("DEBUG: API call failed: %v\n", err)
		// Fall back to direct check if API call fails
		return checkProjectPermissionDirect(userId, projectId, action)
	}
	defer resp.Body.Close()
	
	fmt.Printf("DEBUG: API response status: %d\n", resp.StatusCode)
	if resp.StatusCode != http.StatusOK {
		fmt.Printf("DEBUG: API call returned non-200 status, falling back to direct check\n")
		// Fall back to direct check if API call fails
		return checkProjectPermissionDirect(userId, projectId, action)
	}
	
	var permission ProjectPermission
	if err := json.NewDecoder(resp.Body).Decode(&permission); err != nil {
		fmt.Printf("DEBUG: JSON decode failed: %v\n", err)
		// Fall back to direct check if JSON parsing fails
		return checkProjectPermissionDirect(userId, projectId, action)
	}
	
	fmt.Printf("DEBUG: Parsed permission: %+v\n", permission)
	switch action {
	case "create":
		return permission.CanCreateFiles, nil
	case "delete":
		return permission.CanDeleteFiles, nil
	case "edit":
		return permission.CanEditFiles, nil
	default:
		return false, fmt.Errorf("unknown action: %s", action)
	}
}

// Direct database check as fallback
func checkProjectPermissionDirect(userId, projectId, action string) (bool, error) {
	// For now, implement basic permission logic
	// In a real implementation, this would query the database directly
	
	// Check if user is the project owner (project directory ownership)
	projectRoot := getProjectRoot(userId, projectId)
	
	stat, err := os.Stat(projectRoot)
	if err == nil {
		// If the project directory exists with the user's ID as parent, they're likely the owner
		if stat.IsDir() {
			// For simplicity, allow all actions for now
			// TODO: Implement proper role-based permission checking
			return true, nil
		}
	}
	
	// If directory doesn't exist, allow creation (for new projects)
	if os.IsNotExist(err) && action == "create" {
		return true, nil
	}
	
	return false, fmt.Errorf("access denied")
}

func buildFileTree(dir string) ([]*FileTreeNode, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return []*FileTreeNode{}, nil // return empty if missing
		}
		return nil, err
	}

	var tree []*FileTreeNode
	for _, entry := range entries {
		node := &FileTreeNode{
			Name: entry.Name(),
		}
		if entry.IsDir() {
			node.Type = "folder"
			children, err := buildFileTree(filepath.Join(dir, entry.Name()))
			if err == nil {
				node.Children = children
			}
		} else {
			node.Type = "file"
		}
		tree = append(tree, node)
	}

	if tree == nil {
		return []*FileTreeNode{}, nil
	}
	return tree, nil
}

// Router hook
func handleFileApi(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value(userIDKey).(string)

	// Route structure: /api/v1/projects/{projectId}/files* or folders*
	pathParams := strings.TrimPrefix(r.URL.Path, "/api/v1/projects/")
	segments := strings.SplitN(pathParams, "/", 3)
	if len(segments) < 2 {
		http.Error(w, "Invalid route", http.StatusBadRequest)
		return
	}

	projectId := segments[0]
	action := segments[1] // "files" or "folders"
	projectRoot := getProjectRoot(userId, projectId)

	// Ensure the root directory actually exists for new projects securely
	os.MkdirAll(projectRoot, 0755)

	if action == "files" {
		if len(segments) == 2 {
			// exact /files match
			if r.Method == http.MethodGet {
				// GET /projects/:id/files -> Return tree
				tree, err := buildFileTree(projectRoot)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				json.NewEncoder(w).Encode(tree)
				return
			}

			if r.Method == http.MethodPost {
				// POST /projects/:id/files -> Create File
				var body map[string]string
				json.NewDecoder(r.Body).Decode(&body)
				
				// Check permission
				canCreate, err := checkProjectPermission(r, userId, projectId, "create")
				if err != nil || !canCreate {
					http.Error(w, "Permission denied: Cannot create files", http.StatusForbidden)
					return
				}
				
				targetPath := filepath.Join(projectRoot, body["path"])
				if !strings.HasPrefix(targetPath, projectRoot) {
					http.Error(w, "Access Denied", http.StatusForbidden)
					return
				}
				os.MkdirAll(filepath.Dir(targetPath), 0755)
				os.WriteFile(targetPath, []byte(""), 0644)
				json.NewEncoder(w).Encode(map[string]bool{"success": true})
				return
			}

			if r.Method == http.MethodDelete {
				// DELETE /projects/:id/files -> Delete
				var body map[string]string
				json.NewDecoder(r.Body).Decode(&body)
				
				// Check permission
				canDelete, err := checkProjectPermission(r, userId, projectId, "delete")
				if err != nil || !canDelete {
					http.Error(w, "Permission denied: Cannot delete files", http.StatusForbidden)
					return
				}
				
				targetPath := filepath.Join(projectRoot, body["path"])
				if !strings.HasPrefix(targetPath, projectRoot) {
					http.Error(w, "Access Denied", http.StatusForbidden)
					return
				}
				os.RemoveAll(targetPath)
				json.NewEncoder(w).Encode(map[string]bool{"success": true})
				return
			}
		} else if len(segments) == 3 {
			subAction := segments[2]
			if subAction == "content" {
				if r.Method == http.MethodGet {
					// GET /content?path=X
					filePath := filepath.Join(projectRoot, r.URL.Query().Get("path"))
					if !strings.HasPrefix(filePath, projectRoot) {
						http.Error(w, "Access Denied", http.StatusForbidden)
						return
					}
					data, _ := os.ReadFile(filePath)
					json.NewEncoder(w).Encode(map[string]string{"content": string(data)})
					return
				}
				if r.Method == http.MethodPut {
					// PUT /content to save code natively
					var body map[string]string
					json.NewDecoder(r.Body).Decode(&body)
					
					// Check permission
					canEdit, err := checkProjectPermission(r, userId, projectId, "edit")
					if err != nil || !canEdit {
						http.Error(w, "Permission denied: Cannot edit files", http.StatusForbidden)
						return
					}
					
					targetPath := filepath.Join(projectRoot, body["path"])
					if !strings.HasPrefix(targetPath, projectRoot) {
						http.Error(w, "Access Denied", http.StatusForbidden)
						return
					}
					os.MkdirAll(filepath.Dir(targetPath), 0755)
					os.WriteFile(targetPath, []byte(body["content"]), 0644)
					json.NewEncoder(w).Encode(map[string]bool{"success": true})
					return
				}
			}

			if subAction == "rename" && r.Method == http.MethodPut {
				// PUT /rename
				var body map[string]string
				json.NewDecoder(r.Body).Decode(&body)
				oldPath := filepath.Join(projectRoot, body["oldPath"])
				newPath := filepath.Join(projectRoot, body["newPath"])

				if !strings.HasPrefix(oldPath, projectRoot) || !strings.HasPrefix(newPath, projectRoot) {
					http.Error(w, "Access Denied", http.StatusForbidden)
					return
				}
				os.MkdirAll(filepath.Dir(newPath), 0755)
				os.Rename(oldPath, newPath)
				json.NewEncoder(w).Encode(map[string]bool{"success": true})
				return
			}
		}
	} else if action == "folders" && r.Method == http.MethodPost {
		var body map[string]string
		json.NewDecoder(r.Body).Decode(&body)
		
		// Check permission
		canCreate, err := checkProjectPermission(r, userId, projectId, "create")
		if err != nil || !canCreate {
			http.Error(w, "Permission denied: Cannot create folders", http.StatusForbidden)
			return
		}
		
		targetPath := filepath.Join(projectRoot, body["path"])
		if !strings.HasPrefix(targetPath, projectRoot) {
			http.Error(w, "Access Denied", http.StatusForbidden)
			return
		}
		os.MkdirAll(targetPath, 0755)
		json.NewEncoder(w).Encode(map[string]bool{"success": true})
		return
	}

	http.Error(w, "Endpoint Not Found", http.StatusNotFound)
}
