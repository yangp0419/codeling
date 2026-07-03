import type { ReactElement } from "react";
import { GearIcon, HelpIcon, LightningIcon } from "../icons";

export function Header(): ReactElement {
  return (
    <header className="app-header">
      <div className="logo-section">
        <span className="logo-text">CodeLing</span>
      </div>
      <div className="header-actions">
        <button className="header-btn" title="AI Fast Mode">
          <LightningIcon />
        </button>
        <button className="header-btn" title="Settings">
          <GearIcon />
        </button>
        <button className="header-btn" title="Help & Documentation">
          <HelpIcon />
        </button>
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80"
          alt="User Profile"
          className="avatar-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='28' height='28'%3E%3Ccircle cx='12' cy='12' r='12' fill='%230f2d59'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-size='12' font-family='sans-serif'%3EU%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>
    </header>
  );
}
