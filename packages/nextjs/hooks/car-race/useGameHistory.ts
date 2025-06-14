import { useEffect, useState } from "react";
import { axiosClassic } from "~~/services/api/axios";
import { WinnerType } from "~~/types/betting";

export const useGameHistory = (isWinnerDisplay: boolean) => {
  const [data, setData] = useState<WinnerType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isWinnerDisplay) return;

    const fetchData = async () => {
      try {
        const { data: response } = await axiosClassic.get<{ items: WinnerType[] }>("api/game/get-history");

        const items = (response.items ?? []).filter(
          item => typeof item === "object" && item.winningSide?.trim() !== "",
        );

        setData(prev => {
          if (prev.length === 0) {
            return items.slice(0, 30);
          }

          const newValue = items[0];

          if (newValue && !prev.find(item => item.id === newValue.id)) {
            const updatedHistory = [newValue, ...prev].slice(0, 30);
            return updatedHistory;
          }

          return prev;
        });
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isWinnerDisplay]);

  return { data, isLoading, error };
};
