import AuthModal from "@/frontend/components/AuthModal.jsx";
import Banner from "@/frontend/components/ui/Banner.jsx";
import Spinner from "@/frontend/components/ui/Spinner.jsx";
import { auth } from "@/frontend/lib/firebase.js";
import * as t from "@/frontend/types.js";
import { prettyFirebaseAuthError } from "@/frontend/util.js";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { createRoot } from "react-dom/client";
import { Input } from "egon-ui";
import "./globals.css";
import "./ui.css";

const App = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [banner, setBanner] = React.useState<t.Banner | null>(null);
  const [loading, setLoading] = React.useState(false);

  const signUp = async () => {
    if (password !== passwordConfirm) {
      setBanner({
        level: "error",
        message: "Passwords do not match",
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Signed in
      const user = userCredential.user;
      setBanner({
        level: "info",
        message: `You have signed up with the email ${user.email}. Welcome aboard!`,
      });
      const token = await user.getIdToken();
      const now = new Date();
      const expirationDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
      document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/`;
    } catch (error) {
      console.log({ error });
      const e = error as FirebaseError;
      setBanner({
        level: "error",
        message: prettyFirebaseAuthError(e.code as t.FirebaseAuthErrorCode),
      });
    }
    setLoading(false);
  };

  return (
    <AuthModal title="Sign up">
      {banner && <Banner level={banner.level} message={banner.message} />}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && signUp()}
      />
      <button onClick={signUp} className="btn btn-primary">
        Sign up
      </button>
      <a href="/signin" className="btn btn-secondary">
        Have an account? Sign in
      </a>
      <div className="flex justify-center">
        <Spinner show={loading} />
      </div>
    </AuthModal>
  );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
