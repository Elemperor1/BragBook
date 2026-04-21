import { ImageResponse } from "next/og";

export const alt =
  "BragBook turns saved proof of work into promotion packets, reviews, resumes, and interview stories.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#15110e",
          color: "#fff7ed",
          fontFamily: "Inter, Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "46%",
            height: "100%",
            background: "#eadfce",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,#15110e 0%,#15110e 53%,rgba(21,17,14,0.7) 68%,transparent 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            padding: "72px",
            gap: "54px",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", width: "52%" }}>
            <div
              style={{
                fontSize: 24,
                letterSpacing: 0,
                textTransform: "uppercase",
                color: "#cdbda9",
                marginBottom: 28,
              }}
            >
              BragBook
            </div>
            <div
              style={{
                fontSize: 88,
                lineHeight: 0.86,
                letterSpacing: 0,
                fontWeight: 700,
              }}
            >
              Turn your best work into career leverage.
            </div>
            <div
              style={{
                marginTop: 30,
                fontSize: 28,
                lineHeight: 1.35,
                color: "#eadccb",
              }}
            >
              Capture proof while the details are fresh, then turn it into serious
              career documents from evidence you own.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "38%",
              borderRadius: 34,
              background: "#fff8ee",
              color: "#171310",
              border: "2px solid rgba(255,255,255,0.78)",
              boxShadow: "0 36px 80px rgba(0,0,0,0.28)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "22px 26px",
                borderBottom: "2px solid #ded0bf",
                fontSize: 18,
                letterSpacing: 0,
                textTransform: "uppercase",
                color: "#766655",
              }}
            >
              <span>Evidence</span>
              <span>Output</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: 28 }}>
              <div style={{ fontSize: 24, color: "#8c7a68", marginBottom: 10 }}>
                Saved accomplishment
              </div>
              <div
                style={{
                  fontSize: 40,
                  lineHeight: 1.02,
                  fontWeight: 700,
                  marginBottom: 22,
                }}
              >
                Stabilized CI for monorepo builds
              </div>
              <div
                style={{
                  display: "flex",
                  borderTop: "2px solid #ded0bf",
                  paddingTop: 22,
                  fontSize: 27,
                  lineHeight: 1.24,
                }}
              >
                Promotion packet, self-review, resume bullets, and interview
                stories.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
