import { InlineWidget, useCalendlyEventListener } from "react-calendly";

export default function BookDemo() {
  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      try {
        await fetch("/api/booking-notify", {   // nee backend URL petti (e.g. https://api.yourdomain.com/api/booking-notify)
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteeUri: e.data.payload.invitee.uri }),
        });
      } catch (err) {
        console.error("Notify failed", err);
      }
    },
  });

  return (
    <main style={{ minHeight: "100vh", padding: "120px 20px 60px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <InlineWidget
          url="https://calendly.com/tejaswinibattula9/30min"
          styles={{ height: "700px" }}
          pageSettings={{
            backgroundColor: "000000",
            textColor: "ffffff",
            primaryColor: "7c4dff",
            hideEventTypeDetails: true,
            hideGdprBanner: true,
          }}
        />
      </div>
    </main>
  );
}