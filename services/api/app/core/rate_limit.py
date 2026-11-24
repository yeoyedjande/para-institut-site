"""Limitation de débit en mémoire (fenêtre glissante). Suffisant pour une instance unique ;
à remplacer par un stockage partagé (Redis) dès qu'il y a plusieurs instances."""

import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import HTTPException, Request


class RateLimiter:
    def __init__(self, limit: int, window_seconds: float = 60.0) -> None:
        self.limit = limit
        self.window = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def check(self, key: str) -> None:
        now = time.monotonic()
        with self._lock:
            hits = self._hits[key]
            while hits and now - hits[0] > self.window:
                hits.popleft()
            if len(hits) >= self.limit:
                raise HTTPException(status_code=429, detail="Trop de requêtes, réessayez dans un instant.")
            hits.append(now)


def client_key(request: Request) -> str:
    return request.client.host if request.client else "unknown"
