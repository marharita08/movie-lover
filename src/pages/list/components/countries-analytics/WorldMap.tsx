import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";

countries.registerLocale(en);

interface WorldMapProps {
  data: Record<string, number>;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const WorldMap = ({ data }: WorldMapProps) => {
  const numericToISO2 = useMemo(() => {
    const mapping: Record<string, string> = {};
    const allISO2Codes = Object.keys(countries.getAlpha2Codes());

    allISO2Codes.forEach((iso2) => {
      const numeric = countries.alpha2ToNumeric(iso2);
      if (numeric) {
        mapping[numeric] = iso2;
      }
    });

    return mapping;
  }, []);

  const maxValue = Math.max(...Object.values(data), 1);

  const getColor = (value: number) => {
    if (value === 0) return "#E0E0E0";

    const intensity = value / maxValue;

    const lightBlue = { r: 206, g: 232, b: 252 };
    const darkBlue = { r: 1, g: 31, b: 75 };

    const r = Math.round(lightBlue.r + (darkBlue.r - lightBlue.r) * intensity);
    const g = Math.round(lightBlue.g + (darkBlue.g - lightBlue.g) * intensity);
    const b = Math.round(lightBlue.b + (darkBlue.b - lightBlue.b) * intensity);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="mx-auto w-full max-w-[960px]">
      <ComposableMap
        projectionConfig={{
          scale: 147,
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const numericId = geo.id as string;
              const iso2 = numericToISO2[numericId];
              const value = iso2 ? data[iso2] || 0 : 0;
              const countryName = geo.properties.name || "Unknown";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(value)}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  data-tooltip-id="country-tooltip"
                  data-tooltip-content={`${countryName}: ${value}`}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: "#F57C00",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Tooltip id="country-tooltip" />

      <div className="flex items-center justify-center gap-2.5">
        <span className="text-sm">0</span>
        <div
          className="h-5 w-[200px] rounded border border-gray-300"
          style={{
            background: "linear-gradient(to right, #CEE8FC, #011F4B)",
          }}
        />
        <span className="text-sm">{maxValue}</span>
      </div>
    </div>
  );
};
