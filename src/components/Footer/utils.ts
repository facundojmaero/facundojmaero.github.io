import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaTwitter,
  FaFileAlt,
} from "react-icons/fa";

const getContactHref = (name: string, contact: string) => {
  let href;

  switch (name) {
    case "twitter":
      href = `https://www.twitter.com/${contact}`;
      break;
    case "github":
      href = `https://github.com/${contact}`;
      break;
    case "email":
      href = `mailto:${contact}`;
      break;
    case "linkedin":
      href = `https://www.linkedin.com/in/${contact}`;
      break;
    case "resume":
      href = `https://registry.jsonresume.org/${contact}`;
      break;
    default:
      href = contact;
      break;
  }

  return href;
};

const getIcon = (name: string) => {
  const icons = {
    twitter: FaTwitter,
    github: FaGithub,
    email: FaEnvelope,
    linkedin: FaLinkedin,
    resume: FaFileAlt,
  };
  return icons[name];
};

export { getIcon, getContactHref };
