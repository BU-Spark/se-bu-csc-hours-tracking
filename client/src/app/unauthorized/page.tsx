import Link from "next/link";

const UnauthorizedPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <p>
        <Link href="/">Go to Home Page</Link>
      </p>
    </div>
  );
};

export default UnauthorizedPage;
