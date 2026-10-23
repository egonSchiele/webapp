import "../globals.css";
import "../ui.css";
import { useEffect, useState, ReactNode } from "react";
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
  Paragraph,
} from "egon-ui";
import {
  apiMoodsIdGet,
  apiMoodsIdPut,
} from "@/frontend/generated/apiClient.js";
import { Mood as MoodType } from "@/backend/db/types.js";
import { MoodUpdate } from "@/frontend/components/moods/MoodUpdate.js";
import { MoodValue } from "@/common/types.js";

const App = () => {
  const [mood, setMood] = useState<MoodType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMood();
  }, []);

  const getMoodId = (): number | null => {
    const pathParts = window.location.pathname.split("/");
    const idStr = pathParts[pathParts.length - 2]; // /moods/:id/edit, so -2 gets the id
    const id = parseInt(idStr);
    return isNaN(id) ? null : id;
  };

  const loadMood = async () => {
    setLoading(true);
    setError(null);
    const id = getMoodId();
    if (!id) {
      setError("No mood ID provided");
      setLoading(false);
      return;
    }

    const response = await apiMoodsIdGet(id);
    if (response.success) {
      setMood(response.value);
    } else {
      setError(response.error || "Failed to load mood");
    }
    setLoading(false);
  };

  const handleUpdate = async (moodValue: MoodValue, note: string) => {
    if (!mood) {
      return false;
    }

    const response = await apiMoodsIdPut(mood.id, {
      body: JSON.stringify({ mood: moodValue, note: note || null }),
    });
    if (response.success) {
      window.location.href = `/moods/${mood.id}`;
      return true;
    } else {
      setError(response.error || "Failed to update mood");
      return false;
    }
  };

  const handleCancel = () => {
    if (!mood) {
      window.location.href = "/moods";
    } else {
      window.location.href = `/moods/${mood.id}`;
    }
  };

  const renderMood = (): ReactNode => {
    if (loading) {
      return <Paragraph>Loading mood...</Paragraph>;
    }
    if (!mood) {
      return <Paragraph>Mood not found</Paragraph>;
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle>Update your mood</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodUpdate
            mood={mood}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <CenteredLayout className="p-lg min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <PageHeading>Edit Mood</PageHeading>
        <Button onClick={handleCancel}>Cancel</Button>
      </div>

      {error && (
        <Banner style="error" className="mb-4">
          {error}
        </Banner>
      )}

      {renderMood()}
    </CenteredLayout>
  );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
