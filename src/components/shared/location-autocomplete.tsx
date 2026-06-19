"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { MapPin, ChevronDown, X } from "lucide-react";
import {
  searchKsaLocations,
  type KsaLocation,
  LOCATION_TYPE_LABEL,
  LOCATION_TYPE_ICON,
} from "@/lib/ksa-locations";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  placeholder: string;
  value: KsaLocation | null;
  onChange: (loc: KsaLocation | null) => void;
  /** Exclude this location from results (e.g. when it's already the other field's value) */
  excludeId?: string;
  /** Icon to show in the field */
  icon?: "from" | "to" | "location";
  autoFocus?: boolean;
  id?: string;
  /** Dark variant for use over dark backgrounds (glass effect) */
  isDark?: boolean;
}

export function LocationAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  excludeId,
  icon = "from",
  autoFocus,
  id,
  isDark = false,
}: Props) {
  // `query` is the user's in-progress typing. When the field has a committed
  // `value`, we display the value's name. When the user types, we show `query`.
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Display logic: prefer the user's in-progress typing; fall back to the
  // committed value's name; otherwise empty.
  const displayValue = query || (value ? value.name : "");

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!value) setQuery("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [value]);

  const results = useMemo(() => {
    const effectiveQuery = query || (value ? value.name : "");
    if (!effectiveQuery.trim() || (value && effectiveQuery === value.name)) {
      return searchKsaLocations("", 8).filter((l) => l.id !== excludeId);
    }
    return searchKsaLocations(effectiveQuery, 8).filter((l) => l.id !== excludeId);
  }, [query, value, excludeId]);

  const selectLocation = (loc: KsaLocation) => {
    onChange(loc);
    setQuery("");
    setOpen(false);
    setHighlighted(0);
  };

  const clearSelection = () => {
    onChange(null);
    setQuery("");
    setOpen(true);
    // Defer focus to next tick so the input is interactive
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && results[highlighted]) {
        e.preventDefault();
        selectLocation(results[highlighted]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        htmlFor={id}
        className={cn(
          "block text-[10px] font-semibold tracking-[0.22em] uppercase mb-1.5",
          isDark ? "text-[#f6f1e9]/55" : "text-foreground/55",
        )}
      >
        {label}
      </label>

      <div
        className={cn(
          "relative flex items-center rounded-xl h-14 px-4 transition-all duration-300 backdrop-blur-sm border",
          open
            ? isDark
              ? "border-[#b08842] bg-[#0f0c08]/40 shadow-[0_0_0_3px_rgba(176,136,66,0.15)]"
              : "border-[#b08842] bg-cream/80 shadow-[0_0_0_3px_rgba(176,136,66,0.10)]"
            : isDark
              ? "bg-[#0f0c08]/40 border-[#d4b876]/15 hover:border-[#d4b876]/40"
              : "bg-cream/80 border-foreground/[0.12] hover:border-foreground/30",
        )}
      >
        {/* Icon */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 flex items-center justify-center mr-3",
          isDark ? "text-[#d4b876]/70" : "text-foreground/55",
        )}>
          <MapPin size={18} strokeWidth={1.5} className={icon === "to" ? "text-[#b08842]" : ""} />
        </div>

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={displayValue}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            onChange(null);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-1 min-w-0 bg-transparent text-[14px] focus:outline-none font-medium placeholder:text-foreground/40",
            isDark ? "text-[#f6f1e9] placeholder:text-[#f6f1e9]/40" : "text-foreground",
          )}
          autoComplete="off"
          aria-label={label}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
        />

        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={clearSelection}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.06] rounded-full transition-colors"
            aria-label="Clear selection"
          >
            <X size={13} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-2 bg-cream border border-foreground/[0.12] rounded-sm shadow-[0_20px_50px_-15px_rgba(26,22,18,0.3)] overflow-hidden max-h-[320px] overflow-y-auto"
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12px] text-foreground/50">
              No KSA locations match &quot;{displayValue}&quot;
            </div>
          ) : (
            results.map((loc, i) => (
              <button
                key={loc.id}
                type="button"
                role="option"
                aria-selected={i === highlighted}
                onClick={() => selectLocation(loc)}
                onMouseEnter={() => setHighlighted(i)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 border-b border-foreground/[0.04] last:border-b-0",
                  i === highlighted
                    ? "bg-[#b08842]/[0.08]"
                    : "hover:bg-foreground/[0.03]",
                )}
              >
                <span className="flex-shrink-0 text-[16px]">
                  {LOCATION_TYPE_ICON[loc.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-foreground truncate">
                    {loc.name}
                  </div>
                  <div className="text-[10px] text-foreground/50 truncate mt-0.5">
                    {LOCATION_TYPE_LABEL[loc.type]} · {loc.region}
                    {loc.hint && ` · ${loc.hint}`}
                  </div>
                </div>
                {loc.code && (
                  <span className="flex-shrink-0 px-2 py-0.5 bg-foreground/[0.06] rounded-sm text-[10px] font-bold tracking-[0.1em] text-foreground/65">
                    {loc.code}
                  </span>
                )}
              </button>
            ))
          )}
          <div className="px-4 py-2 bg-foreground/[0.02] border-t border-foreground/[0.06] text-[10px] tracking-[0.18em] uppercase text-foreground/45 font-semibold">
            Saudi Arabia only · {results.length} {results.length === 1 ? "match" : "matches"}
          </div>
        </div>
      )}
    </div>
  );
}
