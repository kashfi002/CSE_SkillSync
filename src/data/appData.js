/* Static demo data and shared helpers. */

export const ROLES = { instructor: "Instructor", learner: "Learner", both: "Both" };
export const ROLE_OPTIONS = [
  { value: "instructor", label: "Instructor" },
  { value: "learner", label: "Learner" },
  { value: "both", label: "Both" },
];
export const FILE_HINT = "Upload a PNG or proof certificate";
export const POOL = ["Abida", "Rifah", "Tanvir Hossain", "Mim Akter", "Sadia Rahman", "Nafis Ahmed", "Farhan Kabir"];
export const WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export const MEMBERS = {
  "Rahim Ahmed": { inst: "Jagannath University", role: "instructor", bio: "Teaches OOP and Java for beginners.", offer: ["Java", "OOP"], learn: [] },
  "Karim Hasan": { inst: "Jagannath University", role: "instructor", bio: "Database and SQL, with real examples.", offer: ["Database", "SQL"], learn: [] },
  "Nusrat Jahan": { inst: "Jagannath University", role: "both", bio: "UI design and algorithms.", offer: ["UI design", "Algorithm"], learn: ["Python"] },
  Abida: { inst: "Jagannath University", role: "learner", bio: "Loves building small web projects.", offer: ["HTML", "CSS"], learn: ["Java", "OOP"] },
  Rifah: { inst: "Jagannath University", role: "both", bio: "Always up for a study group.", offer: ["Python"], learn: ["OOP", "Database"] },
  "Tanvir Hossain": { inst: "Dhaka University", role: "learner", bio: "", offer: ["SQL"], learn: ["Algorithm"] },
  "Mim Akter": { inst: "Jagannath University", role: "learner", bio: "", offer: [], learn: ["Python", "UI design"] },
  "Sadia Rahman": { inst: "BUET", role: "both", bio: "", offer: ["C++"], learn: ["Java"] },
  "Nafis Ahmed": { inst: "Jagannath University", role: "learner", bio: "", offer: [], learn: ["OOP"] },
  "Farhan Kabir": { inst: "NSU", role: "learner", bio: "", offer: ["Git"], learn: ["Database"] },
};

export const makeUser = () => ({
  name: "Person",
  inst: "Jagannath University",
  role: "learner",
  bio: "",
  photo: "",
  offer: ["Python", "UI design"],
  learn: ["Java", "OOP"],
});
export const makeCourses = () => [
  { id: "c1", by: "Rahim Ahmed", title: "OOP with Java", desc: "Learn classes, objects and inheritance", joined: false },
  { id: "c2", by: "Nusrat Jahan", title: "UI Design", desc: "Layout design and figma basics for beginners", joined: false },
  { id: "c3", by: "Shuvo Ahmed", title: "Python", desc: "Start coding with simple project", joined: false },
  { id: "c4", by: "Rifah", title: "Database", desc: "Tables, queries and design with real examples", joined: false },
];
export const makeLearning = () => [
  { title: "OOP with Java", who: "Rahim Ahmed", link: "meet.example.com/oop-java" },
  { title: "Database", who: "Karim Hasan", link: "meet.example.com/database" },
  { title: "Algorithm", who: "Nusrat Jahan", link: "meet.example.com/algorithm" },
];
export const makeTeaching = () => [
  { title: "Python for beginners", learners: 7, link: "meet.example.com/python" },
  { title: "UI design basics", learners: 5, link: "meet.example.com/ui-design" },
];
export const makeReviews = () => {
  const out = [];
  const seed = (course, list) =>
    list.forEach((x) => out.push({ course, stars: x[0], note: x[1] || "", mine: false }));
  seed("OOP with Java", [[5, "Clear and patient."], [5], [5, "Great assignments."], [5], [5], [5], [5], [5], [5], [4], [4], [4, "Wish there were more live examples."]]);
  seed("UI Design", [[5, "Finally understood auto layout."], [5], [5], [5], [4], [4], [4], [4]]);
  seed("Python", [[4], [4, "Good start for beginners."], [5], [4], [4]]);
  seed("Python for beginners", [[5, "Very clear explanations."], [5], [5], [4, "Good pace, more practice please."], [3, "A bit fast in week 2."]]);
  seed("UI design basics", [[5, "Great examples."], [4], [5]]);
  return out;
};
export const makeNotes = () => [
  { id: 1, kind: "request", who: "Shuva", course: "OOP with Java", sub: "3 learners are already included", time: "2h ago", state: "pending" },
  { id: 2, kind: "request", who: "Rifah", course: "Database", sub: "No one joined yet", time: "5h ago", state: "pending" },
  { id: 3, kind: "request", who: "Rahim", course: "OOP", sub: "", time: "today", state: "accepted" },
  { id: 4, kind: "update", who: "Rahim Ahmed", course: "OOP with Java", result: "accepted", time: "5h ago" },
  { id: 5, kind: "update", who: "Nusrat Jahan", course: "UI basics", result: "declined", time: "today" },
];

export function summarize(list) {
  const dist = [0, 0, 0, 0, 0, 0];
  let sum = 0;
  list.forEach((r) => {
    sum += r.stars;
    dist[r.stars]++;
  });
  return { n: list.length, avg: list.length ? sum / list.length : 0, dist };
}
export function toList(text) {
  const seen = {};
  return text
    .split(",")
    .map((x) => x.trim())
    .filter((x) => {
      const k = x.toLowerCase();
      if (!x || seen[k]) return false;
      seen[k] = 1;
      return true;
    });
}
export const learnersText = (n) => n + (n === 1 ? " learner" : " learners");
export const go = (hash) => {
  window.location.hash = hash;
};

export const APP_VIEWS = ["welcome", "profile", "edit", "find", "offer", "dashboard", "classroom", "member", "notification"];
export const ALL_VIEWS = ["home", "login", "signup", ...APP_VIEWS];
export const TITLES = {
  home: "CSE SkillSync",
  login: "Login - CSE SkillSync",
  signup: "Sign up - CSE SkillSync",
  welcome: "Home - CSE SkillSync",
  notification: "Notification - CSE SkillSync",
  dashboard: "Dashboard - CSE SkillSync",
  classroom: "Classroom - CSE SkillSync",
  member: "Member - CSE SkillSync",
  find: "Find a course - CSE SkillSync",
  offer: "Offer Instruction - CSE SkillSync",
  profile: "Profile - CSE SkillSync",
  edit: "Edit Profile - CSE SkillSync",
};
export const NAVMAP = { edit: "profile", find: "welcome", offer: "welcome", classroom: "dashboard", member: "dashboard" };
