
const db = require("./db");

const internships = [
  {
    id: "INT-101",
    title: "Frontend Intern",
    domain: "Full Stack Development",
    mode: "Remote",
    location: "India",
    skills: ["HTML", "CSS", "JavaScript"],
    openings: 3
  },
  {
    id: "INT-102",
    title: "API Engineering Intern",
    domain: "Full Stack Development",
    mode: "Hybrid",
    location: "Pune",
    skills: ["Node.js", "SQL", "Testing"],
    openings: 2
  },
  {
    id: "INT-103",
    title: "UI/UX Intern",
    domain: "UI/UX",
    mode: "Remote",
    location: "India",
    skills: ["Figma", "Research"],
    openings: 1
  },
  {
    id: "INT-104",
    title: "Data Analyst Intern",
    domain: "Data Analytics",
    mode: "On-site",
    location: "Bengaluru",
    skills: ["Excel", "SQL"],
    openings: 2
  },
  {
    id: "INT-105",
    title: "Security Operations Intern",
    domain: "Cyber Security",
    mode: "Remote",
    location: "India",
    skills: ["Linux", "Logs", "Networking"],
    openings: 1
  }
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO internships
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const item of internships) {
  insert.run(
    item.id,
    item.title,
    item.domain,
    item.mode,
    item.location,
    JSON.stringify(item.skills),
    item.openings
  );
}

console.log("Sample data inserted successfully!");
