# Deployed Pages Archive

This directory stores copies of all deployed campaign pages with deployment metadata.

## Purpose

1. **Audit trail** - Track when each page was deployed
2. **Rollback** - Restore pages if needed
3. **Analytics** - Measure deployment velocity

## Structure

```
deployed-pages/
├── miami-dade/
│   ├── window-replacement/
│   │   ├── window-replacement.html
│   │   └── deployment-info.json
│   └── hurricane-shutters/
│       ├── hurricane-shutters.html
│       └── deployment-info.json
├── broward/
└── ...
```

## Deployment Info Format

Each deployed page includes a `deployment-info.json`:

```json
{
  "deployedAt": "2026-01-15T21:00:00.000Z",
  "source": "staged-pages/miami-dade/window-replacement.html",
  "target": "florida/miami-dade/window-replacement.html",
  "liveUrl": "https://windload.co/florida/miami-dade/window-replacement",
  "deployedBy": "github-actions"
}
```
