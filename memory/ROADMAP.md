# Appeal Case Manager — Roadmap

## P0 (Immediate)
- User sign-off on upgraded premium reports (Full + Extensive) with real case content
- User sign-off on Barrister View strategic presentation quality

## P1 (Next)
- Multi-user case sharing model so realtime notes support cross-account collaboration
- Mention notifications and branch/thread discussion improvements in notes
- Barrister View: bind comparative sentencing/options panels to parsed report tables dynamically

## P2 (Technical / Platform)
- Refactor monolithic `backend/server.py` into dedicated routers/services (cases, documents, reports, notes, timeline, grounds)
- Harden websocket auth + add reconnect metrics/monitoring

## P3 (Release)
- Build signed Android/iOS binaries and complete store metadata/submission workflow