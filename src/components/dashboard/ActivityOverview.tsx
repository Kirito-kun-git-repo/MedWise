import MedicalHealthOverview from "./MedicalHealthOverview";
import NextAppointment from "./NextAppointment";

function ActivityOverview() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <MedicalHealthOverview />
      <NextAppointment />
    </div>
  );
}
export default ActivityOverview;