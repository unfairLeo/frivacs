export interface Mission {
  id: string;
  title: string;
  completed: boolean;
}

export interface Meta {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  icon: "plane" | "home" | "graduation" | "car" | "target";
  deadline: Date | null;
  missions: Mission[];
}

export type MetaFormData = Omit<Meta, "id" | "missions">;
