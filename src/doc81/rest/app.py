from fastapi import FastAPI

from doc81.rest.routes import health

app = FastAPI()


app.include_router(health.router)


def main():
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
