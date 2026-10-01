import React from "react";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";
import { Order, MenuItem } from "../../types/restaurant";

interface AdminStatsProps {
  orders: Order[];
  menuItems: MenuItem[];
}

export const AdminStats: React.FC<AdminStatsProps> = ({
  orders,
  menuItems,
}) => {
  // ================= REAL DATA LOGIC — SAME =================

  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.total || 0),
    0
  );

  const totalOrdersCount = orders.length;

  const avgOrderValue =
    totalOrdersCount > 0
      ? Math.round(totalRevenue / totalOrdersCount)
      : 0;

  const bestsellers = menuItems
    .filter((item) => item.isBestseller)
    .slice(0, 4);

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  // =========================================================

  const metrics = [
    {
      title: "Total Sales",
      value: `₹${totalRevenue.toLocaleString()}`,
      subtitle: "From current orders",
      icon: DollarSign,
      iconBg: "#fff0eb",
      iconColor: "#d62300",
    },
    {
      title: "Orders Processed",
      value: totalOrdersCount.toString(),
      subtitle: "Current orders",
      icon: ShoppingBag,
      iconBg: "#fff7df",
      iconColor: "#b87900",
    },
    {
      title: "Avg Order Value",
      value: `₹${avgOrderValue.toLocaleString()}`,
      subtitle: "Based on current orders",
      icon: TrendingUp,
      iconBg: "#edf7e9",
      iconColor: "#509e2f",
    },
    {
      title: "Orders Completed",
      value: completedOrders.toString(),
      subtitle: "Completed orders",
      icon: Clock,
      iconBg: "#f3eee9",
      iconColor: "#6b5144",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* PAGE HEADER */}
      <div
        style={{
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 900,
            color: "var(--text-main, #24120d)",
          }}
        >
          Reports & Stats
        </h2>

        <p
          style={{
            margin: "4px 0 0",
            fontSize: "12px",
            color: "var(--text-muted, #806c61)",
          }}
        >
          Restaurant performance overview
        </p>
      </div>

      {/* METRICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "12px",
        }}
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.title}
              style={{
                background: "var(--card-bg, #fffdf9)",
                border:
                  "1px solid rgba(59,36,24,0.055)",
                borderRadius: "14px",
                padding: "15px",
                boxSizing: "border-box",
                minWidth: 0,
                boxShadow:
                  "0 5px 18px rgba(59,36,24,0.045)",
              }}
            >
              {/* TOP */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color:
                      "var(--text-muted, #806c61)",
                    lineHeight: 1.3,
                  }}
                >
                  {metric.title}
                </span>

                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    flexShrink: 0,
                    borderRadius: "9px",
                    background: metric.iconBg,
                    color: metric.iconColor,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon size={16} strokeWidth={2.5} />
                </div>
              </div>

              {/* VALUE */}
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "24px",
                  lineHeight: 1,
                  fontWeight: 900,
                  color:
                    "var(--text-main, #24120d)",
                  letterSpacing: "-0.5px",
                }}
              >
                {metric.value}
              </div>

              {/* SUBTITLE */}
              <div
                style={{
                  marginTop: "7px",
                  fontSize: "10px",
                  color:
                    "var(--text-muted, #806c61)",
                }}
              >
                {metric.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* BESTSELLERS */}
      <div
        style={{
          marginTop: "18px",
          background: "var(--card-bg, #fffdf9)",
          border:
            "1px solid rgba(59,36,24,0.055)",
          borderRadius: "14px",
          padding: "16px",
          boxShadow:
            "0 5px 18px rgba(59,36,24,0.045)",
        }}
      >
        {/* SECTION HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              background: "#fff7df",
              color: "#b87900",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Award size={17} />
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 900,
                color:
                  "var(--text-main, #24120d)",
              }}
            >
              Top Flame-Grilled Bestsellers
            </h3>

            <div
              style={{
                marginTop: "2px",
                fontSize: "10px",
                color:
                  "var(--text-muted, #806c61)",
              }}
            >
              Current bestseller items
            </div>
          </div>
        </div>

        {/* ITEMS */}
        {bestsellers.length === 0 ? (
          <div
            style={{
              padding: "18px",
              borderRadius: "10px",
              background: "#fffaf5",
              color:
                "var(--text-muted, #806c61)",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            No bestseller data available.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "8px",
            }}
          >
            {bestsellers.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  minWidth: 0,
                  padding: "9px",
                  background: "#fffaf5",
                  border:
                    "1px solid rgba(59,36,24,0.045)",
                  borderRadius: "10px",
                }}
              >
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "48px",
                    height: "48px",
                    flexShrink: 0,
                    objectFit: "cover",
                    borderRadius: "8px",
                    background: "#f2e7dc",
                  }}
                />

                {/* INFO */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 900,
                      color:
                        "var(--text-main, #24120d)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name}
                  </div>

                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "10px",
                      color:
                        "var(--text-muted, #806c61)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    ₹{item.price} •{" "}
                    {item.category.toUpperCase()}
                  </div>
                </div>

                {/* RANK */}
                <div
                  style={{
                    minWidth: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "#d62300",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "10px",
                    fontWeight: 900,
                  }}
                >
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESPONSIVE */}
      <style>
        {`
          @media (max-width: 900px) {
            .admin-stats-metrics {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 600px) {
            .admin-stats-metrics {
              grid-template-columns: 1fr;
            }

            .admin-stats-bestsellers {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </div>
  );
};