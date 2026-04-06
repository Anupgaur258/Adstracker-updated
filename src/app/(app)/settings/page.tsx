"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore, saveProfileImage, loadProfileImage } from "@/stores/auth-store";
import { useHydration } from "@/hooks/use-hydration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import { Camera, Eye, EyeOff, AlertCircle } from "lucide-react";

interface FieldErrors {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function SettingsPage() {
  const { user, updateProfile, changePassword } = useAuthStore();
  const hydrated = useHydration();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hydrated && user) {
      setName(user.name);
      setEmail(user.email);
      if (user.avatar) setAvatarUrl(user.avatar);
    }
  }, [hydrated, user]);

  // Load avatar from IndexedDB on mount
  useEffect(() => {
    loadProfileImage().then((img) => {
      if (img) setAvatarUrl(img);
    }).catch(() => {});
  }, []);

  if (!hydrated) {
    return <div className="glass-card h-96 animate-pulse" />;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarUrl(dataUrl);
      try {
        await saveProfileImage(dataUrl);
        updateProfile({ avatar: dataUrl });
        toast.success("Profile image updated");
      } catch {
        toast.error("Failed to save profile image");
      }
    };
    reader.readAsDataURL(file);
  };

  const validateProfile = (): boolean => {
    const errors: FieldErrors = {};
    let valid = true;

    if (!name.trim()) {
      errors.name = "Name is required";
      valid = false;
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
      valid = false;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
      valid = false;
    }

    setFieldErrors((prev) => ({ ...prev, ...errors, ...(valid ? { name: undefined, email: undefined } : {}) }));

    if (!valid) {
      toast.error("Please fix the errors below");
    }
    return valid;
  };

  const handleSaveProfile = () => {
    if (!validateProfile()) return;
    updateProfile({ name: name.trim(), email: email.trim() });
    toast.success("Profile updated successfully");
  };

  const validatePassword = (): boolean => {
    const errors: FieldErrors = {};
    let valid = true;

    if (!currentPassword) {
      errors.currentPassword = "Current password is required";
      valid = false;
    }

    if (!newPassword) {
      errors.newPassword = "New password is required";
      valid = false;
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
      valid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.newPassword = "Must include uppercase, lowercase, and number";
      valid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
      valid = false;
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setFieldErrors((prev) => ({
      ...prev,
      ...errors,
      ...(valid ? { currentPassword: undefined, newPassword: undefined, confirmPassword: undefined } : {}),
    }));

    if (!valid) {
      toast.error("Please fix the password errors below");
    }
    return valid;
  };

  const handleChangePassword = () => {
    if (!validatePassword()) return;

    const result = changePassword(currentPassword, newPassword);
    if (result.success) {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});
    } else {
      toast.error(result.error || "Failed to change password");
    }
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-1 sm:px-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile Image Section */}
      <div className="glass-card p-4 sm:p-6">
        <h2 className="font-semibold text-white mb-4">Profile Photo</h2>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative group">
            <Avatar className="h-20 w-20 border-2 border-white/10">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="Profile" />
              ) : null}
              <AvatarFallback className="bg-brand-purple/20 text-brand-purple text-2xl">
                {user?.name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="h-5 w-5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 bg-white/5 border-white/10 hover:bg-white/10 text-xs"
            >
              Change Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="glass-card p-4 sm:p-6 space-y-6">
        <h2 className="font-semibold text-white">Personal Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              className={`bg-white/5 border-white/10 ${fieldErrors.name ? "border-red-500/50" : ""}`}
              placeholder="Your name"
            />
            {fieldErrors.name && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              className={`bg-white/5 border-white/10 ${fieldErrors.email ? "border-red-500/50" : ""}`}
              placeholder="your@email.com"
            />
            {fieldErrors.email && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveProfile}
            className="gradient-bg text-white border-0 hover:opacity-90"
          >
            Save Profile
          </Button>
        </div>
      </div>

      {/* Password Section */}
      <div className="glass-card p-4 sm:p-6 space-y-6">
        <h2 className="font-semibold text-white">Change Password</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  clearFieldError("currentPassword");
                }}
                placeholder="Enter current password"
                className={`bg-white/5 border-white/10 pr-10 ${fieldErrors.currentPassword ? "border-red-500/50" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.currentPassword && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.currentPassword}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearFieldError("newPassword");
                  }}
                  placeholder="New password"
                  className={`bg-white/5 border-white/10 pr-10 ${fieldErrors.newPassword ? "border-red-500/50" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.newPassword && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.newPassword}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearFieldError("confirmPassword");
                  }}
                  placeholder="Confirm password"
                  className={`bg-white/5 border-white/10 pr-10 ${fieldErrors.confirmPassword ? "border-red-500/50" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleChangePassword}
            className="gradient-bg text-white border-0 hover:opacity-90"
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
