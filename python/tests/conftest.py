"""Shared fixtures for sync and async client tests."""

import pytest
import respx

from surro.client import SurroClient
from surro.async_client import AsyncSurroClient

BASE_URL = "https://surro.io"
API_KEY = "uni_test_xxx"


@pytest.fixture
def client():
    c = SurroClient(api_key=API_KEY, base_url=BASE_URL)
    yield c
    c.close()


@pytest.fixture
async def async_client():
    c = AsyncSurroClient(api_key=API_KEY, base_url=BASE_URL)
    yield c
    await c.close()


@pytest.fixture
def mock_api():
    with respx.mock(base_url=BASE_URL) as router:
        yield router
