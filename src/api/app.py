# src/api/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import games, players, predictions
from .config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Hoopmetrics API",
    description="API for NBA analytics and predictions",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to NBA Analytics API",
        "version": "1.0.0",
        "endpoints": {
            "players": "/api/players",
            "games": "/api/games",
            "predictions": "/api/predictions"
        }
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(players.router)
app.include_router(games.router)
app.include_router(predictions.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)