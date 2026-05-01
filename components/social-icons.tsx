"use client"

import { profileData } from "@/lib/data"

const socialLinks = [
  {
    name: "GitHub",
    href: profileData.github,
    icon: "https://cdn.simpleicons.org/github",
    invertInDark: true,
  },
  {
    name: "LinkedIn",
    href: profileData.linkedin,
    icon: "https://cdn.simpleicons.org/linkedin/0A66C2",
    invertInDark: false,
  },
  {
    name: "Gmail",
    href: `mailto:${profileData.email}`,
    icon: "https://cdn.simpleicons.org/gmail/EA4335",
    invertInDark: false,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/34608898454",
    icon: "https://cdn.simpleicons.org/whatsapp/25D366",
    invertInDark: false,
  },
]

export function SocialIcons() {
  return (
    <div className="flex items-center justify-center gap-5">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target={social.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          className="group p-2 transition-all duration-300 hover:scale-110"
          aria-label={social.name}
        >
          <img
            src={social.icon}
            alt={social.name}
            className={`w-6 h-6 transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-lg ${
              social.invertInDark ? "dark:invert" : ""
            }`}
          />
        </a>
      ))}
    </div>
  )
}
