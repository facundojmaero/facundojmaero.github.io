import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://astro-paper.pages.dev/",
  author: "Facundo Maero",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "Facundo's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 4,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/facundojmaero",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/facundomaero",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/facundojmaero",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/facundomaero",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
  {
    name: "Mail",
    href: "mailto:facundojmaero@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];
