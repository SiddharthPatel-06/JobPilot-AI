export function mapProfileRoles(profile: any) {
  const skills = profile.skills.map((s: string) => s.toLowerCase());

  const roleKeywords: string[] = [];

  const dictionary = {
    frontend: ["react", "reactjs", "javascript", "html", "css"],
    mern: ["node", "express", "mongodb", "react"],
    fullstack: ["frontend", "backend", "react", "node"],
    backend: ["node", "express", "api"],
    web: ["html", "css", "javascript"],
  };

  Object.entries(dictionary).forEach(([role, words]) => {
    const match = words.some((w) => skills.includes(w));

    if (match) {
      roleKeywords.push(role);
    }
  });

  // Add synonyms manually
  const extra = [
    "full stack developer",
    "mern developer",
    "mern stack",
    "frontend developer",
    "reactjs developer",
    "react developer",
    "backend developer",
    "nodejs developer",
    "web developer",
    "software engineer",
    "software developer",
    "web engineer",
    "web dev",
    "frontend dev",
    "backend dev",
    "fullstack dev",
    "mern dev",
    "node dev",
    "react dev",
    "express developer",
    "javascript developer",
    "html developer",
    "css developer",
    "api developer",
    "js developer",
    "software dev",
  ];

  return [...new Set([...roleKeywords, ...extra])];
}
