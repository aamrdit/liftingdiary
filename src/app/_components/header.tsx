"use client";

import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <span className="text-xl font-semibold tracking-tight">Lifting Diary</span>
      <div className="flex items-center gap-3">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity">
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
