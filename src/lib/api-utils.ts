/**
 * API Configuration and Utility Functions
 * This file contains helper functions and configuration for API integration
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

/**
 * Format sensor value with proper unit
 */
export function formatSensorValue(
  value: number | boolean | null | undefined,
  unit: string
): string {
  if (value === null || value === undefined) return "--";
  if (typeof value === "boolean") return value ? "Alto" : "Baixo";
  return `${typeof value === "number" ? value.toFixed(1) : value}${unit}`;
}

/**
 * Get device status color
 */
export function getDeviceStatusColor(status: string): string {
  return status === "on" ? "text-green-500" : "text-muted-foreground";
}

/**
 * Get device status label
 */
export function getDeviceStatusLabel(status: string, type: string): string {
  if (type === "lamp") return status === "on" ? "Acesa" : "Apagada";
  if (type === "fan") return status === "on" ? "Ligado" : "Desligado";
  if (type === "pump") return status === "on" ? "Ativo" : "Inativo";
  return status === "on" ? "Ligado" : "Desligado";
}

/**
 * Format date to Brazilian locale
 */
export function formatDateBR(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Format time to Brazilian locale (HH:MM)
 */
export function formatTimeBR(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format datetime to Brazilian locale
 */
export function formatDateTimeBR(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Calculate percentage value
 */
export function calculatePercentage(
  current: number,
  min: number,
  max: number
): number {
  return Math.max(0, Math.min(((current - min) / (max - min)) * 100, 100));
}

/**
 * Get status label based on percentage
 */
export function getStatusFromPercentage(
  percentage: number,
  lowThreshold: number = 30,
  mediumThreshold: number = 60
): string {
  if (percentage < lowThreshold) return "Baixo";
  if (percentage < mediumThreshold) return "Atenção";
  return "Abastecido";
}

/**
 * Get status color based on percentage
 */
export function getStatusColor(
  percentage: number,
  lowThreshold: number = 30,
  mediumThreshold: number = 60
): string {
  if (percentage < lowThreshold) return "text-red-500";
  if (percentage < mediumThreshold) return "text-yellow-500";
  return "text-green-500";
}
