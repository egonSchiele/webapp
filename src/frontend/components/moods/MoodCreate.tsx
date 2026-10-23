import React from "react";
import { MoodForm } from "./MoodForm.js";
import { MoodValue } from "@/common/types.js";

type MoodCreateProps = {
  onSubmit: (mood: MoodValue, note: string) => Promise<boolean>;
  onCancel: () => void;
};

export const MoodCreate: React.FC<MoodCreateProps> = ({
  onSubmit,
  onCancel,
}) => {
  return <MoodForm onSubmit={onSubmit} onCancel={onCancel} isEditing={false} />;
};
