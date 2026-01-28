import { useState, useEffect } from "react";

export function useCurrentUser() {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Get token from cookie
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        setError(new Error("Token não encontrado"));
        setLoading(false);
        return;
      }

      // Decode JWT (without verification on client, as it's for display only)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      setUserId(payload.id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erro ao decodificar token"));
    } finally {
      setLoading(false);
    }
  }, []);

  return { userId, loading, error };
}
