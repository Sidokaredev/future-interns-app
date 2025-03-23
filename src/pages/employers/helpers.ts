import { SxProps } from "@mui/material";

export type BreadcrumbsProps = {
  label: string;
  pathname: string;
};

export default function BreadcrumbsCreator(
  params: Record<string, string>,
  currentPath: string
): BreadcrumbsProps[] {
  let pathname: string = "";

  if (Object.keys(params).length !== 0) {
    for (const key in params) {
      pathname = currentPath.replace("/" + params[key], "");
    }
  } else {
    pathname = currentPath;
  }

  return pathname
    .split("/")
    .slice(2)
    .map((path) => {
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1),
        pathname:
          currentPath.substring(0, currentPath.lastIndexOf(path)) + path,
      };
    });
};

export function SLAConverter(sla: number, createdDate: string): Date {
  const created = new Date(createdDate).getTime();
  const slaAddition = sla * 60 * 60 * 1000;
  return new Date(created + slaAddition);
};

export function SLADaysRemaining(sla: number): string {
  const days = Math.ceil(sla / 24);
  return `${days} days remaining`;
}

export function EmployerTypeStyler(type: string): { backgroundColor: string, color: string } {
  const colorMap: Record<string, { backgroundColor: string, color: string }> = {
    "Full-time": { color: "#28a745", backgroundColor: "#a9dcb5" },
    "Part-time": { color: "#17a2b8", backgroundColor: "#b9e3ea" },
    "Contract": { color: "#fd7e14", backgroundColor: "#fed8b9" },
    "Freelance": { color: "#ffc107", backgroundColor: "#ffecb5" },
    "Internship": { color: "#007bff", backgroundColor: "#b3d7ff" },
    "Temporary": { color: "#6c757d", backgroundColor: "#d3d6d8" },
    "Volunteer": { color: "#6f42c1", backgroundColor: "#d4c6ec" },
    "Remote": { color: "#20c997", backgroundColor: "#bcefe0" },
    "On-call": { color: "#dc3545", backgroundColor: "#f5c2c7" },
    "Seasonal": { color: "#795548", backgroundColor: "#d7ccc8" },
  };

  return colorMap[type];
}

export function Top3RankStyles(index: number): SxProps {
  switch (index) {
    case 1:
      return {
        backgroundColor: "#fff2cc",
        ".MuiTypography-body2": {
          color: "#e6ac00",
          fontWeight: "bold",
        },
        ".MuiTableCell-root": {
          border: "none",
        },
        ":hover": {
          backgroundColor: "#ffecb3 !important",
        },
        cursor: "pointer",
      }

    case 2:
      return {
        backgroundColor: "#f2f2f2",
        ".MuiTypography-body2": {
          color: "#adadad",
          fontWeight: "bold",
        },
        ".MuiTableCell-root": {
          border: "none",
        },
        ":hover": {
          backgroundColor: "#ececec !important",
        },
        cursor: "pointer",
      }

    case 3:
      return {
        backgroundColor: "#f2e1cc",
        ".MuiTypography-body2": {
          color: "#aa5d00",
          fontWeight: "bold",
        },
        ".MuiTableCell-root": {
          border: "none",
        },
        ":hover": {
          backgroundColor: "#ebd1b3 !important",
        },
        cursor: "pointer",
      }

    default:
      return {}
  }
}