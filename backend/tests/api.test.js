process.env.NODE_ENV = "test";
process.env.DB_STORAGE = "database/test.sqlite";

const request = require("supertest");
const { sequelize, Employee, Attendance } = require("../src/models");
const app = require("../src/app");

describe("HRMS Lite API", () => {
  let employeePrimary;
  let employeeSecondary;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    employeePrimary = await Employee.create({
      employeeId: "EMP-001",
      fullName: "Alex Morgan",
      email: "alex@example.com",
      department: "Engineering",
    });

    employeeSecondary = await Employee.create({
      employeeId: "EMP-002",
      fullName: "Jordan Lee",
      email: "jordan@example.com",
      department: "Operations",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /api/employees returns all employees", async () => {
    const response = await request(app).get("/api/employees");

    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(2);
    expect(response.body.data[0]).toHaveProperty("employeeId");
  });

  test("POST /api/employees creates employee", async () => {
    const response = await request(app).post("/api/employees").send({
      employeeId: "EMP-003",
      fullName: "Jamie Foster",
      email: "jamie@example.com",
      department: "Finance",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.employeeId).toBe("EMP-003");
  });

  test("POST /api/employees rejects duplicate business id", async () => {
    const response = await request(app).post("/api/employees").send({
      employeeId: "EMP-001",
      fullName: "Taylor Reed",
      email: "taylor@example.com",
      department: "HR",
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.error.message).toContain("Duplicate value");
  });

  test("DELETE /api/employees/:id deletes employee", async () => {
    const response = await request(app).delete(`/api/employees/${employeeSecondary.id}`);

    expect(response.statusCode).toBe(200);

    const lookup = await Employee.findByPk(employeeSecondary.id);

    expect(lookup).toBeNull();
  });

  test("POST /api/attendance marks attendance", async () => {
    const response = await request(app).post("/api/attendance").send({
      employeeId: employeePrimary.id,
      date: "2026-02-06",
      status: "Present",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.status).toBe("Present");
  });

  test("POST /api/attendance rejects duplicate attendance", async () => {
    await Attendance.create({
      employeeId: employeePrimary.id,
      date: "2026-02-06",
      status: "Present",
    });

    const response = await request(app).post("/api/attendance").send({
      employeeId: employeePrimary.id,
      date: "2026-02-06",
      status: "Absent",
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.error.message).toContain("already marked");
  });

  test("GET /api/attendance/:employeeId returns history", async () => {
    await Attendance.create({
      employeeId: employeePrimary.id,
      date: "2026-02-05",
      status: "Present",
    });

    const response = await request(app).get(`/api/attendance/${employeePrimary.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.employee.id).toBe(employeePrimary.id);
    expect(response.body.total).toBe(1);
  });

  test("GET /api/attendance/:employeeId returns 404 for invalid employee", async () => {
    const response = await request(app).get("/api/attendance/999999");

    expect(response.statusCode).toBe(404);
    expect(response.body.error.message).toContain("Employee not found");
  });
});
