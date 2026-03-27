import { useState, useEffect, useRef } from "react";
import { Search, X, User } from "lucide-react";
import { searchUsers } from "../../api/projects";
import type { UserSuggestion } from "../../api/projects";

interface EmailAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  excludeEmails?: string[]; // Emails to exclude from suggestions
}

export default function EmailAutocompleteInput({
  value,
  onChange,
  placeholder = "Enter email address",
  disabled = false,
  excludeEmails = [],
}: EmailAutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when input changes
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const results = await searchUsers(value);
        // Filter out excluded emails
        const filtered = results.filter(user => !excludeEmails.includes(user.email));
        setSuggestions(filtered);
        setIsOpen(filtered.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Failed to fetch user suggestions:", error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [value, excludeEmails]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: UserSuggestion) => {
    onChange(suggestion.email);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const clearInput = () => {
    onChange("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {loading ? (
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
        
        {value && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => selectSuggestion(suggestion)}
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {suggestion.firstname} {suggestion.lastname}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {suggestion.email}
                </div>
              </div>
            </div>
          ))}
          
          {suggestions.length === 0 && value.length >= 2 && !loading && (
            <div className="px-3 py-2 text-gray-400 text-sm">
              No users found for "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
