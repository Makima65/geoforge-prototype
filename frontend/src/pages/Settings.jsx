import React, { useEffect, useRef, useState } from 'react';
import { FiCamera, FiCheckCircle, FiMoon, FiSmartphone, FiSun, FiUser } from 'react-icons/fi';
import { useTheme } from '../components/ThemeProvider';
import pkg from '../../package.json';

const themeOptions = [
  { value: 'light', label: 'Light', icon: FiSun },
  { value: 'dark', label: 'Dark', icon: FiMoon },
  { value: 'system', label: 'System', icon: FiSmartphone },
];

export default function Settings() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const mountedRef = useRef(false);

  useEffect(() => {
    const storedName = localStorage.getItem('bomoProfileName') || '';
    const storedImage = localStorage.getItem('bomoProfileImage') || '';

    setDisplayName(storedName);
    setProfileImage(storedImage);
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    localStorage.setItem('bomoProfileName', displayName);
    setStatusMessage('Display name saved');
  }, [displayName]);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      setProfileImage(imageUrl);
      localStorage.setItem('bomoProfileImage', imageUrl);
      setStatusMessage('Profile image updated');
      window.setTimeout(() => setStatusMessage(''), 1800);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-page text-primary px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Settings</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Workspace preferences</h1>
          <p className="max-w-2xl text-sm sm:text-base text-muted">One screen only. Manage your profile, choose appearance, and learn about BOMO without extra navigation.</p>
        </div>

        <section className="rounded-3xl border border-default bg-surface p-6 shadow-default">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Profile</h2>
              <p className="text-sm text-muted">Update your display name and profile image with instant preview.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-default bg-accent-soft px-4 py-2 text-sm text-accent">
              <FiCheckCircle className="h-4 w-4" />
              Changes save instantly
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-5">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-primary">Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-2xl border border-default bg-page px-4 py-3 text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <p className="mt-2 text-sm text-muted">This name is shown across BOMO and in project summaries.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary">Profile Image</label>
                <div className="mt-3 flex items-start gap-4">
                  <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-default bg-panel text-muted">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <FiUser className="h-10 w-10" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="profileImage" className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:bg-opacity-90">
                      <FiCamera className="h-4 w-4" />
                      Upload image
                    </label>
                    <input id="profileImage" type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                    <p className="mt-2 text-sm text-muted">Use a square image for the best preview. Updates are stored locally.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-default bg-panel p-5">
              <p className="text-sm font-semibold text-primary">Profile preview</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-2xl text-primary shadow-sm">
                  {displayName ? displayName.charAt(0).toUpperCase() : 'B'}
                </div>
                <div>
                  <p className="font-semibold text-primary">{displayName || 'Your name here'}</p>
                  <p className="text-sm text-muted">Displayed across your workspace and shared content.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-accent" aria-live="polite">{statusMessage}</div>
        </section>

        <section className="rounded-3xl border border-default bg-surface p-6 shadow-default">
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold">Appearance</h2>
              <p className="text-sm text-muted">Choose how BOMO appears across the workspace.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    aria-pressed={isActive}
                    className={`rounded-3xl border px-4 py-5 text-left transition-shadow ${isActive ? 'border-accent bg-accent-soft shadow-lg' : 'border-default bg-page hover:border-accent/50 hover:shadow-sm'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${isActive ? 'bg-accent text-black' : 'bg-default text-muted'}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className={`font-semibold ${isActive ? 'text-primary' : 'text-primary'}`}>{option.label}</p>
                        <p className="text-sm text-muted">{option.value === 'system' ? 'Follow device preference' : `${option.label} theme`}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-3xl border border-default bg-panel p-4 text-sm text-muted">
              <p className="font-medium text-primary">Active theme:</p>
              <p>{theme === 'system' ? `System (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})` : theme.charAt(0).toUpperCase() + theme.slice(1)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-default bg-surface p-6 shadow-default">
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold">About BOMO</h2>
              <p className="max-w-2xl text-sm text-muted">BOMO is an AI-powered project workspace designed to help users transform ideas into structured execution workflows. Whether developing engineering solutions or organizing community initiatives, BOMO supports planning, organization, and project progression through a guided experience.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-default bg-panel p-4">
                <p className="text-sm font-semibold text-primary">Team</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>Daniel Cosare — IoT, ML/AI & Edge Hardware (Agora R1 Kit)</li>
                  <li>Jerome Benitez — Research, Development & Data Logic</li>
                  <li>Ralph Silva — Lead Full-Stack Developer (React / FastAPI)</li>
                  <li>Justine Nabuya — UI & UX Design</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-default bg-panel p-4">
                <p className="text-sm font-semibold text-primary">Platform</p>
                <div className="mt-3 space-y-2 text-sm text-muted">
                  <p>BOMO is built to keep configuration simple, accessible, and consistent across screens.</p>
                  <p className="font-semibold text-primary">Version {pkg.version}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
