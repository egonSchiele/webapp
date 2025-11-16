import "../globals.css";
import "../ui.css";
import React, { useEffect, useState } from "react";
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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  HGroupSM,
  VGroupSM,
} from "egon-ui";
import {
  apiMoodsGet,
  apiMoodsIdDelete,
} from "@/frontend/generated/apiClient.js";
import { Mood } from "@/backend/db/types.js";
import { getMoodEmoji, formatDate } from "@/frontend/util.js";

const App = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    setLoading(true);
    setError(null);
    const response = await apiMoodsGet();
    if (response.success) {
      setMoods(response.value);
    } else {
      setError(response.error || "Failed to load moods");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mood?")) {
      return;
    }

    const response = await apiMoodsIdDelete(id);
    if (response.success) {
      await loadMoods();
    } else {
      setError(response.error || "Failed to delete mood");
    }
  };

  const viewMood = (id: string) => {
    window.location.href = `/moods/${id}`;
  };

  const editMood = (id: string) => {
    window.location.href = `/moods/${id}/edit`;
  };

  return (
    <CenteredLayout className="p-lg min-h-screen max-w-[1200px]">
      <VGroupSM>
        <div className="flex justify-between items-center mb-8">
          <PageHeading>Mood Tracker</PageHeading>
          <Button onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
        </div>

        {error && (
          <Banner style="error" className="mb-4">
            {error}
          </Banner>
        )}

        <Button onClick={() => (window.location.href = "/moods/new")}>
          Add New Mood
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Mood History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Paragraph>Loading moods...</Paragraph>
            ) : moods.length === 0 ? (
              <Paragraph>No moods yet. Add your first mood!</Paragraph>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mood</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moods.map((mood) => (
                    <TableRow key={mood.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {getMoodEmoji(mood.mood)}
                          </span>
                          <span className="capitalize">{mood.mood}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {mood.note ? (
                          <span className="text-gray-700">{mood.note}</span>
                        ) : (
                          <span className="text-gray-400 italic">No note</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(mood.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <HGroupSM>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => viewMood(mood.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => editMood(mood.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(mood.id)}
                          >
                            Delete
                          </Button>
                        </HGroupSM>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </VGroupSM>
    </CenteredLayout>
  );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
