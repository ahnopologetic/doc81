from fastapi import FastAPI

from doc81.core.config import ServerConfig
from doc81.rest.routes import health, users, templates


def create_app() -> FastAPI:
    config = ServerConfig()
    app = FastAPI(title="Doc81 REST API", version="0.1.0", config=config)

    app.include_router(health.router)
    app.include_router(users.router)
    app.include_router(templates.router)

    return app


app = create_app()


def main():
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
