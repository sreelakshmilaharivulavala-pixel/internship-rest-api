
const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to Internship Management REST API!");
});

function response(res, status, data, meta = null) {
  return res.status(status).json({
    status: status < 400 ? "success" : "error",
    data,
    ...(meta ? { meta } : {})
  });
}

// 1. GET - List internships with pagination
app.get("/api/internships", (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);

  if (
    !Number.isInteger(page) || page < 1 ||
    !Number.isInteger(limit) || limit < 1 || limit > 50
  ) {
    return response(res, 400, { message: "Invalid pagination values" });
  }

  const total = db.prepare(
    "SELECT COUNT(*) AS count FROM internships"
  ).get().count;

  const rows = db.prepare(
    "SELECT * FROM internships LIMIT ? OFFSET ?"
  ).all(limit, (page - 1) * limit);

  const data = rows.map(item => ({
    ...item,
    skills: JSON.parse(item.skills)
  }));

  response(res, 200, data, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  });
});

// 2. GET - Internship details
app.get("/api/internships/:id", (req, res) => {
  const item = db.prepare(
    "SELECT * FROM internships WHERE id = ?"
  ).get(req.params.id);

  if (!item) {
    return response(res, 404, { message: "Internship not found" });
  }

  item.skills = JSON.parse(item.skills);
  response(res, 200, item);
});

// 3. POST - Create internship
app.post("/api/internships", (req, res) => {
  const { id, title, domain, mode, location, skills, openings } = req.body;

  if (
    !id || !title || !domain || !mode || !location ||
    !Array.isArray(skills) ||
    !skills.length ||
    !skills.every(s => typeof s === "string" && s.trim()) ||
    !Number.isInteger(openings) || openings < 1
  ) {
    return response(res, 400, {
      message: "Please provide valid internship details"
    });
  }

  try {
    db.prepare(`
      INSERT INTO internships
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id.trim(), title.trim(), domain.trim(), mode.trim(),
      location.trim(), JSON.stringify(skills), openings
    );

    response(res, 201, { message: "Internship created", id });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
      return response(res, 409, { message: "Internship ID already exists" });
    }
    response(res, 500, { message: "Database error" });
  }
});

// 4. PUT - Update internship
app.put("/api/internships/:id", (req, res) => {
  const { title, domain, mode, location, skills, openings } = req.body;

  if (
    !title || !domain || !mode || !location ||
    !Array.isArray(skills) ||
    !skills.length ||
    !skills.every(s => typeof s === "string" && s.trim()) ||
    !Number.isInteger(openings) || openings < 1
  ) {
    return response(res, 400, { message: "Invalid update details" });
  }

  const result = db.prepare(`
    UPDATE internships
    SET title=?, domain=?, mode=?, location=?, skills=?, openings=?
    WHERE id=?
  `).run(
    title.trim(), domain.trim(), mode.trim(), location.trim(),
    JSON.stringify(skills), openings, req.params.id
  );

  if (!result.changes) {
    return response(res, 404, { message: "Internship not found" });
  }

  response(res, 200, { message: "Internship updated successfully" });
});

// 5. DELETE - Delete internship
app.delete("/api/internships/:id", (req, res) => {
  const result = db.prepare(
    "DELETE FROM internships WHERE id = ?"
  ).run(req.params.id);

  if (!result.changes) {
    return response(res, 404, { message: "Internship not found" });
  }

  response(res, 200, { message: "Internship deleted successfully" });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return response(res, 400, { message: "Invalid JSON format" });
  }
  next(err);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
