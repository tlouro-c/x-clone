import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (createdAt: string) => {
  const now = new Date();
  const tweetDate = new Date(createdAt);
  const diffInMs = now.getTime() - tweetDate.getTime();

  const diffInSec = diffInMs / 1000; // convert milliseconds to seconds
  const diffInMin = diffInSec / 60; // convert seconds to minutes
  const diffInHours = diffInMin / 60; // convert minutes to hours
  const diffInDays = diffInHours / 24; // convert hours to days

  // If the tweet was posted within the last 24 hours, use relative time (e.g., "2 hours ago")
  if (diffInDays < 1) {
    if (diffInHours < 1) {
      if (diffInMin < 1) {
        return "Just now"; // less than a minute ago
      }
      return `${Math.floor(diffInMin)} minutes ago`; // minutes ago
    }
    return `${Math.floor(diffInHours)} hours ago`; // hours ago
  }

  // If the tweet was posted more than 24 hours ago, show the full date
  return tweetDate.toLocaleString(); // Full date (e.g., "12/11/2024, 3:00 PM")
};