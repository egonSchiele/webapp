import AuthModal from "@/frontend/components/AuthModal.jsx";
import Banner from "@/frontend/components/ui/Banner.jsx";
import Spinner from "@/frontend/components/ui/Spinner.jsx";
import { auth } from "@/frontend/lib/firebase.js";
import * as t from "@/frontend/types.js";
import { prettyFirebaseAuthError } from "@/frontend/util.js";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Input } from "egon-ui";
import "./globals.css";
import "./ui.css";

const App = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [banner, setBanner] = React.useState<t.Banner | null>(null);
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    auth.signOut();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Signed in
      const user = userCredential.user;
      setBanner({
        level: "info",
        message: `You are signed in as ${user.email}`,
      });
      const token = await user.getIdToken();
      const now = new Date();
      const expirationDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
      document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/`;

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect");
      if (redirect) {
        window.location.href = redirect;
      } else {
        window.location.href = "/";
      }
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

  const signOut = async () => {
    await auth.signOut();
    window.location.href = "/signout";
  };

  return (
    <AuthModal title="Welcome">
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
        onKeyDown={(e) => e.key === "Enter" && signIn()}
      />
      <button onClick={signIn} className="btn btn-primary">
        Sign in
      </button>
      <a href="/signup" className="btn btn-secondary">
        Sign up
      </a>
      <button onClick={signOut} className="link-secondary">
        Sign out
      </button>
      <div className="flex justify-center">
        <Spinner show={loading} />
      </div>
    </AuthModal>
  );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
