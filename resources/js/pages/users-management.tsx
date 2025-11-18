// resources/js/pages/users-management.tsx
"use client";

import * as React from "react";
import { usePage, router, Link } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { Home, Trash2, Save, Plus } from "lucide-react";
import Confetti from "react-confetti";

type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

type Grade = {
  id: number;
  name: string;
  multiplier: string | number;
};

type Student = {
  id: number;
  name: string;
  grades: Grade[];
};

type PageProps = {
  users: User[];
  students: Student[];
  grades: Grade[];
  flash?: {
    success?: string;
  };
};

export default function UsersManagement() {
  const { users, students, grades, flash } = usePage<PageProps>().props;

  // --- Create user form state ---
  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  // --- Inline edit user state ---
  const [editingUserId, setEditingUserId] = React.useState<number | null>(null);
  const [editUser, setEditUser] = React.useState({
    name: "",
    email: "",
  });

  // --- Create student form state ---
  const [newStudentName, setNewStudentName] = React.useState("");

  // --- Inline edit student state ---
  const [editingStudentId, setEditingStudentId] = React.useState<number | null>(null);
  const [editStudentName, setEditStudentName] = React.useState("");

  // --- Grade selection state (local) ---
  const [studentGrade, setStudentGrade] = React.useState<Record<number, number | "">>(
    () =>
      students.reduce((acc, s) => {
        const current = s.grades[0] ?? null;
        acc[s.id] = current ? current.id : "";
        return acc;
      }, {} as Record<number, number | "">)
  );

   // --- Confetti state ---
  const [showConfetti, setShowConfetti] = React.useState(false);


  // ---------- USER HANDLERS ----------

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(
      "/users-management/users",
      {
        ...newUser,
      },
      {
        onSuccess: () => {
          setNewUser({ name: "", email: "", password: "" });
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        },
      }
    );
  };

  const startEditUser = (user: User) => {
    setEditingUserId(user.id);
    setEditUser({ name: user.name, email: user.email });
  };

  const cancelEditUser = () => {
    setEditingUserId(null);
    setEditUser({ name: "", email: "" });
  };

  const handleUpdateUser = (userId: number) => {
    router.put(
      `/users-management/users/${userId}`,
      {
        ...editUser,
      },
      {
        onSuccess: () => {
          setEditingUserId(null);
        },
      }
    );
  };

  const handleDeleteUser = (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    router.delete(`/users-management/users/${userId}`);
  };

  // ---------- STUDENT HANDLERS ----------

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    router.post(
      "/users-management/students",
      {
        name: newStudentName.trim(),
      },
      {
        onSuccess: () => {
          setNewStudentName("");
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        },
      }
    );
  };

  const startEditStudent = (student: Student) => {
    setEditingStudentId(student.id);
    setEditStudentName(student.name);
  };

  const cancelEditStudent = () => {
    setEditingStudentId(null);
    setEditStudentName("");
  };

  const handleUpdateStudent = (studentId: number) => {
    if (!editStudentName.trim()) return;

    router.put(
      `/users-management/students/${studentId}`,
      {
        name: editStudentName.trim(),
      },
      {
        onSuccess: () => {
          setEditingStudentId(null);
          setEditStudentName("");
        },
      }
    );
  };

  const handleDeleteStudent = (studentId: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    router.delete(`/users-management/students/${studentId}`);
  };

  const handleGradeChange = (studentId: number, gradeId: number | "") => {
    setStudentGrade((prev) => ({ ...prev, [studentId]: gradeId }));
  };

  const handleSaveGrade = (studentId: number) => {
    const gradeId = studentGrade[studentId];
    if (!gradeId) return;

    router.post(`/users-management/students/${studentId}/grade`, {
      grade_id: gradeId,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-tertiary/30 p-4 md:p-8">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Users & Students Management
            </h1>
            <p className="text-sm md:text-base text-foreground/70">
              Manage teacher accounts and fully manage students & their grades.
            </p>
          </div>
          <Link href={ROUTES.DASHBOARD}>
            <Button variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Flash message */}
        {flash?.success && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
            {flash.success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teachers (users) */}
          <Card className="p-4 md:p-6 shadow-lg border-2 border-primary/20 bg-card">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
              Teachers (Users)
            </h2>

            {/* Create user form */}
            <form
              onSubmit={handleCreateUser}
              className="mb-6 space-y-3 border-b border-border pb-4"
            >
              <h3 className="text-sm font-semibold text-foreground/80">
                Add New User
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Name"
                  className="rounded-lg border px-3 py-2 bg-background text-sm"
                  required
                />
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Email"
                  className="rounded-lg border px-3 py-2 bg-background text-sm"
                  required
                />
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Password"
                  className="rounded-lg border px-3 py-2 bg-background text-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button size="sm" type="submit" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Create User
                </Button>
              </div>
            </form>

            {/* Users list */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {users.length === 0 && (
                <p className="text-sm text-foreground/60">No users yet.</p>
              )}

              {users.map((user) => {
                const isEditing = editingUserId === user.id;
                return (
                  <div
                    key={user.id}
                    className="flex flex-col md:flex-row md:items-center gap-2 border border-border rounded-lg px-3 py-2 bg-background/70"
                  >
                    <div className="flex-1 space-y-1">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={editUser.name}
                            onChange={(e) =>
                              setEditUser((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="w-full rounded-lg border px-2 py-1 text-sm bg-background"
                          />
                          <input
                            type="email"
                            value={editUser.email}
                            onChange={(e) =>
                              setEditUser((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className="w-full rounded-lg border px-2 py-1 text-sm bg-background"
                          />
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="text-xs text-foreground/70">{user.email}</p>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 justify-end">
                      {isEditing ? (
                        <>
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => handleUpdateUser(user.id)}
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={cancelEditUser}
                            title="Cancel"
                          >
                            ✕
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditUser(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Students & Grades */}
          <Card className="p-4 md:p-6 shadow-lg border-2 border-primary/20 bg-card">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Students & Grade Assignment
            </h2>

            {/* Create student form */}
            <form
              onSubmit={handleCreateStudent}
              className="mb-4 space-y-3 border-b border-border pb-4"
            >
              <h3 className="text-sm font-semibold text-foreground/80">
                Add New Student
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Student name"
                  className="flex-1 rounded-lg border px-3 py-2 bg-background text-sm"
                  required
                />
                <Button size="sm" type="submit" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Create
                </Button>
              </div>
            </form>

            {students.length === 0 ? (
              <p className="text-sm text-foreground/60">
                No students found. Add students using the form above.
              </p>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {students.map((student) => {
                  const selectedGradeId = studentGrade[student.id] ?? "";
                  const currentGradeName =
                    student.grades[0]?.name ?? "No grade assigned";
                  const isEditing = editingStudentId === student.id;

                  return (
                    <div
                      key={student.id}
                      className="flex flex-col md:flex-row md:items-center gap-2 border border-border rounded-lg px-3 py-2 bg-background/70"
                    >
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editStudentName}
                            onChange={(e) => setEditStudentName(e.target.value)}
                            className="w-full rounded-lg border px-2 py-1 text-sm bg-background"
                          />
                        ) : (
                          <p className="font-semibold text-sm">{student.name}</p>
                        )}
                        <p className="text-xs text-foreground/60">
                          Current: {currentGradeName}
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <select
                          className="rounded-lg border px-2 py-1 bg-background text-sm"
                          value={selectedGradeId}
                          onChange={(e) =>
                            handleGradeChange(
                              student.id,
                              e.target.value ? Number(e.target.value) : ""
                            )
                          }
                        >
                          <option value="">Select grade…</option>
                          {grades.map((grade) => (
                            <option key={grade.id} value={grade.id}>
                              {grade.name} (× {grade.multiplier})
                            </option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          onClick={() => handleSaveGrade(student.id)}
                          disabled={!selectedGradeId}
                        >
                          Save Grade
                        </Button>
                      </div>

                      <div className="flex gap-2 justify-end">
                        {isEditing ? (
                          <>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => handleUpdateStudent(student.id)}
                              title="Save student"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={cancelEditStudent}
                              title="Cancel"
                            >
                              ✕
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditStudent(student)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDeleteStudent(student.id)}
                              title="Delete student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
