// context/points.tsx
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type PointsCtx = {
  points: number;
  setPoints: (n: number) => void;
  addPoints: (n: number) => void;
};

const Ctx = createContext<PointsCtx | null>(null);
const PTS_KEY = "CSa_POINTS";

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPointsState] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const s = await SecureStore.getItemAsync(PTS_KEY);
      setPointsState(s ? Number(s) : 0);
    })();
  }, []);

  const setPoints = (n: number) => {
    setPointsState(n);
    SecureStore.setItemAsync(PTS_KEY, String(n)).catch(() => {});
  };
  const addPoints = (n: number) => setPoints(points + n);

  return <Ctx.Provider value={{ points, setPoints, addPoints }}>{children}</Ctx.Provider>;
}

export function usePoints() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePoints must be used inside <PointsProvider>");
  return v;
}
