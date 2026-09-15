import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { IconUser, IconLock, IconLogOut, IconMail, IconChevronDown } from "./Icons";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfileMenu() {
  const { name, email, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const menuRef = useRef(null);

  const initial = (name || email || "?").charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-menu-wrapper" ref={menuRef}>
      <button className="profile-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="profile-avatar">{initial}</span>
        <span className="profile-name">{name || email}</span>
        <IconChevronDown width={16} height={16} />
      </button>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <div className="profile-avatar profile-avatar-lg">{initial}</div>
            <div>
              <div className="profile-dropdown-name">{name || "Admin"}</div>
              <div className="profile-dropdown-email">
                <IconMail width={13} height={13} /> {email}
              </div>
            </div>
          </div>

          <div className="profile-dropdown-divider" />

          <button
            className="profile-dropdown-item"
            onClick={() => {
              setShowChangePassword(true);
              setOpen(false);
            }}
          >
            <IconLock width={16} height={16} /> Change Password
          </button>

          <button
            className="profile-dropdown-item profile-dropdown-item-danger"
            onClick={logout}
          >
            <IconLogOut width={16} height={16} /> Logout
          </button>
        </div>
      )}

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
} 