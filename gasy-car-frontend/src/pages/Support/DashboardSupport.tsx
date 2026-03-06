import DashboardOverview from "./DashboardOverview";

export default function SupportDashboard() {
  return <DashboardOverview setActiveTab={function (tab: string): void {
      throw new Error("Function not implemented.");
  } } />;
}
