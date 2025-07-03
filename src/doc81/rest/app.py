from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager

from doc81.core.config import ServerConfig
from doc81.core.database import init_db
from doc81.rest.routes import health, users, templates, companies


def create_app(config: ServerConfig | None = None) -> FastAPI:
    config = config or ServerConfig(mode="server")

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        init_db()
        yield

    app = FastAPI(
        title="Doc81 REST API", version="0.1.0", config=config, lifespan=lifespan
    )

    app.include_router(health.router)
    app.include_router(users.router)
    app.include_router(templates.router)
    app.include_router(companies.router)

    return app


app = create_app()


def main():
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
