export default function AuthNotice() {
  return (
    <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
      <strong>Firebase credentials needed:</strong> paste your Firebase Web App config into <span className="font-mono">.env.local</span> to enable login, registration, Google sign-in, and protected dashboards.
    </div>
  );
}
