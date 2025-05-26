export type SumResult = {
  "SUM(total)": number;
  "SUM(monthly_actual)": number;
};

export type DebtRecord = {
  id: string;
  name: string;
  debt_type: string;
  total: number;
  monthly_min: number;
  monthly_actual: number;
  interest: number;
  due_day: string;
  user?: string;
};

export type QueryResult = (SumResult | DebtRecord)[];

export type FileInfo = {
  name: string;
  uri: string;
  localPath: string;
};

export type FileContextType = {
  selectedFile: FileInfo | null;
  setSelectedFile: (file: FileInfo | null) => void;
};
