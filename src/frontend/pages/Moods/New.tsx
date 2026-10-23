import "../globals.css";
import "../ui.css";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  PageHeading,
  CenteredLayout,
  Banner,
} from "egon-ui";
import { apiMoodsPost } from "@/frontend/generated/apiClient.js";
import { MoodCreate } from "@/frontend/components/moods/MoodCreate.js";
import { MoodValue } from "@/common/types.js";

const App = () => {
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (mood: MoodValue, note: string) => {
    const response = await apiMoodsPost({
      body: JSON.stringify({ mood, note: note || null }),
    });
    if (response.success) {
      window.location.href = "/moods";
      return true;
    } else {
      setError(response.error || "Failed to create mood");
      return false;
    }
  };

  const handleCancel = () => {
    window.location.href = "/moods";
  };

  return (
    <CenteredLayout className="p-lg min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <PageHeading>Add New Mood</PageHeading>
        <Button onClick={handleCancel}>Back to Moods</Button>
      </div>

      {error && (
        <Banner style="error" className="mb-4">
          {error}
        </Banner>
      )}

      <Card>
        <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodCreate onSubmit={handleCreate} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </CenteredLayout>
  );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
