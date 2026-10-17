import { NAVMAP } from '../data/appData.js';
import { useApp } from '../context/AppContext.jsx';
import { WelcomeView, NotificationView, DashboardView } from '../pages/DashboardPages.jsx';
import { ClassroomView, MemberView } from '../pages/ClassroomPages.jsx';
import { FindView, OfferView } from '../pages/CoursePages.jsx';
import { ProfileView, EditView } from '../pages/ProfilePages.jsx';

export default function AppShell({ view }) {
  const { logout } = useApp();
  const nav = NAVMAP[view] || view;
  const link = (key, label) => (
    <a
      className={"side-link" + (nav === key ? " active" : "")}
      aria-current={nav === key ? "page" : undefined}
      href={"#" + key}
    >
      {label}
    </a>
  );
  const views = {
    welcome: <WelcomeView />,
    notification: <NotificationView />,
    dashboard: <DashboardView />,
    classroom: <ClassroomView />,
    member: <MemberView />,
    find: <FindView />,
    offer: <OfferView />,
    profile: <ProfileView />,
    edit: <EditView />,
  };
  return (
    <div className="app-shell">
      <aside className="side" aria-label="Menu">
        {link("profile", "Profile")}
        {link("welcome", "Home")}
        {link("dashboard", "Dashboard")}
        {link("notification", "Notification")}
        <button className="side-link" type="button" onClick={logout}>Log Out</button>
      </aside>
      {views[view]}
    </div>
  );
}
