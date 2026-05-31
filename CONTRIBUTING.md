# Contributing

Thanks for your interest in improving this project! Contributions of all kinds
are welcome — bug reports, feature ideas, documentation fixes, and code.

## Ways to contribute

- **Report a bug** — open an issue describing what happened, what you expected,
  and steps to reproduce. Screenshots help a lot for UI issues.
- **Suggest a feature** — open an issue describing the problem you're trying to
  solve (not just the solution). Context helps us design the right thing.
- **Send a pull request** — see the workflow below.

## Development setup

See the "Quick start" section of the [README](./README.md). In short:

```bash
# backend
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# frontend (in a second terminal)
cd frontend
npm install
npm run dev
```

## Pull request workflow

1. Fork the repository and create a branch from `main`
   (`git checkout -b fix/short-description`).
2. Make your change. Keep it focused — one logical change per PR.
3. Make sure the frontend still builds: `cd frontend && npm run build`.
4. Make sure the backend imports cleanly: `cd backend && python -c "import main"`.
5. Test both languages (English and Persian) if your change touches the UI,
   since the project is fully bilingual and right-to-left aware.
6. Commit with a clear message, push your branch, and open a pull request
   describing what changed and why.

## Code style

- **Frontend:** React function components and hooks. Keep colours driven by the
  CSS theme variables (`--accent`, `--grad`, …) rather than hard-coded hex values
  so the theme/customization system keeps working.
- **Backend:** plain FastAPI + SQLAlchemy. New content sections should follow the
  existing `register_crud()` pattern and carry the `lang` column so they stay
  bilingual.
- Prefer small, readable functions and clear names over cleverness.

## Internationalization (i18n)

- Public-facing UI strings live in `frontend/src/context/LangContext.jsx` (`t()`).
- Admin-panel strings are translated via the `ta()` helper and the `ADMIN_FA`
  dictionary in the same file.
- When you add user-visible text, add both the English and Persian versions.

By contributing, you agree that your contributions will be licensed under the
project's [MIT License](./LICENSE).
