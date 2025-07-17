import "./Dropdown.css";
import React, { useState, useRef, useEffect } from 'react';

function Dropdown({ data = [], selectedId, onSelect, label = "Selecciona" }) {
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = data.find((item) => item.id === selectedId);
  const isActive = isFocused || selected;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`cam country ${isActive ? 'filled focused' : ''}`} ref={wrapperRef}>
      <label htmlFor="custom-dropdown">{label}</label>

      <div
        className="custom-dropdown"
        id="custom-dropdown"
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onClick={() => setDropdownOpen((open) => !open)}
      >
        <div className="selected-option" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selected && <img src={selected.flag} alt={selected.name} width={20} />}
          <span>{selected ? selected.name : ""}</span>
        </div>

        {dropdownOpen && (
          <div className="dropdown-list">
            {data.map((item) => (
              <div
                key={item.id}
                className="dropdown-item"
                onMouseDown={(e) => {
                  e.preventDefault(); // evitar blur antes del click
                  onSelect(item.id);
                  setDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                }}
              >
                <img src={item.flag} alt={item.name} width={20} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
