package main

import (
	"encoding/json"
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

func getProjectRoot(userId, projectId string) string {
	return filepath.Join("/app/skycompiler_projects", userId, projectId)
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
