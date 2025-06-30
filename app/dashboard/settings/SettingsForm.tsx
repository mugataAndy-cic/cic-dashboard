"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "sw", label: "Swahili", flag: "🇰🇪" },
];
const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];
const frequencies = [
  { value: "immediate", label: "Immediate" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];



export default function SettingsForm() {
  // State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState("immediate");
  const [theme, setTheme] = useState("system");
  const [themePreview, setThemePreview] = useState("system");
  const [language, setLanguage] = useState("en");
  const [accountDeleteConfirm, setAccountDeleteConfirm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle");

  // Track changes for disabling Save if unchanged
  const [initial, setInitial] = useState<any>(null);
  useEffect(() => {
    setInitial({
      emailNotifications,
      smsNotifications,
      pushNotifications,
      notificationFrequency,
      theme,
      language,
      selectedDate,
    });
    // eslint-disable-next-line
  }, []);
  const hasChanged =
    initial &&
    (emailNotifications !== initial.emailNotifications ||
      smsNotifications !== initial.smsNotifications ||
      pushNotifications !== initial.pushNotifications ||
      notificationFrequency !== initial.notificationFrequency ||
      theme !== initial.theme ||
      language !== initial.language ||
      selectedDate !== initial.selectedDate);

  // Live theme preview
  useEffect(() => {
    setThemePreview(theme);
    // Optionally, apply theme to document body or preview area
  }, [theme]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("success");
      setInitial({
        emailNotifications,
        smsNotifications,
        pushNotifications,
        notificationFrequency,
        theme,
        language,
        selectedDate,
      });
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  }

  function handleDeleteAccount() {
    if (accountDeleteConfirm.toLowerCase() === "delete") {
      alert("Account deleted (mock)");
      setAccountDeleteConfirm("");
    } else {
      alert("Type 'delete' to confirm account deletion.");
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Settings Form" className="space-y-8">
      {/* Notification Section */}
      <section aria-labelledby="notifications-header" className="bg-white rounded-lg shadow p-6">
        <h2 id="notifications-header" className="text-lg font-semibold mb-2">Notification Preferences</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2" htmlFor="email-notify">
            <input
              id="email-notify"
              type="checkbox"
              checked={emailNotifications}
              onChange={e => setEmailNotifications(e.target.checked)}
              className="mr-1"
              
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-2" htmlFor="sms-notify">
            <input
              id="sms-notify"
              type="checkbox"
              checked={smsNotifications}
              onChange={e => setSmsNotifications(e.target.checked)}
              className="mr-1"
              
            />
            SMS Notifications
          </label>
          <label className="flex items-center gap-2" htmlFor="push-notify">
            <input
              id="push-notify"
              type="checkbox"
              checked={pushNotifications}
              onChange={e => setPushNotifications(e.target.checked)}
              className="mr-1"
              
            />
            Push Notifications
          </label>
          <div className="mt-2">
            <label className="block mb-1 text-sm font-medium" htmlFor="notify-frequency">Notification Frequency</label>
            <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
              <SelectTrigger id="notify-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map(f => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      {/* Theme Section */}
      <section aria-labelledby="theme-header" className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:gap-8">
        <div className="flex-1">
          <h2 id="theme-header" className="text-lg font-semibold mb-2">Theme</h2>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger aria-label="Theme selector">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {themes.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 mt-4 md:mt-0">
          <div className="rounded border p-3 flex flex-col items-center bg-gray-50">
            <span className="text-xs mb-2">Live Theme Preview</span>
            <div
              className={`w-32 h-20 rounded ${themePreview === "dark" ? "bg-gray-800" : themePreview === "light" ? "bg-white border" : "bg-gradient-to-r from-gray-200 to-gray-700"}`}
            />
            <span className="mt-2 text-xs">{themes.find(t => t.value === themePreview)?.label ?? "System"}</span>
          </div>
        </div>
      </section>
      {/* Language Section */}
      <section aria-labelledby="language-header" className="bg-white rounded-lg shadow p-6">
        <h2 id="language-header" className="text-lg font-semibold mb-2">Language</h2>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger aria-label="Language selector">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="mr-2" role="img" aria-label={lang.label + " flag"}>{lang.flag}</span>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
      {/* Date Preferences Section */}
      <section aria-labelledby="date-header" className="bg-white rounded-lg shadow p-6">
        <h2 id="date-header" className="text-lg font-semibold mb-2">Reminder Date</h2>
        <Calendar selected={selectedDate} onSelect={setSelectedDate} />
        <span className="block mt-2 text-xs text-gray-500">Choose a date for reminders or recurring events.</span>
      </section>
      {/* Danger Zone Section */}
      <section aria-labelledby="danger-header" className="bg-white rounded-lg shadow p-6">
        <h2 id="danger-header" className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h2>
        <label className="block mb-2 text-sm" htmlFor="account-delete-input">Type <span className="font-bold">delete</span> to confirm account deletion</label>
        <div className="flex gap-2">
          <Input
            id="account-delete-input"
            value={accountDeleteConfirm}
            onChange={e => setAccountDeleteConfirm(e.target.value)}
            placeholder="Type 'delete'"
            className="w-40"
            aria-label="Confirm account deletion"
          />
          <Button type="button" variant="destructive" onClick={handleDeleteAccount} aria-label="Delete Account">
            Delete Account
          </Button>
        </div>
      </section>
      {/* Save Status Feedback */}
      <div className="flex items-center gap-4">
        <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={!hasChanged || saveStatus === "saving"} aria-disabled={!hasChanged || saveStatus === "saving"} aria-label="Save Settings">
          {saveStatus === "saving" ? "Saving..." : "Save Settings"}
        </Button>
        {saveStatus === "success" && <span className="text-green-600 text-sm">Settings saved!</span>}
      </div>
    </form>
  );
}
