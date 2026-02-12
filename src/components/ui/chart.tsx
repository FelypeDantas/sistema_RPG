import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center rounded-xl border border-white/10 bg-cyber-card p-4 text-xs shadow-lg shadow-black/20",
          "[&_svg]:outline-none",
          "[&_.recharts-cartesian-axis-tick_text]:fill-gray-400",
          "[&_.recharts-cartesian-grid_line]:stroke-white/5",
          "[&_.recharts-curve]:stroke-[var(--curve-color)]",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[
        theme as keyof typeof itemConfig.theme
      ] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "min-w-[9rem] rounded-lg border border-white/10 bg-cyber-card/95 backdrop-blur-md px-3 py-2 text-xs shadow-xl shadow-black/30",
          className
        )}
      >
        <div className="space-y-2">
          {payload.map((item, index) => {
            const key = `${
              nameKey || item.name || item.dataKey || "value"
            }`;
            const itemConfig =
              config[key] || config[item.dataKey as string];
            const indicatorColor =
              color || item.payload.fill || item.color;

            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  {!hideIndicator && (
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{
                        backgroundColor: indicatorColor,
                      }}
                    />
                  )}
                  <span className="text-gray-400">
                    {itemConfig?.label || item.name}
                  </span>
                </div>
                {item.value !== undefined && (
                  <span className="font-mono font-medium tabular-nums text-white">
                    {Number(item.value).toLocaleString()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<
      RechartsPrimitive.LegendProps,
      "payload" | "verticalAlign"
    > & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(
  (
    {
      className,
      hideIcon = false,
      payload,
      verticalAlign = "bottom",
      nameKey,
    },
    ref
  ) => {
    const { config } = useChart();
    if (!payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400",
          verticalAlign === "top" ? "pb-4" : "pt-4",
          className
        )}
      >
        {payload.map((item, index) => {
          const key = `${
            nameKey || item.dataKey || "value"
          }`;
          const itemConfig =
            config[key] || config[item.dataKey as string];

          return (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              {!hideIcon && (
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              <span>{itemConfig?.label}</span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegend";

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
